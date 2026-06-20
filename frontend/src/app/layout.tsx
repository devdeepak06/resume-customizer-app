import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next"
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Resume Customizer | AI-powered resume customization",
  description:
    "Tailor your resume to any job description using AI-powered customization. Upload your resume and job description, and get a customized version of your resume that is tailored to the job description.",
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
      <head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="keywords" content="resume, customizer, ai, job description, customization" />
        <meta name="title" content="Resume Customizer | AI-powered resume customization" />
        <meta name="description" content="Tailor your resume to any job description using AI-powered customization. Upload your resume and job description, and get a customized version of your resume that is tailored to the job description." />
        <meta name="author" content="Resume Customizer" />
        <meta name="publisher" content="Resume Customizer" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />
        <meta name="yandexbot" content="index, follow" />
        <meta name="sitemap" content="https://resume-customizer.com/sitemap.xml" />
        
        <meta property="og:title" content="Resume Customizer | AI-powered resume customization" />
        <meta property="og:description" content="Tailor your resume to any job description using AI-powered customization. Upload your resume and job description, and get a customized version of your resume that is tailored to the job description." />
        <meta property="og:image" content="https://resume-customizer.com/og-image.png" />
        <meta property="og:url" content="https://resume-customizer.com" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content="Resume Customizer" />
        <meta property="og:image:width" content="1200" />
        
      </head>
      <body className="min-h-full flex flex-col">{children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
