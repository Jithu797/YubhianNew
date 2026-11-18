import {
  BadgeCheck,
  Layers,
  Trophy,
  FileBarChart,
  Sparkles,
  Database,
  ListChecks,
  MessageSquareText,
  type LucideIcon,
} from "lucide-react";
import {
  YUCAMPUS,
  YUCAMPUS_PILLARS,
  YUCAMPUS_COMPARE,
  YUCAMPUS_STEPS,
  YUCAMPUS_MODULES,
  YUCAMPUS_LATER,
  YUCAMPUS_YEAR,
  YUCAMPUS_REUSE,
  YUCAMPUS_ROLES,
  YUCAMPUS_TRUST,
  YUCAMPUS_AUDIENCE,
  YUCAMPUS_ONBOARDING,
  YUCAMPUS_PRICING,
  YUCAMPUS_DEMO,
  YUCAMPUS_FAQ,
  YUCAMPUS_DISCLAIMER,
  type YuModule,
} from "./yucampus";

// Yubhian's product catalogue — drives /products and every /products/<slug> page.
// To add a product: add an entry here (and its logo files under public/products/<slug>).
// Optional sections only render once they have real content.

export type ProductResource = {
  title: string;
  /** "Documentation", "Brochure", "Demo video", "Case study"… */
  kind: string;
  href: string;
  description?: string;
};

export type ProductScreenshot = { src: string; alt: string; title: string; caption: string; width: number; height: number };

export type Product = {
  slug: string;
  name: string;
  byline: string;
  /** Square app icon and wordmarks (dark-on-light / light-on-dark) */
  logo: { icon: string; wordmark: string; wordmarkLight: string };
  brand: { primary: string; accent: string };
  category: string;
  /** Short lifecycle line shown as a pill, e.g. "Live now" */
  status: string;
  /** The running product, when it's live — its logo and "Open <name>" buttons go here */
  liveUrl?: string;
  tagline: string;
  summary: string;
  oneLiner: string;
  /** Frameworks or areas shown as chips in the hero */
  coverage: string[];
  pillars: { title: string; text: string }[];
  compare?: { before: string[]; after: string[] };
  steps: { title: string; text: string }[];
  features: { icon: LucideIcon; title: string; text: string }[];
  modules: YuModule[];
  later: { name: string; icon: LucideIcon }[];
  /** Big hero screen and the phone screen beside "How it works" */
  heroScreen?: ProductScreenshot;
  phoneScreen?: ProductScreenshot;
  screenshots: ProductScreenshot[];
  year?: { when: string; title: string; text: string }[];
  reuse?: { source: string; sourceDetail: string; outputs: string[]; note: string };
  roles?: { role: string; text: string }[];
  trust?: string[];
  audience: { now: string[]; later: string };
  onboarding?: {
    steps: { when: string; title: string; text: string }[];
    needs: string[];
    integrations: string[];
    support: { title: string; text: string }[];
  };
  pricing: { model: string; pilot: string };
  demo?: { steps: string[]; note: string; phone: string; email: string; promise: string };
  faq: { q: string; a: string }[];
  resources: ProductResource[];
  disclaimer?: string;
  /** Lead source recorded for demo / pilot requests from this product's page */
  leadSource: string;
};

const shot = (name: string, title: string, caption: string, width: number, height: number): ProductScreenshot => ({
  src: `/products/yucampus/screens/${name}.webp`,
  alt: `YuCampus ${title.toLowerCase()} screen (sample data)`,
  title,
  caption,
  width,
  height,
});

export const PRODUCTS: Product[] = [
  {
    slug: "yucampus",
    name: YUCAMPUS.name,
    byline: YUCAMPUS.byline,
    logo: {
      icon: "/products/yucampus/icon.png",
      wordmark: "/products/yucampus/wordmark.svg",
      wordmarkLight: "/products/yucampus/wordmark-light.svg",
    },
    brand: { primary: "#2B3990", accent: "#5ECFC8" },
    category: "Higher-education accreditation",
    status: "Live now",
    liveUrl: "https://yucampus.yubhiantechnologies.in",
    tagline: YUCAMPUS.tagline,
    summary: YUCAMPUS.summary,
    oneLiner: YUCAMPUS.oneLiner,
    coverage: ["NAAC", "NBA", "NIRF", "AISHE"],
    pillars: YUCAMPUS_PILLARS,
    compare: YUCAMPUS_COMPARE,
    steps: YUCAMPUS_STEPS,
    features: [
      { icon: BadgeCheck, title: "Accredit · NAAC", text: "Criteria tracking, metric checklists, SSR and AQAR in the official format." },
      { icon: Layers, title: "Accredit · NBA", text: "CO–PO mapping, automatic attainment, and SAR preparation." },
      { icon: Trophy, title: "Rank · NIRF", text: "Three-year data, parameter readiness and export-ready sheets." },
      { icon: FileBarChart, title: "Report · AISHE", text: "Government data in one place, checked for consistency across portals." },
      { icon: Sparkles, title: "Smart upload with AI", text: "Reads certificates and reports, suggests criteria and flags duplicates." },
      { icon: Database, title: "Data registers", text: "Faculty, students, research, activities and infrastructure, entered once." },
      { icon: ListChecks, title: "Tasks and reminders", text: "Task templates, deadlines and WhatsApp or email reminders." },
      { icon: MessageSquareText, title: "Surveys and feedback", text: "Student, alumni, employer and parent feedback, analysed automatically." },
    ],
    modules: YUCAMPUS_MODULES,
    later: YUCAMPUS_LATER,
    heroScreen: shot("dashboard", "Accreditation overview", "The principal's dashboard: NAAC readiness, evidence, pending reviews and deadlines.", 1944, 1196),
    phoneScreen: shot("faculty-app", "Faculty app", "Faculty app: upload in seconds.", 632, 1330),
    screenshots: [
      shot("ai-review", "AI review", "Details are read from each document and checked before approval.", 946, 629),
      shot("co-po-mapping", "NBA mapping", "CO–PO grid with attainment calculated automatically.", 949, 629),
      shot("reports", "Reports and export", "Pick SSR, AQAR, SAR, NIRF or AISHE; fix flagged gaps; download portal-ready files.", 1944, 655),
      shot("evidence-library", "Evidence library", "Every document searchable by year, criterion and department.", 946, 585),
      shot("nirf-readiness", "NIRF readiness", "Parameter progress and cross-portal consistency checks.", 949, 585),
      shot("tasks", "Tasks", "Templates, deadlines and an approval board.", 946, 583),
      shot("surveys", "Surveys", "Feedback on WhatsApp, analysed for NAAC and NBA.", 949, 583),
    ],
    year: YUCAMPUS_YEAR,
    reuse: YUCAMPUS_REUSE,
    roles: YUCAMPUS_ROLES,
    trust: YUCAMPUS_TRUST,
    audience: YUCAMPUS_AUDIENCE,
    onboarding: YUCAMPUS_ONBOARDING,
    pricing: YUCAMPUS_PRICING,
    demo: YUCAMPUS_DEMO,
    faq: YUCAMPUS_FAQ,
    resources: [
      {
        title: "YuCampus brochure",
        kind: "Brochure · PDF",
        href: "/products/yucampus/yucampus-brochure.pdf",
        description: "Eight pages: why YuCampus, every module, real screens, onboarding and FAQs — to share with your IQAC and principal.",
      },
    ],
    disclaimer: YUCAMPUS_DISCLAIMER,
    leadSource: "yucampus-pilot",
  },
];

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}
