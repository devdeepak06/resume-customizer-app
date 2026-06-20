from typing import Optional

from pydantic import BaseModel, Field


class ExperienceItem(BaseModel):
    title: str = ""
    company: str = ""
    duration: str = ""
    bullets: list[str] = Field(default_factory=list)


class EducationItem(BaseModel):
    degree: str = ""
    institution: str = ""
    year: str = ""


class CustomizedResume(BaseModel):
    summary: str = ""
    skills: list[str] = Field(default_factory=list)
    experience: list[ExperienceItem] = Field(default_factory=list)
    education: list[EducationItem] = Field(default_factory=list)
    missing_keywords: list[str] = Field(default_factory=list)
    improvement_tips: list[str] = Field(default_factory=list)


class MatchAnalysis(BaseModel):
    match_score: float = Field(ge=0, le=100)
    matched_keywords: list[str] = Field(default_factory=list)
    suggested_missing_keywords: list[str] = Field(default_factory=list)
    scoring_error: Optional[str] = None


class CustomizeResponse(BaseModel):
    match_analysis: MatchAnalysis
    customized_resume: CustomizedResume
    original_text_length: int
