import type { Project, Repo } from "./types";
import { placeholder } from "@/lib/placeholder";

/**
 * ============================================================================
 * PRODUCT DATA — the single source of truth for this website.
 * ============================================================================
 *
 * Adding a product = adding one object to this array. No new components needed.
 *
 * IMPORTANT — nothing here may be invented:
 *   • `version` / `releaseDate` stay `null` until a build is actually published.
 *   • download `url` stays `placeholder(...)` until a real release asset exists.
 *   • `size` / `sha256` stay `null` until read off the real asset.
 *   • `screenshots[].src` stays `null` until a real image is added to /public.
 *   • `technologies` lists only stacks that are actually known.
 *   • `features` lists only capabilities that genuinely exist.
 *   • `detailsPending: true` marks a product whose capabilities have not been
 *     documented yet — the UI then shows an honest "details not published"
 *     state instead of padded, invented copy.
 *
 * Search this file for "REPLACE_ME" to find everything awaiting real data.
 */

export const projects: Project[] = [
  {
    slug: "offline-institute-management",
    name: "Offline Institute Management",
    tagline: "Institute operations that keep working without a connection.",
    description:
      "An offline-first institute management system for students, admissions, fees, attendance, batches and records — built to run without constant internet connectivity.",
    longDescription: [
      "Offline Institute Management is a system for running the day-to-day operations of an institute: student records, admissions, fees, attendance, batches and general record keeping.",
      "It is built offline-first. The application is designed to work without a constant internet connection, so the people using it are never blocked by a network that is slow, intermittent or entirely unavailable.",
    ],
    category: "mobile-app",
    status: "in-development",
    platforms: ["android"],
    version: null,
    releaseDate: null,
    icon: "OI",
    accent: ["#c9a469", "#6a5b3f"],
    screenshots: [
      {
        // REPLACE_ME: add a real screenshot to /public/screenshots/ and set src
        // plus its true intrinsic width/height so it is never distorted.
        src: null,
        alt: "Offline Institute Management — student records screen",
        frame: "phone",
        caption: null,
      },
      {
        src: null,
        alt: "Offline Institute Management — attendance and batches view",
        frame: "phone",
        caption: null,
      },
    ],
    problem:
      "Institute administration often has to continue during network outages, yet most management software assumes a live connection and stops being usable the moment that assumption fails.",
    solution:
      "Keep the operational workflow local to the device so records, admissions, fees and attendance can all be handled without waiting on connectivity.",
    features: [
      "Student records management",
      "Admissions handling",
      "Fees management",
      "Attendance tracking",
      "Batch management",
      "Works without a constant internet connection",
    ],
    technologies: ["Android"],
    architecture: [
      { label: "Approach", value: "Offline-first, local to the device" },
      { label: "Network", value: "Not required for day-to-day operation" },
    ],
    requirements: [
      // REPLACE_ME: confirm the true minimum Android version once minSdk is set.
      "Android device",
    ],
    offline: true,
    // REPLACE_ME: set to { name: "<repo>" } once this product's repository
    // exists in the SYTMRX organisation. Until then no repo link is shown.
    repository: null,
    liveUrl: null,
    // Resolved automatically from published GitHub Releases as soon as
    // `repository` above is set and a release exists.
    releaseSource: "github-release",
    releaseChannel: "stable",
    // Static fallback only, used if the GitHub API is unavailable. No URL is
    // declared, so nothing is downloadable until a real release exists.
    downloads: {
      android: {
        url: placeholder("RELEASE_URL_ANDROID"),
        filename: null,
        size: null,
        sha256: null,
        note: null,
      },
    },
    changelog: [],
    featured: true,
    layout: "feature",
    order: 1,
  },

  {
    slug: "yourcart",
    name: "YourCart",
    tagline: "A local marketplace connecting customers and merchants.",
    description:
      "A local marketplace and commerce application built around products, merchant management, ordering and marketplace functionality.",
    longDescription: [
      "YourCart is a local marketplace and commerce application. It connects customers with merchants, covering product listings, merchant management and the ordering flow.",
    ],
    category: "mobile-app",
    status: "in-development",
    platforms: ["android"],
    version: null,
    releaseDate: null,
    icon: "YC",
    accent: ["#8fb8a8", "#3f5a52"],
    screenshots: [
      {
        src: null,
        alt: "YourCart — marketplace product listing",
        frame: "phone",
        caption: null,
      },
      {
        src: null,
        alt: "YourCart — merchant management view",
        frame: "phone",
        caption: null,
      },
    ],
    problem:
      "Customers and nearby merchants often have no shared digital space for browsing products and placing orders locally.",
    solution:
      "Provide a marketplace where merchants manage their products and customers browse and order through a single application.",
    features: [
      "Product listings",
      "Merchant management",
      "Ordering",
      "Marketplace functionality",
    ],
    technologies: [],
    architecture: [],
    requirements: ["Android device"],
    offline: false,
    // REPLACE_ME: set to { name: "<repo>" } once this product's repository
    // exists in the SYTMRX organisation. Until then no repo link is shown.
    repository: null,
    liveUrl: null,
    // Resolved automatically from published GitHub Releases as soon as
    // `repository` above is set and a release exists.
    releaseSource: "github-release",
    releaseChannel: "stable",
    downloads: {},
    changelog: [],
    featured: true,
    layout: "horizontal",
    order: 2,
  },

  {
    slug: "kids-learning-app",
    name: "Kids Learning App",
    tagline: "Interactive learning and activities for children.",
    description:
      "A children's educational application focused on interactive learning and activities.",
    longDescription: [
      "Kids Learning App is a children's educational application built around interactive learning and activities.",
    ],
    category: "mobile-app",
    status: "in-development",
    platforms: ["android"],
    version: null,
    releaseDate: null,
    icon: "KL",
    accent: ["#d9a17a", "#6b4a38"],
    screenshots: [
      {
        src: null,
        alt: "Kids Learning App — interactive activity screen",
        frame: "phone",
        caption: null,
      },
    ],
    problem: null,
    solution: null,
    features: ["Interactive learning", "Activities for children"],
    technologies: [],
    architecture: [],
    requirements: ["Android device"],
    offline: false,
    // REPLACE_ME: set to { name: "<repo>" } once this product's repository
    // exists in the SYTMRX organisation. Until then no repo link is shown.
    repository: null,
    liveUrl: null,
    // Resolved automatically from published GitHub Releases as soon as
    // `repository` above is set and a release exists.
    releaseSource: "github-release",
    releaseChannel: "stable",
    downloads: {},
    changelog: [],
    featured: true,
    layout: "compact",
    order: 3,
  },

  {
    slug: "mesh-messenger",
    name: "Mesh Messenger",
    tagline: "Device-to-device communication without conventional infrastructure.",
    description:
      "An experimental communication project exploring direct device-to-device messaging that does not rely on conventional internet infrastructure.",
    longDescription: [
      "Mesh Messenger is an experimental project exploring device-to-device communication — messaging that works directly between devices rather than depending on conventional internet infrastructure.",
      "It is an active area of experimentation rather than a finished product. Capabilities are documented here only once they are actually implemented.",
    ],
    category: "experiment",
    status: "experimental",
    platforms: ["android"],
    version: null,
    releaseDate: null,
    icon: "MM",
    accent: ["#93a7c9", "#3c4759"],
    screenshots: [
      {
        src: null,
        alt: "Mesh Messenger — device-to-device messaging interface",
        frame: "phone",
        caption: null,
      },
    ],
    problem:
      "Conventional messaging depends on infrastructure that is not always present — during outages, in remote areas, or wherever network coverage is unreliable.",
    solution:
      "Explore direct device-to-device communication as an alternative path for messages when conventional infrastructure is unavailable.",
    features: ["Device-to-device communication", "Operates without conventional internet infrastructure"],
    technologies: [],
    architecture: [
      { label: "Stage", value: "Experimental — under active exploration" },
    ],
    requirements: ["Android device"],
    offline: true,
    // REPLACE_ME: set to { name: "<repo>" } once this product's repository
    // exists in the SYTMRX organisation. Until then no repo link is shown.
    repository: null,
    liveUrl: null,
    // Resolved automatically from published GitHub Releases as soon as
    // `repository` above is set and a release exists.
    releaseSource: "github-release",
    releaseChannel: "stable",
    downloads: {},
    changelog: [],
    featured: false,
    layout: "compact",
    order: 4,
  },

  {
    slug: "bloom",
    name: "Bloom",
    tagline: "A SYTMRX digital product.",
    description: "A digital product in development at SYTMRX.",
    // No public documentation yet — deliberately left empty rather than padded
    // with invented detail. Fill this in once the product is documented.
    longDescription: [],
    category: "mobile-app",
    status: "in-development",
    platforms: [],
    version: null,
    releaseDate: null,
    icon: "BL",
    accent: ["#c58fa8", "#5a3a47"],
    screenshots: [],
    problem: null,
    solution: null,
    features: [],
    technologies: [],
    architecture: [],
    requirements: [],
    offline: false,
    // REPLACE_ME: set to { name: "<repo>" } once this product's repository
    // exists in the SYTMRX organisation. Until then no repo link is shown.
    repository: null,
    liveUrl: null,
    // Resolved automatically from published GitHub Releases as soon as
    // `repository` above is set and a release exists.
    releaseSource: "github-release",
    releaseChannel: "stable",
    downloads: {},
    changelog: [],
    featured: false,
    layout: "compact",
    order: 5,
    // REPLACE_ME: set to false and fill in the fields above once Bloom's
    // capabilities are ready to be described publicly.
    detailsPending: true,
  },

  {
    slug: "stack",
    name: "Stack",
    tagline: "A SYTMRX digital product.",
    description: "A digital product in development at SYTMRX.",
    longDescription: [],
    category: "mobile-app",
    status: "in-development",
    platforms: [],
    version: null,
    releaseDate: null,
    icon: "ST",
    accent: ["#9a9ac2", "#43435c"],
    screenshots: [],
    problem: null,
    solution: null,
    features: [],
    technologies: [],
    architecture: [],
    requirements: [],
    offline: false,
    // REPLACE_ME: set to { name: "<repo>" } once this product's repository
    // exists in the SYTMRX organisation. Until then no repo link is shown.
    repository: null,
    liveUrl: null,
    // Resolved automatically from published GitHub Releases as soon as
    // `repository` above is set and a release exists.
    releaseSource: "github-release",
    releaseChannel: "stable",
    downloads: {},
    changelog: [],
    featured: false,
    layout: "compact",
    order: 6,
    // REPLACE_ME: set to false and fill in the fields above once Stack's
    // capabilities are ready to be described publicly.
    detailsPending: true,
  },
];

