import type { Metadata, Viewport } from "next";
import "./globals.css";

import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Backdrop } from "@/components/layout/Backdrop";
import { CursorGlow } from "@/components/effects/CursorGlow";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { siteConfig, siteUrl } from "@/config/site";

/* Fonts are self-hosted from npm (@fontsource packages, imported in
   globals.css) — the same Instrument Sans, Instrument Serif and JetBrains Mono
   families, with no build-time dependency on Google Fonts. */

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteConfig.defaultTitle,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  keywords: [
    "SYTMRX",
    "software",
    "applications",
    "games",
    "digital products",
    "offline-first systems",
    "experimental technology",
    "independent technology company",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteUrl,
    siteName: siteConfig.name,
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "48x48" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
  },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: "#050506",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        {/* Keyboard users land here first */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-[var(--radius-sm)] focus:bg-[var(--color-bone-50)] focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-[var(--color-ink-950)]"
        >
          Skip to content
        </a>

        <MotionProvider>
          <Backdrop />
          <CursorGlow />

          <div className="relative flex min-h-dvh flex-col">
            <SiteHeader />
            <main id="main" className="flex-1">
              {children}
            </main>
            <SiteFooter />
          </div>
        </MotionProvider>
      </body>
    </html>
  );
}
