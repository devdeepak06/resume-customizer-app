import type { CustomizeResponse } from "@/types/resume";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function customizeResume(
  jobDescription: string,
  resumeFile: File
): Promise<CustomizeResponse> {
  const formData = new FormData();
  formData.append("job_description", jobDescription);
  formData.append("resume", resumeFile);

  const response = await fetch(`${API_BASE_URL}/api/customize`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message =
      errorBody?.detail ??
      `Request failed with status ${response.status}`;
    throw new Error(
      typeof message === "string" ? message : JSON.stringify(message)
    );
  }

  return response.json();
}

export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}
