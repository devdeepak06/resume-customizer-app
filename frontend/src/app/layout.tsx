import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { JsonLd } from "@/components/JsonLd";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Resume Customizer | AI-Powered Resume Tailoring",
    template: "%s | Resume Customizer",
  },
  description:
    "Free AI resume customizer for job seekers. Paste a job description, upload PDF or DOCX, and get ATS match scores plus a tailored resume.",
  keywords: ["resume", "customizer", "AI", "job description", "ATS", "career"],
  authors: [{ name: "Resume Customizer" }],
  robots: { index: true, follow: true },
  openGraph: {
    title: "Resume Customizer | AI-Powered Resume Tailoring",
    description:
      "Free AI resume customizer for job seekers. Paste a job description, upload PDF or DOCX, and get ATS match scores plus a tailored resume.",
    url: siteUrl,
    siteName: "Resume Customizer",
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <JsonLd />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