/**
 * ============================================================================
 * TEMPLATE — copy this block into the array above to add a new product.
 * ============================================================================
 *
 * {
 *   slug: "my-product",
 *   name: "My Product",
 *   tagline: "One line describing what it does.",
 *   description: "One or two sentences for cards and metadata.",
 *   longDescription: ["Paragraph one.", "Paragraph two."],
 *   category: "mobile-app",           // mobile-app | desktop-app | web-app | game | tool | library | experiment
 *   status: "in-development",         // released | beta | in-development | experimental | concept | archived
 *   platforms: ["android"],           // android | windows | macos | linux | ios | web
 *   version: null,                    // "1.0.0" once released
 *   releaseDate: null,                // "2026-01-31" once released
 *   icon: "MP",                       // 2-letter monogram
 *   accent: ["#c9a469", "#6a5b3f"],   // gradient for generated previews
 *   screenshots: [{ src: null, alt: "Describe the screen", frame: "phone" }],
 *   problem: null,                    // string once documented
 *   solution: null,
 *   features: [],                     // only real, implemented capabilities
 *   technologies: [],                 // only stacks that are actually known
 *   architecture: [],
 *   requirements: [],
 *   offline: false,
 *   githubUrl: placeholder("GITHUB_REPOSITORY_URL"),
 *   liveUrl: null,
 *   downloads: {},
 *   changelog: [],
 *   featured: false,
 *   layout: "compact",                // feature | horizontal | compact | showcase
 *   order: 7,
 * }
 */

