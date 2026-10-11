import {
  Upload,
  FolderTree,
  Gauge,
  FileCheck2,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Users,
  type LucideIcon,
} from "lucide-react";
import {
  YUCAMPUS,
  YUCAMPUS_WHY,
  YUCAMPUS_STEPS,
  YUCAMPUS_MODULES,
  YUCAMPUS_LATER,
  YUCAMPUS_AUDIENCE,
  YUCAMPUS_PLATFORM,
  YUCAMPUS_PRICING,
  YUCAMPUS_FAQ,
  type YuModule,
} from "./yucampus";

// Yubhian's product catalogue — drives /products and every /products/<slug> page.
// To add a product: add an entry here (and its logo files under public/products/<slug>).
// Optional sections (screenshots, resources) only render once they have real content.

export type ProductResource = {
  title: string;
  /** "Documentation", "Brochure", "Demo video", "Case study"… */
  kind: string;
  href: string;
  description?: string;
};

export type ProductScreenshot = { src: string; alt: string; caption?: string };

export type Product = {
  slug: string;
  name: string;
  byline: string;
  /** Square app icon and wordmarks (dark-on-light / light-on-dark) */
  logo: { icon: string; wordmark: string; wordmarkLight: string };
  brand: { primary: string; accent: string };
  category: string;
  /** Short lifecycle line shown as a pill, e.g. "Now onboarding pilot colleges" */
  status: string;
  tagline: string;
  summary: string;
  oneLiner: string;
  why: { title: string; text: string }[];
  steps: { title: string; text: string }[];
  features: { icon: LucideIcon; title: string; text: string }[];
  benefits: { title: string; text: string }[];
  modules: YuModule[];
  later: { name: string; icon: LucideIcon }[];
  audience: { now: string[]; later: string };
  platform: { title: string; text: string }[];
  pricing: { model: string; pilot: string };
  faq: { q: string; a: string }[];
  screenshots: ProductScreenshot[];
  resources: ProductResource[];
  /** Lead source recorded for demo / pilot requests from this product's page */
  leadSource: string;
};

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
    status: "Now onboarding pilot colleges",
    tagline: "Accreditation-ready, all year round",
    summary: YUCAMPUS.summary,
    oneLiner: YUCAMPUS.oneLiner,
    why: YUCAMPUS_WHY,
    steps: YUCAMPUS_STEPS,
    features: [
      { icon: Upload, title: "Year-round evidence capture", text: "Faculty upload documents, photos and data the day things happen — from a laptop or a phone." },
      { icon: FolderTree, title: "Organised by criteria", text: "Every upload is filed under the right NAAC and NBA criteria automatically, so nothing is lost or misfiled." },
      { icon: Gauge, title: "IQAC readiness dashboard", text: "The IQAC team sees exactly what's complete and what's missing, criterion by criterion." },
      { icon: FileCheck2, title: "Report generation", text: "Generate ready-to-submit reports like the SSR, AQAR and SAR from data kept current all year." },
      { icon: RefreshCw, title: "Always on the latest formats", text: "Accreditation rules are stored as configurable data — when NAAC or NBA change formats, every college gets the update instantly." },
      { icon: ShieldCheck, title: "Your own secure space", text: "Every college gets its own secure account and web address on the platform." },
      { icon: Smartphone, title: "Works on any device", text: "Web-based — nothing to install for faculty, administrators or the IQAC team." },
      { icon: Users, title: "Built for the whole campus", text: "Faculty, departments and the IQAC work in one place instead of chasing files over email." },
    ],
    benefits: [
      { title: "No last-minute scramble", text: "Evidence builds up through the year, so report season is about reviewing — not hunting for documents." },
      { title: "One consistent source of truth", text: "The same data feeds every report, which matters now that One Nation One Data cross-checks submissions across agencies." },
      { title: "Clear accountability", text: "Everyone can see which criteria are covered and which still need evidence, well before the deadline." },
      { title: "Ready for what changes next", text: "Format changes from NAAC or NBA arrive as configuration updates, not as a new round of rework." },
    ],
    modules: YUCAMPUS_MODULES,
    later: YUCAMPUS_LATER,
    audience: YUCAMPUS_AUDIENCE,
    platform: YUCAMPUS_PLATFORM,
    pricing: YUCAMPUS_PRICING,
    faq: YUCAMPUS_FAQ,
    // Add product screenshots and public documents here as they're ready; each section
    // appears automatically once it has entries.
    screenshots: [],
    resources: [],
    leadSource: "yucampus-pilot",
  },
];

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}
