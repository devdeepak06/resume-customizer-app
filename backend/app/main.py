from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.models import CustomizeResponse, CustomizedResume, MatchAnalysis
from app.services.llm_service import customize_resume
from app.services.scoring_service import evaluate_semantic_match
from app.utils.document_parser import (
    parse_resume,
    read_file_with_size_check,
    validate_resume_file,
)

app = FastAPI(
    title="Resume Customizer API",
    description="Tailor resumes to job descriptions using LLM-powered customization.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MAX_UPLOAD_BYTES = settings.max_upload_size_mb * 1024 * 1024
MIN_JD_LENGTH = 50


@app.get("/")
async def root():
    return {
        "name": "Resume Customizer API",
        "docs": "/docs",
        "health": "/health",
        "customize": "POST /api/customize",
        "frontend": "Run the Next.js app at http://localhost:3000",
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "llm_provider": settings.llm_provider,
    }


@app.post("/api/customize", response_model=CustomizeResponse)
async def customize(
    job_description: str = Form(...),
    resume: UploadFile = File(...),
):
    jd = job_description.strip()
    if not jd:
        raise HTTPException(status_code=400, detail="Job description is required.")
    if len(jd) < MIN_JD_LENGTH:
        raise HTTPException(
            status_code=400,
            detail=f"Job description must be at least {MIN_JD_LENGTH} characters.",
        )

    extension = validate_resume_file(resume, MAX_UPLOAD_BYTES)
    content = await read_file_with_size_check(resume, MAX_UPLOAD_BYTES)
    resume_text = parse_resume(content, extension)

    match_analysis = evaluate_semantic_match(resume_text, jd)

    llm_result = customize_resume(resume_text, jd)
    customized = CustomizedResume(**llm_result)

    if not customized.missing_keywords and match_analysis.suggested_missing_keywords:
        customized.missing_keywords = match_analysis.suggested_missing_keywords[:10]

    return CustomizeResponse(
        match_analysis=match_analysis,
        customized_resume=customized,
        original_text_length=len(resume_text),
    )
