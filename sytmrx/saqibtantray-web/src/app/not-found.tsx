import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function NotFound() {
  const links = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/apps" },
    { label: "Projects", href: "/projects" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <div className="gutter mx-auto flex min-h-[70vh] max-w-[1600px] flex-col justify-center py-24">
      <p className="label">Error 404</p>

      <h1 className="display mt-8 text-[clamp(3rem,12vw,8rem)]">
        Page not
        <br />
        <span className="serif-accent text-[var(--color-brass-300)]">found.</span>
      </h1>

      <p className="mt-8 max-w-[48ch] text-[15px] leading-[1.7] text-[var(--color-bone-400)]">
        This route does not exist. It may have been moved, or the link that brought you
        here may be out of date.
      </p>

      <nav aria-label="Recovery" className="mt-12 max-w-md">
        <ul className="grid gap-0">
          {links.map((link, index) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group flex min-h-14 items-center gap-4 border-b border-[var(--color-line)] py-3 transition-colors hover:border-[var(--color-line-strong)]"
              >
                <span className="label w-6">{String(index + 1).padStart(2, "0")}</span>
                <span className="flex-1 text-[15px] text-[var(--color-bone-200)] transition-colors group-hover:text-[var(--color-bone-50)]">
                  {link.label}
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 text-[var(--color-bone-600)] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
