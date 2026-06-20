import type { CustomizedResume } from "@/types/resume";

export function formatResumeAsText(resume: CustomizedResume): string {
  const lines: string[] = [];

  lines.push("PROFESSIONAL SUMMARY");
  lines.push("=".repeat(50));
  lines.push(resume.summary);
  lines.push("");

  if (resume.skills.length > 0) {
    lines.push("SKILLS");
    lines.push("=".repeat(50));
    lines.push(resume.skills.join(" • "));
    lines.push("");
  }

  if (resume.experience.length > 0) {
    lines.push("EXPERIENCE");
    lines.push("=".repeat(50));
    for (const exp of resume.experience) {
      lines.push(`${exp.title}${exp.company ? ` | ${exp.company}` : ""}`);
      if (exp.duration) lines.push(exp.duration);
      for (const bullet of exp.bullets) {
        lines.push(`  • ${bullet}`);
      }
      lines.push("");
    }
  }

  if (resume.education.length > 0) {
    lines.push("EDUCATION");
    lines.push("=".repeat(50));
    for (const edu of resume.education) {
      const parts = [edu.degree, edu.institution, edu.year].filter(Boolean);
      lines.push(parts.join(" | "));
    }
    lines.push("");
  }

  if (resume.missing_keywords.length > 0) {
    lines.push("SUGGESTED KEYWORDS TO ADD");
    lines.push("=".repeat(50));
    lines.push(resume.missing_keywords.join(", "));
    lines.push("");
  }

  if (resume.improvement_tips.length > 0) {
    lines.push("IMPROVEMENT TIPS");
    lines.push("=".repeat(50));
    for (const tip of resume.improvement_tips) {
      lines.push(`  • ${tip}`);
    }
  }

  return lines.join("\n");
}

export function downloadResumeText(resume: CustomizedResume, filename = "customized-resume.txt") {
  const text = formatResumeAsText(resume);
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
