import json
import re
from typing import Any

import google.generativeai as genai
from fastapi import HTTPException
from groq import Groq
from openai import OpenAI

from app.config import settings

SYSTEM_PROMPT = """You are an expert resume writer and career coach. Your task is to tailor a candidate's resume to match a specific job description.

Given the original resume text and the job description, produce a customized resume as structured JSON with these exact fields:

{
  "summary": "A rewritten professional summary/objective aligned with the JD (2-4 sentences)",
  "skills": ["List of relevant skills highlighted and reordered to match JD priorities"],
  "experience": [
    {
      "title": "Job title",
      "company": "Company name",
      "duration": "Date range if available",
      "bullets": ["Rewritten bullet points emphasizing JD-relevant achievements and keywords"]
    }
  ],
  "education": [
    {
      "degree": "Degree name",
      "institution": "School name",
      "year": "Graduation year if available"
    }
  ],
  "missing_keywords": ["Keywords from the JD that the candidate should consider adding to their resume"],
  "improvement_tips": ["2-4 actionable suggestions to strengthen the resume for this role"]
}

Rules:
- Preserve factual accuracy — do not invent employers, degrees, or achievements.
- Rewrite and reorder content to emphasize JD-relevant experience and keywords.
- Use strong action verbs and quantify achievements where the original resume provides numbers.
- missing_keywords should list terms from the JD not clearly present in the resume.
- Return ONLY valid JSON, no markdown fences or extra commentary.
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
            try:
                return json.loads(cleaned[start : end + 1])
            except json.JSONDecodeError as exc:
                raise HTTPException(
                    status_code=502,
                    detail="LLM returned invalid JSON. Please try again.",
                ) from exc
        raise HTTPException(status_code=502, detail="LLM returned invalid JSON. Please try again.")


def _build_user_prompt(resume_text: str, job_description: str) -> str:
    return f"""## Job Description
{job_description}

## Original Resume
{resume_text}

Tailor this resume to the job description and return the structured JSON."""


def _call_gemini(resume_text: str, job_description: str) -> dict[str, Any]:
    if not settings.gemini_api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is not configured.")

    genai.configure(api_key=settings.gemini_api_key)
    model = genai.GenerativeModel(
        model_name=settings.gemini_model,
        system_instruction=SYSTEM_PROMPT,
        generation_config={"response_mime_type": "application/json"},
    )

    try:
        response = model.generate_content(_build_user_prompt(resume_text, job_description))
        return _extract_json(response.text or "")
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Gemini API error: {exc}") from exc


def _call_groq(resume_text: str, job_description: str) -> dict[str, Any]:
    if not settings.groq_api_key:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY is not configured.")

    client = Groq(api_key=settings.groq_api_key)

    try:
        response = client.chat.completions.create(
            model=settings.groq_model,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": _build_user_prompt(resume_text, job_description)},
            ],
            response_format={"type": "json_object"},
            temperature=0.4,
        )
        content = response.choices[0].message.content or ""
        return _extract_json(content)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Groq API error: {exc}") from exc


def _call_openai(resume_text: str, job_description: str) -> dict[str, Any]:
    if not settings.openai_api_key:
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY is not configured.")

    client = OpenAI(api_key=settings.openai_api_key)

    try:
        response = client.chat.completions.create(
            model=settings.openai_model,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": _build_user_prompt(resume_text, job_description)},
            ],
            response_format={"type": "json_object"},
            temperature=0.4,
        )
        content = response.choices[0].message.content or ""
        return _extract_json(content)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"OpenAI API error: {exc}") from exc


def customize_resume(resume_text: str, job_description: str) -> dict[str, Any]:
    provider = settings.llm_provider.lower()
    if provider == "openai":
        return _call_openai(resume_text, job_description)
    if provider == "groq":
        return _call_groq(resume_text, job_description)
    if provider == "gemini":
        return _call_gemini(resume_text, job_description)
    raise HTTPException(status_code=500, detail=f"Unsupported LLM provider: {provider}")