/**
 * Repositories surfaced in the "Open source & experiments" section.
 * Listed manually — no fabricated stats. Star counts are only ever shown when
 * the GitHub API actually returns them.
 */
export const repos: Repo[] = [
  /**
   * Repositories shown in the "Open source" section.
   *
   * These are the repositories that actually exist under the configured
   * GitHub owner. Descriptions and languages are filled in live from the
   * GitHub API when it is reachable; the values below are only the offline
   * fallback, so nothing here asserts more than the repository's existence.
   *
   * Set `projectSlug` once a repository is confirmed to back a product on
   * this site — that also links the card to the product page.
   */
  {
    name: "offlinemesh",
    description: "Source repository in the SYTMRX organisation.",
    language: "TypeScript",
  },
  {
    name: "crispy-system",
    description: "Source repository in the SYTMRX organisation.",
    language: null,
  },
];

/* ------------------------------------------------------------------------- */
/* Selectors                                                                   */
/* ------------------------------------------------------------------------- */

const byOrder = (a: Project, b: Project) => a.order - b.order;

export const allProjects = (): Project[] => [...projects].sort(byOrder);

export const featuredProjects = (): Project[] =>
  allProjects().filter((p) => p.featured);

export const projectSlugs = (): string[] => projects.map((p) => p.slug);

export const getProject = (slug: string): Project | undefined =>
  projects.find((p) => p.slug === slug);

/** Products that declare at least one download entry (published or pending). */
export const downloadableProjects = (): Project[] =>
  allProjects().filter((p) => Object.keys(p.downloads).length > 0);
