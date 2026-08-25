export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

/**
 * Primary navigation.
 *
 * "Products" is the software catalogue (/apps) — everything with a build.
 * "Projects" is the full body of work (/projects), including experiments.
 */
export function navItems(): NavItem[] {
  return [
    { label: "Products", href: "/apps" },
    { label: "Projects", href: "/projects" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];
}
