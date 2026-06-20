import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for using the Resume Customizer web application.",
};

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
          <p className="mt-2 text-sm text-muted-foreground">Last updated: June 2026</p>

          <section className="mt-8 space-y-4 text-muted-foreground leading-relaxed">
            <h2 className="text-lg font-semibold text-foreground">Acceptance of Terms</h2>
            <p>
              By accessing or using Resume Customizer, you agree to these Terms of
              Service. If you do not agree, please do not use the application.
            </p>

            <h2 className="text-lg font-semibold text-foreground">Service Description</h2>
            <p>
              Resume Customizer provides AI-assisted resume tailoring for informational
              purposes. Results are suggestions only and do not guarantee employment,
              interviews, or ATS passage.
            </p>

            <h2 className="text-lg font-semibold text-foreground">User Responsibilities</h2>
            <p>
              You are responsible for reviewing all AI-generated content for accuracy
              before using it in job applications. Do not upload documents you do not
              have the right to use. Do not misuse the service for unlawful purposes.
            </p>

            <h2 className="text-lg font-semibold text-foreground">Limitation of Liability</h2>
            <p>
              The service is provided &quot;as is&quot; without warranties. We are not
              liable for any damages arising from use of generated resume content or
              match scores.
            </p>
          </section>

          <p className="mt-8 text-sm">
            <Link href="/privacy" className="underline hover:text-foreground">
              Privacy Policy
            </Link>{" "}
            ·{" "}
            <Link href="/contact" className="underline hover:text-foreground">
              Contact
            </Link>
          </p>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
