import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Hero } from "@/components/home/Hero";
import { AppsStrip } from "@/components/home/AppsStrip";
import { Capabilities } from "@/components/home/Capabilities";
import { Philosophy } from "@/components/home/Philosophy";
import { OpenSource } from "@/components/home/OpenSource";
import { ContactCta } from "@/components/home/ContactCta";
import { Section, SectionHeader } from "@/components/ui/Section";
import { ProjectShowcase } from "@/components/projects/ProjectShowcase";
import { featuredProjects } from "@/data/projects";
import { getProjectReleases } from "@/lib/project-release";
import { staticRelease } from "@/lib/downloads";
import { contactConfig, siteConfig, siteUrl } from "@/config/site";

/* Fully static; the GitHub section revalidates hourly via fetch cache. */
export const revalidate = 3600;

export default async function HomePage() {
  const featured = featuredProjects();
  // Resolved once on the server and passed down; components stay presentational.
  const releases = await getProjectReleases(featured);

  /* Structured data: Organization + WebSite.
     Only facts already stated on the page — no employee count, founding date,
     address or any other claim the site does not make. */
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: siteConfig.name,
        description: siteConfig.description,
        url: siteUrl,
        email: contactConfig.email,
        sameAs: [contactConfig.instagram],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: siteConfig.defaultTitle,
        description: siteConfig.description,
        publisher: { "@id": `${siteUrl}/#organization` },
        inLanguage: "en",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Static, developer-authored object — safe to serialise.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Hero />

      {/* 01 — Selected Work */}
      <Section id="work" ariaLabel="Selected products">
        <SectionHeader
          index="01"
          label="Selected products"
          title={
            <>
              What we{" "}
              <span className="serif-accent text-[var(--color-brass-300)]">build</span>
            </>
          }
          description="Each product is presented with the information that actually matters: what it does, what it runs on, and how far along it is."
          action={
            <Link
              href="/projects"
              className="group inline-flex items-center gap-1.5 text-[13px] text-[var(--color-bone-400)] transition-colors hover:text-[var(--color-bone-50)]"
            >
              All work
              <ArrowUpRight
                aria-hidden="true"
                className="size-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          }
        />

        <div className="mt-14 flex flex-col gap-20 md:mt-20 md:gap-28">
          {featured.map((project, index) => (
            <ProjectShowcase
              key={project.slug}
              project={project}
              release={releases.get(project.slug) ?? staticRelease(project)}
              index={index + 1}
              priority={index === 0}
            />
          ))}
        </div>
      </Section>

      {/* 02 — Software */}
      <Section id="software" ariaLabel="Software and apps">
        <AppsStrip />
      </Section>

      {/* 03 — Capabilities */}
      <Section id="capabilities" ariaLabel="Capabilities">
        <Capabilities />
      </Section>

      {/* 04 — Philosophy (full-bleed) */}
      <Philosophy />

      {/* 05 — Open source */}
      <Section id="open-source" ariaLabel="Open source and experiments">
        <OpenSource />
      </Section>

      {/* 06 — Contact */}
      <ContactCta />
    </>
  );
}
