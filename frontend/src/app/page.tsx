import { ResumeCustomizer } from "@/components/ResumeCustomizer";
import { FileText } from "lucide-react";

export default function Home() {
  return (
    <main className="flex-1">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              Resume Customizer
            </h1>
            <p className="text-sm text-muted-foreground">
              Tailor your resume to any job description with AI
            </p>
          </div>
        </div>
      </header>

      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <ResumeCustomizer />
      </div>
    </main>
  );
}
