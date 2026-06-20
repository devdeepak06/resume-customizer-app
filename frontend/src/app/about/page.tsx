import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Resume Customizer — an AI tool that helps job seekers tailor resumes to job descriptions with ATS scoring.",
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight">About Resume Customizer</h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Resume Customizer is a free web application built for job seekers who want
            to improve their chances of passing Applicant Tracking Systems (ATS) and
            impressing hiring managers. The tool uses large language models to analyze
            your resume against a specific job description and produce a tailored version
            that highlights relevant skills, experience, and keywords.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Unlike simple keyword matchers, our semantic scoring recognizes synonyms,
            abbreviations, and contextual experience — so terms like GenAI, LLMs, and
            cloud platforms are matched intelligently against job requirements.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            We believe every application deserves a resume that speaks directly to the
            role. Resume Customizer automates the tedious rewriting process while keeping
            your facts accurate and your voice professional.
          </p>
          <p className="mt-6 text-sm">
            <Link href="/contact" className="underline hover:text-foreground">
              Contact us
            </Link>{" "}
            ·{" "}
            <Link href="/privacy" className="underline hover:text-foreground">
              Privacy Policy
            </Link>
          </p>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
