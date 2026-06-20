"use client";

import { useState } from "react";
import { Loader2, Wand2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { JobDescriptionInput, MIN_JD_LENGTH } from "@/components/JobDescriptionInput";
import { ResumeUpload } from "@/components/ResumeUpload";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { customizeResume } from "@/lib/api";
import type { CustomizeResponse } from "@/types/resume";

export function ResumeCustomizer() {
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CustomizeResponse | null>(null);

  const canSubmit =
    jobDescription.trim().length >= MIN_JD_LENGTH && resumeFile !== null && !loading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || !resumeFile) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await customizeResume(jobDescription.trim(), resumeFile);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>
            <CardDescription>
              Paste a job description and upload your resume to get a tailored version.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <JobDescriptionInput
                value={jobDescription}
                onChange={setJobDescription}
                disabled={loading}
              />
              <ResumeUpload
                file={resumeFile}
                onFileChange={setResumeFile}
                disabled={loading}
              />

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={!canSubmit}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Customizing your resume...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Customize Resume
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div>
          {loading && (
            <Card>
              <CardHeader>
                <CardTitle>Results</CardTitle>
                <CardDescription>
                  AI is analyzing and tailoring your resume...
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-48 w-full" />
              </CardContent>
            </Card>
          )}

          {!loading && result && <ResultsDisplay result={result} />}

          {!loading && !result && (
            <Card className="flex h-full min-h-[400px] items-center justify-center border-dashed">
              <CardContent className="text-center">
                <Wand2 className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
                <p className="text-sm font-medium text-muted-foreground">
                  Your customized resume will appear here
                </p>
                <p className="mt-1 text-xs text-muted-foreground/70">
                  Fill in the job description and upload your resume to get started
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
