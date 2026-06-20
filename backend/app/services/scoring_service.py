import json
import re
from typing import Any

import google.generativeai as genai
from groq import Groq
from openai import OpenAI
from pydantic import ValidationError

from app.config import settings
from app.models import MatchAnalysis

ATS_SYSTEM_PROMPT = """You are an expert Applicant Tracking System (ATS) evaluator. Analyze how well a candidate's resume matches a job description.

Evaluate semantically — not by exact string matching. Recognize:
- Synonyms and related terms (e.g., "Generative AI" matches "GenAI", "LLMs", "large language models")
- Abbreviations and expansions (e.g., "AWS" matches cloud platform experience, "K8s" matches Kubernetes)
- Contextual experience (e.g., building REST APIs implies API design skills even if not stated verbatim)
- Transferable skills that satisfy JD requirements

Return ONLY valid JSON with this exact structure:
{
  "matchScore": <number 0-100, how well the resume fits the JD overall>,
  "matchedKeywords": [<JD requirements/skills the resume demonstrates, including semantic equivalents>],
  "suggestedMissingKeywords": [<important JD requirements NOT evidenced in the resume>]
}

Rules:
- matchScore: 0 = no fit, 100 = excellent fit. Be fair — reward semantic matches, not just exact words.
- matchedKeywords: 5-15 concise items the candidate clearly satisfies (use JD terminology where possible).
- suggestedMissingKeywords: 0-10 gaps worth addressing; omit trivial or nice-to-have items.
- Return ONLY JSON, no markdown fences or commentary.
"""


def _extract_json(text: str) -> dict[str, Any]:
    cleaned = text.strip()
    fence_match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", cleaned)
    if fence_match:
        cleaned = fence_match.group(1).strip()

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        start = cleaned.find("{")
        end = cleaned.rfind("}")
        if start != -1 and end != -1:
            return json.loads(cleaned[start : end + 1])
        raise


def _normalize_payload(raw: dict[str, Any]) -> dict[str, Any]:
    return {
        "match_score": raw.get("matchScore", raw.get("match_score", 0)),
        "matched_keywords": raw.get("matchedKeywords", raw.get("matched_keywords", [])),
        "suggested_missing_keywords": raw.get(
            "suggestedMissingKeywords", raw.get("suggested_missing_keywords", [])
        ),
    }


def _build_user_prompt(resume_text: str, job_description: str) -> str:
    return f"""## Job Description
{job_description}

## Resume
{resume_text}

Evaluate this resume against the job description and return the JSON scoring object."""


def _parse_scoring_response(content: str) -> MatchAnalysis:
    raw = _extract_json(content)
    normalized = _normalize_payload(raw)
    return MatchAnalysis(**normalized)


def _scoring_error(provider: str, message: str) -> MatchAnalysis:
    return MatchAnalysis(
        match_score=0.0,
        matched_keywords=[],
        suggested_missing_keywords=[],
        scoring_error=f"{provider} scoring error: {message}",
    )


def _call_groq_scoring(resume_text: str, job_description: str) -> MatchAnalysis:
    if not settings.groq_api_key:
        return _scoring_error("Groq", "GROQ_API_KEY is not configured.")

    client = Groq(api_key=settings.groq_api_key)
    response = client.chat.completions.create(
        model=settings.groq_model,
        messages=[
            {"role": "system", "content": ATS_SYSTEM_PROMPT},
            {"role": "user", "content": _build_user_prompt(resume_text, job_description)},
        ],
        response_format={"type": "json_object"},
        temperature=0.2,
    )
    content = response.choices[0].message.content or ""
    return _parse_scoring_response(content)


def _call_openai_scoring(resume_text: str, job_description: str) -> MatchAnalysis:
    if not settings.openai_api_key:
        return _scoring_error("OpenAI", "OPENAI_API_KEY is not configured.")

    client = OpenAI(api_key=settings.openai_api_key)
    response = client.chat.completions.create(
        model=settings.openai_model,
        messages=[
            {"role": "system", "content": ATS_SYSTEM_PROMPT},
            {"role": "user", "content": _build_user_prompt(resume_text, job_description)},
        ],
        response_format={"type": "json_object"},
        temperature=0.2,
    )
    content = response.choices[0].message.content or ""
    return _parse_scoring_response(content)


def _call_gemini_scoring(resume_text: str, job_description: str) -> MatchAnalysis:
    if not settings.gemini_api_key:
        return _scoring_error("Gemini", "GEMINI_API_KEY is not configured.")

    genai.configure(api_key=settings.gemini_api_key)
    model = genai.GenerativeModel(
        model_name=settings.gemini_model,
        system_instruction=ATS_SYSTEM_PROMPT,
        generation_config={"response_mime_type": "application/json"},
    )
    response = model.generate_content(_build_user_prompt(resume_text, job_description))
    return _parse_scoring_response(response.text or "")


def evaluate_semantic_match(resume_text: str, job_description: str) -> MatchAnalysis:
    provider = settings.llm_provider.lower()

    try:
        if provider == "groq":
            return _call_groq_scoring(resume_text, job_description)
        if provider == "openai":
            return _call_openai_scoring(resume_text, job_description)
        if provider == "gemini":
            return _call_gemini_scoring(resume_text, job_description)
        return _scoring_error("Config", f"Unsupported LLM provider: {provider}")
    except ValidationError as exc:
        return _scoring_error(provider, f"Invalid scoring response format: {exc}")
    except json.JSONDecodeError as exc:
        return _scoring_error(provider, f"Failed to parse scoring JSON: {exc}")
    except Exception as exc:
        return _scoring_error(provider.capitalize(), str(exc))
