import Link from "next/link";
import { navItems } from "@/config/nav";
import { contactConfig, mailtoUrl, siteConfig } from "@/config/site";
import { BrandMark } from "@/components/ui/BrandMark";
import { GithubMark, InstagramMark } from "@/components/ui/BrandIcons";

export function SiteFooter() {
  const items = navItems();
  // Derived at render time, never hardcoded.
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-auto border-t border-[var(--color-line)]">
      <div className="gutter mx-auto max-w-[1600px] py-12 md:py-16">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2.5">
              <BrandMark
                aria-hidden="true"
                className="size-6 text-[var(--color-bone-50)]"
              />
              <span className="text-[15px] font-semibold tracking-[0.14em] text-[var(--color-bone-50)] uppercase">
                {siteConfig.name}
              </span>
            </Link>
            <p className="mt-3 text-[13.5px] leading-relaxed text-[var(--color-bone-500)]">
              {siteConfig.disciplines}
            </p>
          </div>

          {/* Contact */}
          <div>
            <p className="label">Contact</p>
            <ul className="mt-4 flex flex-col gap-2.5">
              <li>
                <a
                  href={contactConfig.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-[13.5px] text-[var(--color-bone-400)] transition-colors hover:text-[var(--color-bone-50)]"
                >
                  <InstagramMark aria-hidden="true" className="size-3.5" />
                  Instagram: @{contactConfig.instagramHandle}
                </a>
              </li>
              <li>
                <a
                  href={mailtoUrl}
                  className="group inline-flex items-center gap-2 text-[13.5px] text-[var(--color-bone-400)] transition-colors hover:text-[var(--color-bone-50)]"
                >
                  Email: {contactConfig.email}
                </a>
              </li>
              <li>
                <a
                  href={`https://github.com/${contactConfig.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-[13.5px] text-[var(--color-bone-400)] transition-colors hover:text-[var(--color-bone-50)]"
                >
                  <GithubMark aria-hidden="true" className="size-3.5" />
                  GitHub: {contactConfig.github}
                </a>
              </li>
            </ul>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer">
            <p className="label">Site</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-12 gap-y-3 sm:flex sm:flex-col sm:gap-3">
              {items.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-[13.5px] text-[var(--color-bone-400)] transition-colors hover:text-[var(--color-bone-50)]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col-reverse gap-4 border-t border-[var(--color-line)] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.08em] text-[var(--color-bone-600)]">
            © {year} {siteConfig.name}
          </p>
          <p className="text-[13px] text-[var(--color-bone-500)]">
            {siteConfig.disciplines}
          </p>
        </div>
      </div>
    </footer>
  );
}
