import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Hero } from "@/components/home/Hero";
import { Founder } from "@/components/home/Founder";
import { FocusAreas } from "@/components/home/FocusAreas";
import { CurrentlyBuilding } from "@/components/home/CurrentlyBuilding";
import { StackSection } from "@/components/home/StackSection";
import { GithubOrg } from "@/components/home/GithubOrg";
import { AppsStrip } from "@/components/home/AppsStrip";
import { Philosophy } from "@/components/home/Philosophy";
import { ContactCta } from "@/components/home/ContactCta";
import { Section, SectionHeader } from "@/components/ui/Section";
import { ProjectShowcase } from "@/components/projects/ProjectShowcase";
import { featuredProjects } from "@/data/projects";
import { getProjectReleases } from "@/lib/project-release";
import { staticRelease } from "@/lib/downloads";
import { contactConfig, githubProfileUrl, siteConfig, siteUrl } from "@/config/site";

/* Fully static; the GitHub-derived sections revalidate hourly via fetch cache. */
export const revalidate = 3600;

export default async function HomePage() {
  const featured = featuredProjects();
  // Resolved once on the server and passed down; components stay presentational.
  const releases = await getProjectReleases(featured);

  /* Structured data: Organization + Person + WebSite.
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
        founder: { "@id": `${siteUrl}/#founder` },
        sameAs: [githubProfileUrl(), contactConfig.instagram],
      },
      {
        "@type": "Person",
        "@id": `${siteUrl}/#founder`,
        name: "Saqib Tantray",
        jobTitle: "Independent Software Developer & Product Builder",
        description:
          "Independent developer building Android launchers, productivity and focus tools, AI assistants, business systems and web platforms under the SYTMRX label.",
        url: siteUrl,
        sameAs: [githubProfileUrl(), contactConfig.instagram],
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

      {/* Lead — who builds SYTMRX */}
      <Section id="founder" ariaLabel="Who builds SYTMRX">
        <div className="mb-10 flex items-center gap-4 border-b border-[var(--color-line)] pb-4 md:mb-14">
          <span className="label text-[var(--color-bone-600)]">00</span>
          <span className="label text-[var(--color-bone-400)]">The developer</span>
          <span aria-hidden="true" className="h-px flex-1 bg-[var(--color-line)]" />
        </div>
        <Founder />
      </Section>

      {/* 01 — Selected Work */}
      <Section id="work" ariaLabel="Selected products">
        <SectionHeader
          index="01"
          label="Selected products"
          title={
            <>
              What has been{" "}
              <span className="serif-accent text-[var(--color-brass-300)]">engineered</span>
            </>
          }
          description="Each product is presented with the information that actually matters: what it does, what it runs on, how far along it is — and where its source lives."
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

      {/* 03 — Engineering focus */}
      <Section id="focus" ariaLabel="Engineering focus">
        <FocusAreas />
      </Section>

      {/* 04 — Currently building */}
      <Section id="building" ariaLabel="Currently building">
        <CurrentlyBuilding />
      </Section>

      {/* 05 — Philosophy (full-bleed) */}
      <Philosophy />

      {/* 06 — Verified stack */}
      <Section id="stack" ariaLabel="Verified technology stack">
        <StackSection />
      </Section>

      {/* 07 — GitHub organisation */}
      <Section id="github" ariaLabel="GitHub organisation">
        <GithubOrg />
      </Section>

      {/* 08 — Contact */}
      <ContactCta />
    </>
  );
}
