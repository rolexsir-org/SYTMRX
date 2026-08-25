import { ImageResponse } from "next/og";
import { getProject, projectSlugs } from "@/data/projects";
import { platformMeta, sortPlatforms, statusMeta, formatVersion } from "@/lib/meta";
import { siteConfig } from "@/config/site";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return projectSlugs().map((slug) => ({ slug }));
}

export async function generateImageMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const project = getProject(params.slug);
  return [
    {
      id: "default",
      size,
      contentType,
      alt: project ? `${project.name} — ${project.tagline}` : siteConfig.name,
    },
  ];
}

/** Project-specific OG image. Renders only real metadata — never invented values. */
export default async function ProjectOgImage({
  params,
}: {
  params: { slug: string };
}) {
  const project = getProject(params.slug);

  if (!project) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#050506",
            color: "#f4f4f2",
            fontSize: "64px",
            fontFamily: "sans-serif",
          }}
        >
          {siteConfig.name}
        </div>
      ),
      { ...size },
    );
  }

  const [from, to] = project.accent;
  const platforms = sortPlatforms(project.platforms)
    .map((p) => platformMeta[p].label)
    .join(" · ");

  const facts = [
    { k: "Platform", v: platforms || "—" },
    { k: "Version", v: formatVersion(project.version) },
    { k: "Status", v: statusMeta[project.status].label },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#050506",
          padding: "72px",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: "-180px",
            top: "-160px",
            width: "760px",
            height: "660px",
            display: "flex",
            background: `radial-gradient(circle at center, ${from}33 0%, rgba(0,0,0,0) 68%)`,
          }}
        />

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "64px",
                height: "64px",
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.16)",
                background: `linear-gradient(150deg, ${from}44, ${to}22)`,
                color: "#f4f4f2",
                fontSize: "22px",
              }}
            >
              {project.icon}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: "20px",
                color: "#8d8d92",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              {siteConfig.name}
            </div>
          </div>
        </div>

        {/* Title */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: "88px",
              lineHeight: 1.02,
              letterSpacing: "-0.04em",
              color: "#f4f4f2",
              fontWeight: 600,
              maxWidth: "1000px",
            }}
          >
            {project.name}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: "26px",
              fontSize: "34px",
              lineHeight: 1.3,
              letterSpacing: "-0.02em",
              color: "#cfcfcb",
              maxWidth: "900px",
            }}
          >
            {project.tagline}
          </div>
        </div>

        {/* Facts */}
        <div
          style={{
            display: "flex",
            gap: "72px",
            borderTop: "1px solid rgba(255,255,255,0.10)",
            paddingTop: "28px",
          }}
        >
          {facts.map((fact) => (
            <div
              key={fact.k}
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: "16px",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#6a6a71",
                }}
              >
                {fact.k}
              </div>
              <div style={{ display: "flex", fontSize: "26px", color: "#cfcfcb" }}>
                {fact.v}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
