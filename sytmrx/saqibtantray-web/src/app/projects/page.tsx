import type { Metadata } from "next";

import { allProjects } from "@/data/projects";
import { getProjectReleases } from "@/lib/project-release";
import { staticRelease } from "@/lib/downloads";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProjectShowcase } from "@/components/projects/ProjectShowcase";
import { Section } from "@/components/ui/Section";
import type { ProjectLayout } from "@/data/types";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "The full body of work from SYTMRX — software, applications, games, offline-first systems and experimental technology.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects — SYTMRX",
    description:
      "Software, applications, games, offline-first systems and experimental technology.",
    url: "/projects",
  },
};

/**
 * Alternating composition rhythm so no two consecutive projects share a layout.
 * The first project always gets the largest treatment.
 */
const RHYTHM: ProjectLayout[] = ["feature", "horizontal", "showcase", "horizontal"];

export default async function ProjectsPage() {
  const projects = allProjects();
  const releases = await getProjectReleases(projects);

  return (
    <>
      <PageHeader
        label="Index"
        title={
          <>
            The full body of{" "}
            <span className="serif-accent text-[var(--color-brass-300)]">work</span>
          </>
        }
        description="Everything listed here is real work in progress or released software. Versions, sizes and dates are only shown once a build actually exists."
        meta={
          <p className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.14em] text-[var(--color-bone-500)] uppercase">
            {projects.length} {projects.length === 1 ? "project" : "projects"}
          </p>
        }
      />

      <Section className="pt-4 md:pt-6">
        {projects.length === 0 ? (
          <p className="border-t border-[var(--color-line)] py-16 text-[15px] text-[var(--color-bone-400)]">
            No projects have been added yet.
          </p>
        ) : (
          <div className="flex flex-col gap-20 md:gap-32">
            {projects.map((project, index) => (
              <ProjectShowcase
                key={project.slug}
                project={project}
                release={releases.get(project.slug) ?? staticRelease(project)}
                index={index + 1}
                layout={RHYTHM[index % RHYTHM.length]}
                priority={index === 0}
                // Direct children of the page <h1> on this route.
                headingLevel="h2"
              />
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
