"use client";

import { CheckCircle2, Download, Lightbulb, Sparkles, Tag } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { downloadResumeText } from "@/lib/download";
import type { CustomizeResponse } from "@/types/resume";

interface ResultsDisplayProps {
  result: CustomizeResponse;
}

function getScoreColor(score: number): string {
  if (score >= 70) return "text-green-600 dark:text-green-400";
  if (score >= 40) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
}

export function ResultsDisplay({ result }: ResultsDisplayProps) {
  const { customized_resume: resume, match_analysis } = result;
  const { match_score, matched_keywords, suggested_missing_keywords, scoring_error } =
    match_analysis;

  const missingKeywords =
    suggested_missing_keywords.length > 0
      ? suggested_missing_keywords
      : resume.missing_keywords;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                ATS Match Score
              </CardTitle>
              <CardDescription>
                Semantic analysis of your resume against the job description
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadResumeText(resume)}
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {scoring_error ? (
            <Alert variant="destructive">
              <AlertDescription>{scoring_error}</AlertDescription>
            </Alert>
          ) : (
            <div className="flex items-center gap-4">
              <span
                className={`text-4xl font-bold tabular-nums ${getScoreColor(match_score)}`}
              >
                {match_score}%
              </span>
              <Progress value={match_score} className="flex-1" />
            </div>
          )}
        </CardContent>
      </Card>

      {matched_keywords.length > 0 && (
        <Card className="border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              Matched Requirements
            </CardTitle>
            <CardDescription>
              JD requirements your resume satisfies (including synonyms and related experience)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {matched_keywords.map((keyword) => (
                <Badge
                  key={keyword}
                  variant="outline"
                  className="border-green-300 bg-green-100 text-green-800 dark:border-green-700 dark:bg-green-900/40 dark:text-green-200"
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {missingKeywords.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Tag className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              Suggested Missing Keywords
            </CardTitle>
            <CardDescription>
              Important JD requirements not clearly evidenced in your resume
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {missingKeywords.map((keyword) => (
                <Badge
                  key={keyword}
                  variant="outline"
                  className="border-amber-300 bg-amber-100 text-amber-800 dark:border-amber-700 dark:bg-amber-900/40 dark:text-amber-200"
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Professional Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="leading-relaxed text-muted-foreground">
            {resume.summary}
          </p>
        </CardContent>
      </Card>

      {resume.skills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {resume.skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {resume.experience.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Experience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {resume.experience.map((exp, idx) => (
              <div key={idx} className="space-y-2">
                <div>
                  <h4 className="font-semibold">{exp.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {[exp.company, exp.duration].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  {exp.bullets.map((bullet, bIdx) => (
                    <li key={bIdx}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {resume.education.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Education</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {resume.education.map((edu, idx) => (
              <div key={idx}>
                <p className="font-medium">{edu.degree}</p>
                <p className="text-sm text-muted-foreground">
                  {[edu.institution, edu.year].filter(Boolean).join(" · ")}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {resume.improvement_tips.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Lightbulb className="h-4 w-4 text-primary" />
              Improvement Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {resume.improvement_tips.map((tip, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
