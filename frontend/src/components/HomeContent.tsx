import Link from "next/link";

export function HomeContent() {
  return (
    <>
      <section
        id="how-it-works"
        aria-labelledby="how-it-works-heading"
        className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8"
      >
        <h2 id="how-it-works-heading" className="text-2xl font-bold tracking-tight">
          How It Works
        </h2>
        <p className="mt-3 max-w-3xl text-muted-foreground leading-relaxed">
          Resume Customizer helps you stand out in competitive job markets by aligning
          your resume with each role you apply for. Instead of sending the same generic
          document to every employer, you paste the job description, upload your current
          resume as a PDF or DOCX file, and our AI rewrites key sections to highlight
          the experience and skills recruiters are looking for.
        </p>
        <ol className="mt-6 grid gap-4 sm:grid-cols-3">
          <li className="rounded-lg border bg-card p-4">
            <strong className="font-semibold">1. Paste the job description</strong>
            <p className="mt-2 text-sm text-muted-foreground">
              Include required skills, responsibilities, and qualifications so the AI
              understands what the employer values most.
            </p>
          </li>
          <li className="rounded-lg border bg-card p-4">
            <strong className="font-semibold">2. Upload your resume</strong>
            <p className="mt-2 text-sm text-muted-foreground">
              We extract text from PDF and Word documents, then analyze how well your
              background matches the role using semantic ATS scoring.
            </p>
          </li>
          <li className="rounded-lg border bg-card p-4">
            <strong className="font-semibold">3. Review and download</strong>
            <p className="mt-2 text-sm text-muted-foreground">
              Get a tailored summary, reordered skills, rewritten bullets, missing
              keyword suggestions, and a downloadable text version.
            </p>
          </li>
        </ol>
      </section>

      <section
        id="features"
        aria-labelledby="features-heading"
        className="mx-auto max-w-7xl border-t px-4 py-12 sm:px-6 lg:px-8"
      >
        <h2 id="features-heading" className="text-2xl font-bold tracking-tight">
          Why Use Resume Customizer?
        </h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <article className="space-y-2">
            <h3 className="font-semibold">Semantic ATS Match Score</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Our scoring engine recognizes synonyms and abbreviations — so experience
              with GenAI, LLMs, or AWS counts even when the job description uses
              different wording. You see matched requirements and gaps before you apply.
            </p>
          </article>
          <article className="space-y-2">
            <h3 className="font-semibold">Keyword Gap Analysis</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Identify missing keywords from the job description that you should add to
              strengthen your application. The tool surfaces actionable suggestions without
              inventing experience you do not have.
            </p>
          </article>
          <article className="space-y-2">
            <h3 className="font-semibold">AI-Tailored Rewrites</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The professional summary, skills list, and experience bullets are rewritten
              to emphasize relevance while preserving factual accuracy from your original
              resume.
            </p>
          </article>
          <article className="space-y-2">
            <h3 className="font-semibold">Privacy-First Processing</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Resumes are processed for customization and not stored permanently. Read our{" "}
              <Link href="/privacy" className="underline hover:text-foreground">
                Privacy Policy
              </Link>{" "}
              for full details on data handling.
            </p>
          </article>
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          Questions? Visit our{" "}
          <Link href="/about" className="underline hover:text-foreground">
            About page
          </Link>{" "}
          or{" "}
          <Link href="/contact" className="underline hover:text-foreground">
            contact us
          </Link>
          . By using this tool you agree to our{" "}
          <Link href="/terms" className="underline hover:text-foreground">
            Terms of Service
          </Link>
          .
        </p>
      </section>
    </>
  );
}
