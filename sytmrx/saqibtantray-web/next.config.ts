import type { NextConfig } from "next";

/**
 * Security headers.
 *
 * The CSP is intentionally strict. Notes:
 *  - 'unsafe-inline' for styles is required by Next.js + Tailwind's injected
 *    critical CSS. Scripts use 'strict-dynamic'-free nonce-less inline only for
 *    Next's bootstrap, so 'unsafe-inline' is present for scripts in production
 *    builds of the App Router; this is the standard Next.js posture.
 *  - img-src allows data: for the inline SVG noise texture and blob: for
 *    next/image in dev.
 *  - No third-party analytics, so no external script origins are permitted.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  // GitHub API (server-side) and release asset redirects initiated by the user.
  "connect-src 'self' https://api.github.com",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  // Pin the workspace root so the build never infers it from a lockfile in a
  // parent directory.
  turbopack: { root: __dirname },

  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  images: {
    formats: ["image/avif", "image/webp"],
    // Screenshots live in /public. No remote patterns are needed, which keeps
    // the image optimiser closed to arbitrary external hosts.
    remotePatterns: [],
  },

  // Next.js already serves /_next/static with immutable, long-lived caching,
  // so only the security headers are declared here.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
