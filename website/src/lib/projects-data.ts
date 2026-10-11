// Delivered projects shown as proof of work on /work (and on a product's page when the
// project is tagged with that product). Managed in the admin portal → Projects, stored
// in the Firestore "projects" collection. PROJECTS_FALLBACK is only used when Firestore
// is unreachable; it stays empty so nothing unverified is ever shown.
export type ProjectDoc = { title: string; url: string };

export type Project = {
  name: string;
  /** Client or organisation the project was built for */
  client: string;
  industry: string;
  year?: string;
  summary: string;
  /** What Yubhian delivered, e.g. ["Web app", "AI chatbot"] */
  services: string[];
  /** Public link to the live product, if any */
  url?: string;
  /** Screenshot image URLs (uploaded through the admin) */
  screenshots: string[];
  /** Supporting links: case study, documentation, app store listing, press… */
  documents: ProjectDoc[];
  /** Slug of a Yubhian product this project belongs to (shows it on that product's page) */
  productSlug?: string;
};

export const PROJECTS_FALLBACK: Project[] = [];

const shot = (slug: string) => [`/projects/opt/${slug}-1440.webp`];

// Live projects Yubhian has delivered. Always shown on the Work page (after any projects
// added in the admin). Descriptions come from each live site; screenshots are of their
// homepages (public/projects, optimised by scripts/optimize-images.mjs).
export const DELIVERED_PROJECTS: Project[] = [
  {
    name: "Vishnu Women's University",
    client: "Sri Vishnu Educational Society",
    industry: "Higher education",
    summary: "The official website of Vishnu Women's University — the first private university for women in the Telugu states — covering academics, admissions, placements, research, campus life and events.",
    services: ["University website", "Web design", "Development"],
    url: "https://vwu.edu.in",
    screenshots: shot("vwu"),
    documents: [],
  },
  {
    name: "FPMS — Faculty Performance Management System",
    client: "Sri Vishnu Educational Society",
    industry: "Higher education",
    summary: "Digitises and automates faculty performance evaluation against NAAC, NBA and NIRF requirements, with a 300-point framework, streamlined reviews, progress tracking and generated insights.",
    services: ["Web application", "Accreditation workflows"],
    url: "https://vishnufpms.in",
    screenshots: shot("fpms"),
    documents: [],
  },
  {
    name: "Vishnu Student Success Centre",
    client: "Sri Vishnu Educational Society",
    industry: "Higher education",
    summary: "A platform for the Student Success Centre that supports students' academic and personal journeys — services, events by category, and student registration.",
    services: ["Web platform", "Web design"],
    url: "https://www.vishnussc.in",
    screenshots: shot("ssc"),
    documents: [],
  },
  {
    name: "Vishnu Tech Hub",
    client: "Sri Vishnu Educational Society",
    industry: "Education & innovation",
    summary: "The website of Vishnu Tech Hub, the software development and innovation hub where student engineers design, build and ship real products.",
    services: ["Website", "Web design"],
    url: "https://vishnutechhub.in",
    screenshots: shot("techhub"),
    documents: [],
  },
  {
    name: "VITB Placement Portal — CRT Attendance",
    client: "Vishnu Institute of Technology",
    industry: "Higher education",
    summary: "A Campus Recruitment Training (CRT) attendance management portal for students and staff, with secure sign-in and dashboards.",
    services: ["Web application", "Attendance management"],
    url: "https://vishnucrt.in",
    screenshots: shot("crt"),
    documents: [],
  },
  {
    name: "Vishnu Transportation",
    client: "Sri Vishnu Educational Society",
    industry: "Campus transport",
    summary: "A college bus management portal: students track their bus pass, view schedules and timings, and manage their transport details in one place.",
    services: ["Web application", "Transport management"],
    url: "https://vishnutransport.in",
    screenshots: shot("transport"),
    documents: [],
  },
  {
    name: "Vishnu Wellness Center",
    client: "Sri Vishnu Educational Society",
    industry: "Health & wellbeing",
    summary: "A wellness platform for booking therapy sessions with certified psychologists and tracking a personal wellness journey, with self-guided resources and articles.",
    services: ["Web platform", "Booking system"],
    url: "https://vishnuwellnesscenter.in",
    screenshots: shot("wellness"),
    documents: [],
  },
  {
    name: "Aqua Lab Management System",
    client: "",
    industry: "Aquaculture",
    summary: "A professional aquaculture laboratory management and report generation system, with secure sign-in to the laboratory dashboard.",
    services: ["Web application", "Report generation"],
    url: "https://www.twladc.in",
    screenshots: shot("twladc"),
    documents: [],
  },
];

function asStringList(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === "string" && v.trim() !== "");
  if (typeof value === "string") return value.split(",").map((s) => s.trim()).filter(Boolean);
  return [];
}

/** Comparable form of a website address: no scheme, no "www.", no trailing slash. */
const siteKey = (url?: string) =>
  (url ?? "").toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/+$/, "");

/** Projects added in the admin (in admin order), followed by the delivered projects
 *  above — skipping any the admin has also added with the same website. */
export async function getAllProjects(): Promise<Project[]> {
  const fromAdmin = await getAdminProjects();
  const seen = new Set(fromAdmin.map((p) => siteKey(p.url)).filter(Boolean));
  return [...fromAdmin, ...DELIVERED_PROJECTS.filter((p) => !seen.has(siteKey(p.url)))];
}

/** Active projects from the Firestore "projects" collection. Client-side. */
async function getAdminProjects(): Promise<Project[]> {
  try {
    const { db } = await import("./firebase");
    const { collection, getDocs, orderBy, query, where } = await import("firebase/firestore");
    const snap = await getDocs(query(collection(db, "projects"), where("is_active", "==", true), orderBy("order", "asc")));
    return snap.docs.map((doc) => {
      const d = doc.data();
      const documents = Array.isArray(d.documents)
        ? d.documents
            .filter((x: unknown): x is { title?: unknown; url?: unknown } => typeof x === "object" && x !== null)
            .map((x: { title?: unknown; url?: unknown }) => ({ title: String(x.title ?? "Link"), url: String(x.url ?? "") }))
            .filter((x: ProjectDoc) => x.url)
        : [];
      return {
        name: String(d.name ?? ""),
        client: String(d.client ?? ""),
        industry: String(d.industry ?? ""),
        year: d.year ? String(d.year) : undefined,
        summary: String(d.summary ?? ""),
        services: asStringList(d.services),
        url: d.url ? String(d.url) : undefined,
        screenshots: asStringList(d.screenshots),
        documents,
        productSlug: d.product_slug ? String(d.product_slug) : undefined,
      };
    });
  } catch {
    // Firestore not reachable (or the collection/index doesn't exist yet)
    return PROJECTS_FALLBACK;
  }
}
