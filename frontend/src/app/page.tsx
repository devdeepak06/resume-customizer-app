import { ResumeCustomizer } from "@/components/ResumeCustomizer";
import { HomeContent } from "@/components/HomeContent";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section
          aria-labelledby="page-title"
          className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8"
        >
          <h1 id="page-title" className="text-3xl font-bold tracking-tight">
            Resume Customizer
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Tailor your resume to any job description with AI-powered semantic ATS
            scoring and keyword analysis.
          </p>
        </section>

        <section aria-label="Resume customization tool" className="px-4 py-8 sm:px-6 lg:px-8">
          <ResumeCustomizer />
        </section>

        <HomeContent />
      </main>
      <SiteFooter />
    </>
  );
}
