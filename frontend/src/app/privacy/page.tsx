import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for Resume Customizer — how we handle resume uploads and job description data.",
};

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="mt-2 text-sm text-muted-foreground">Last updated: June 2026</p>

          <section className="mt-8 space-y-4 text-muted-foreground leading-relaxed">
            <h2 className="text-lg font-semibold text-foreground">Information We Collect</h2>
            <p>
              When you use Resume Customizer, you voluntarily submit a job description
              and upload a resume file (PDF or DOCX). This data is sent to our backend
              API solely for processing and customization. We do not require account
              registration.
            </p>

            <h2 className="text-lg font-semibold text-foreground">How We Use Your Data</h2>
            <p>
              Your resume text and job description are processed in real time by AI
              services to generate tailored content and match scores. Files are not
              stored permanently on our servers after processing completes.
            </p>

            <h2 className="text-lg font-semibold text-foreground">Third-Party Services</h2>
            <p>
              We use third-party LLM providers (such as Groq, Google Gemini, or OpenAI)
              to power AI features. Data sent to these providers is subject to their
              respective privacy policies. We use Vercel Analytics for anonymous usage
              statistics.
            </p>

            <h2 className="text-lg font-semibold text-foreground">Your Rights</h2>
            <p>
              You may stop using the service at any time. Because we do not persist
              uploaded resumes, there is no stored data to delete. For questions, contact
              us via the{" "}
              <Link href="/contact" className="underline hover:text-foreground">
                contact page
              </Link>
              .
            </p>
          </section>

          <p className="mt-8 text-sm">
            <Link href="/terms" className="underline hover:text-foreground">
              Terms of Service
            </Link>{" "}
            ·{" "}
            <Link href="/" className="underline hover:text-foreground">
              Back to home
            </Link>
          </p>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
