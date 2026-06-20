export interface ExperienceItem {
  title: string;
  company: string;
  duration: string;
  bullets: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  year: string;
}

export interface CustomizedResume {
  summary: string;
  skills: string[];
  experience: ExperienceItem[];
  education: EducationItem[];
  missing_keywords: string[];
  improvement_tips: string[];
}

export interface MatchAnalysis {
  match_score: number;
  matched_keywords: string[];
  suggested_missing_keywords: string[];
  scoring_error?: string | null;
}

export interface CustomizeResponse {
  match_analysis: MatchAnalysis;
  customized_resume: CustomizedResume;
  original_text_length: number;
}
