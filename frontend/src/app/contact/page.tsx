import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Resume Customizer for support, feedback, or partnership inquiries.",
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight">Contact Us</h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Have a question, bug report, or feature suggestion? We would love to hear
            from you. Resume Customizer is an open-source project maintained for job
            seekers worldwide.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            For technical issues, please open an issue on our{" "}
            <a
              href="https://github.com/devdeepak06/resume-customizer-app"
              className="underline hover:text-foreground"
              rel="noopener noreferrer"
              target="_blank"
            >
              GitHub repository
            </a>
            . For general inquiries, email us at{" "}
            <a href="mailto:support@resume-customizer.app" className="underline hover:text-foreground">
              support@resume-customizer.app
            </a>
            .
          </p>
          <p className="mt-6 text-sm">
            <Link href="/" className="underline hover:text-foreground">
              Back to home
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
