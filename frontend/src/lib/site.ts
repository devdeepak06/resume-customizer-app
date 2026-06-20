const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://resume-customizer-app.vercel.app";

export function getSiteUrl(): string {
  return siteUrl.replace(/\/$/, "");
}
