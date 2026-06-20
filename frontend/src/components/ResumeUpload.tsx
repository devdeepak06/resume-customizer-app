"use client";

import { useCallback, useRef, useState } from "react";
import { FileText, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const ALLOWED_EXTENSIONS = [".pdf", ".docx"];
const MAX_SIZE_MB = 10;

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function validateFile(file: File): string | null {
  const ext = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
  if (
    !ALLOWED_EXTENSIONS.includes(ext) &&
    !ALLOWED_TYPES.includes(file.type)
  ) {
    return "Only PDF and DOCX files are supported.";
  }
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return `File must be under ${MAX_SIZE_MB} MB.`;
  }
  return null;
}

interface ResumeUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  disabled?: boolean;
}

export function ResumeUpload({
  file,
  onFileChange,
  disabled,
}: ResumeUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    (selected: File | null) => {
      if (!selected) {
        onFileChange(null);
        setError(null);
        return;
      }
      const validationError = validateFile(selected);
      if (validationError) {
        setError(validationError);
        onFileChange(null);
        return;
      }
      setError(null);
      onFileChange(selected);
    },
    [onFileChange]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (disabled) return;
      const dropped = e.dataTransfer.files[0];
      if (dropped) handleFile(dropped);
    },
    [disabled, handleFile]
  );

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Resume (PDF or DOCX)</label>

      {!file ? (
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
          }}
          onClick={() => !disabled && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled) setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors",
            dragOver
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
            disabled && "pointer-events-none opacity-50"
          )}
        >
          <Upload className="mb-3 h-10 w-10 text-muted-foreground" />
          <p className="text-sm font-medium">
            Drag & drop your resume here, or click to browse
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            PDF or DOCX, up to {MAX_SIZE_MB} MB
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-4">
          <FileText className="h-8 w-8 shrink-0 text-primary" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(file.size)}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => handleFile(null)}
            disabled={disabled}
            aria-label="Remove file"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        disabled={disabled}
      />

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
