import type { Metadata } from "next";
import { ArrowUpRight, AtSign, Link2 } from "lucide-react";

import { contactConfig, mailtoUrl, siteConfig } from "@/config/site";
import { isPlaceholder, placeholderKey } from "@/lib/placeholder";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { InstagramMark } from "@/components/ui/BrandIcons";
import { CopyButton } from "@/components/ui/CopyButton";
import { ShareButton } from "@/components/ui/ShareButton";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${siteConfig.name} — software, applications, games and digital products.`,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `Contact — ${siteConfig.name}`,
    description: `Get in touch with ${siteConfig.name}.`,
    url: "/contact",
  },
};

/**
 * /contact — a minimal contact interface.
 *
 * No form: a form needs a backend, and the architecture deliberately avoids
 * unnecessary backend infrastructure. Direct channels only.
 *
 * Every channel is configuration-driven. Unconfigured channels render as an
 * explicit "not published yet" row naming the key to set — never a fake address.
 */

interface Channel {
  label: string;
  value: string;
  href: string | null;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  pendingKey: string;
  external: boolean;
  /** Raw value offered to the clipboard, when copying makes sense. */
  copyValue?: string;
}

function buildChannels(): Channel[] {
  const channels: Channel[] = [];

  const instagramConfigured = !isPlaceholder(contactConfig.instagram);
  channels.push({
    label: "Instagram",
    value: instagramConfigured
      ? `@${contactConfig.instagramHandle}`
      : "Not published yet",
    href: instagramConfigured ? contactConfig.instagram : null,
    icon: InstagramMark,
    pendingKey: placeholderKey(contactConfig.instagram),
    external: true,
    copyValue: instagramConfigured ? contactConfig.instagram : undefined,
  });

  const emailConfigured = !isPlaceholder(contactConfig.email);
  channels.push({
    label: "Email",
    value: emailConfigured ? contactConfig.email : "Not published yet",
    href: emailConfigured ? mailtoUrl : null,
    icon: AtSign,
    pendingKey: placeholderKey(contactConfig.email),
    external: false,
    copyValue: emailConfigured ? contactConfig.email : undefined,
  });

  contactConfig.other.forEach((link) => {
    const configured = !isPlaceholder(link.url);
    channels.push({
      label: link.label,
      value: configured ? link.url : "Not published yet",
      href: configured ? link.url : null,
      icon: Link2,
      pendingKey: placeholderKey(link.url),
      external: true,
    });
  });

  return channels;
}

export default function ContactPage() {
  const channels = buildChannels();

  return (
    <>
      <PageHeader
        label="Contact"
        title={
          <>
            Have a project in{" "}
            <span className="serif-accent text-[var(--color-brass-300)]">mind?</span>
          </>
        }
        description="Open to conversations about software, applications, games and digital products. Direct channels only — no forms, no tracking."
      />

      <div className="gutter mx-auto max-w-[1600px] pb-24 md:pb-32">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ul className="grid gap-0">
              {channels.map((channel, index) => {
                const Icon = channel.icon;

                /* The copy control is a sibling of the link, never a child of
                   it: a <button> inside an <a> is invalid HTML and swallows the
                   anchor's activation. The row is a flex container holding the
                   link and the button side by side. */
                const linkInner = (
                  <>
                    <span className="label w-6 shrink-0 text-[var(--color-bone-600)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <Icon
                      aria-hidden={true}
                      className="size-4 shrink-0 text-[var(--color-bone-500)]"
                    />
                    <span className="w-16 shrink-0 text-[14px] text-[var(--color-bone-200)] sm:w-24">
                      {channel.label}
                    </span>
                    <span
                      className={
                        channel.href
                          ? "min-w-0 flex-1 truncate text-[14px] text-[var(--color-bone-400)] transition-colors group-hover:text-[var(--color-bone-50)]"
                          : "min-w-0 flex-1 truncate text-[14px] text-[var(--color-bone-600)]"
                      }
                    >
                      {channel.value}
                    </span>
                    {channel.href && (
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-4 shrink-0 text-[var(--color-bone-600)] transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--color-bone-200)]"
                      />
                    )}
                  </>
                );

                const linkClass =
                  "group flex min-h-16 flex-1 items-center gap-3 py-4 sm:gap-4";

                return (
                  <li
                    key={channel.label}
                    className="flex items-center gap-2 border-b border-[var(--color-line)] transition-colors duration-300 hover:border-[var(--color-line-strong)]"
                  >
                    {channel.href ? (
                      channel.external ? (
                        <a
                          href={channel.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={linkClass}
                        >
                          {linkInner}
                        </a>
                      ) : (
                        <a href={channel.href} className={linkClass}>
                          {linkInner}
                        </a>
                      )
                    ) : (
                      <div className={linkClass} title={`Set ${channel.pendingKey}`}>
                        {linkInner}
                      </div>
                    )}

                    {channel.copyValue && (
                      <CopyButton
                        value={channel.copyValue}
                        label={`${channel.label} ${channel.label === "Email" ? "address" : "link"}`}
                        className="shrink-0"
                      />
                    )}
                  </li>
                );
              })}
            </ul>

            {/* Primary actions — both channels as direct, obvious buttons */}
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href={mailtoUrl}
                className="group inline-flex h-12 items-center gap-2.5 rounded-[var(--radius-sm)] bg-[var(--color-bone-50)] px-6 text-[14.5px] font-medium text-[var(--color-ink-950)] transition-colors duration-300 hover:bg-white"
              >
                <AtSign aria-hidden="true" className="size-4" />
                Email us
              </a>
              <a
                href={contactConfig.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-12 items-center gap-2.5 rounded-[var(--radius-sm)] border border-[var(--color-line-strong)] bg-white/[0.02] px-6 text-[14.5px] font-medium text-[var(--color-bone-50)] transition-all duration-300 hover:border-white/25 hover:bg-white/[0.06]"
              >
                <InstagramMark aria-hidden="true" className="size-4" />
                Instagram
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-3.5 opacity-60 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
              <ShareButton
                title={`${siteConfig.name} — ${siteConfig.disciplines}`}
                text={siteConfig.description}
                className="h-12 px-6 text-[14.5px]"
              />
            </div>
          </div>

          <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9">
            <div className="border-t border-[var(--color-line)] pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
              <p className="label">Response</p>
              <p className="mt-5 max-w-[38ch] text-[14.5px] leading-[1.75] text-[var(--color-bone-400)]">
                Email is the most reliable way to reach {siteConfig.name}. For anything
                about a specific product — a bug, a build that will not install, a
                feature request — include the product name so it reaches the right
                place quickly.
              </p>

              <p className="label mt-10">Privacy</p>
              <p className="mt-5 max-w-[38ch] text-[14.5px] leading-[1.75] text-[var(--color-bone-400)]">
                This site runs no analytics and sets no tracking cookies. Nothing you do
                here is recorded.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}
