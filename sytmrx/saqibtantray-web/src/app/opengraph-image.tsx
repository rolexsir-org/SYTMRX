import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const runtime = "nodejs";
export const alt = `${siteConfig.name} — ${siteConfig.disciplines}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Default Open Graph image, generated at build time.
 * Visual language matches the site: near-black, hairline grid, brass accent.
 * Uses only system-available font stacks so it never needs a network fetch.
 */
export default async function OpengraphImage() {
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
        {/* Grid texture */}
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
        {/* Brass glow */}
        <div
          style={{
            position: "absolute",
            right: "-160px",
            bottom: "-220px",
            width: "780px",
            height: "620px",
            display: "flex",
            background:
              "radial-gradient(circle at center, rgba(201,164,105,0.22) 0%, rgba(201,164,105,0) 68%)",
          }}
        />
        {/* Cool glow */}
        <div
          style={{
            position: "absolute",
            left: "-140px",
            top: "-200px",
            width: "620px",
            height: "520px",
            display: "flex",
            background:
              "radial-gradient(circle at center, rgba(120,140,180,0.16) 0%, rgba(120,140,180,0) 68%)",
          }}
        />

        {/* Top row */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "44px",
              height: "44px",
              borderRadius: "11px",
              border: "1px solid rgba(255,255,255,0.16)",
              background: "rgba(255,255,255,0.03)",
              color: "#f4f4f2",
              fontSize: "17px",
              letterSpacing: "-0.02em",
            }}
          >
            SX
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "20px",
              color: "#8d8d92",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            {siteConfig.disciplines}
          </div>
        </div>

        {/* Name + positioning */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: "132px",
              lineHeight: 1,
              letterSpacing: "0.02em",
              color: "#f4f4f2",
              fontWeight: 700,
            }}
          >
            SYTMRX
          </div>
          <div
            style={{
              display: "flex",
              marginTop: "34px",
              fontSize: "38px",
              lineHeight: 1.25,
              letterSpacing: "-0.025em",
              color: "#cfcfcb",
              maxWidth: "900px",
            }}
          >
            We build software, games, and digital products.
          </div>
        </div>

        {/* Bottom rule */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.10)",
            paddingTop: "28px",
          }}
        >
          <div style={{ display: "flex", fontSize: "22px", color: "#8a8a92" }}>
            {siteConfig.disciplines}
          </div>
          <div style={{ display: "flex", fontSize: "22px", color: "#c9a469" }}>
            Independent technology company
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
