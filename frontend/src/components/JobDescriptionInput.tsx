"use client";

import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const MIN_LENGTH = 50;

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function JobDescriptionInput({
  value,
  onChange,
  disabled,
}: JobDescriptionInputProps) {
  const charCount = value.trim().length;
  const isValid = charCount >= MIN_LENGTH;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor="job-description" className="text-sm font-medium">
          Job Description
        </label>
        <span
          className={cn(
            "text-xs",
            isValid ? "text-muted-foreground" : "text-destructive"
          )}
        >
          {charCount} / {MIN_LENGTH} min characters
        </span>
      </div>
      <Textarea
        id="job-description"
        placeholder="Paste the full job description here. Include required skills, responsibilities, and qualifications for best results..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={12}
        className="resize-none"
      />
      {!isValid && charCount > 0 && (
        <p className="text-xs text-destructive">
          Please enter at least {MIN_LENGTH} characters.
        </p>
      )}
    </div>
  );
}

export { MIN_LENGTH as MIN_JD_LENGTH };
