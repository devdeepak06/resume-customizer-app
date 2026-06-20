import { getSiteUrl } from "@/lib/site";

export function JsonLd() {
  const baseUrl = getSiteUrl();

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        name: "Resume Customizer",
        url: baseUrl,
        logo: `${baseUrl}/favicon.ico`,
        sameAs: [
          "https://github.com/devdeepak06/resume-customizer-app",
        ],
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${baseUrl}/#software`,
        name: "Resume Customizer",
        url: baseUrl,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        description:
          "AI-powered resume customizer that tailors your resume to job descriptions with semantic ATS scoring and keyword analysis.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        publisher: { "@id": `${baseUrl}/#organization` },
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        url: baseUrl,
        name: "Resume Customizer",
        publisher: { "@id": `${baseUrl}/#organization` },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
