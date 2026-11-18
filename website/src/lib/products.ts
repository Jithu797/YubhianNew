import {
  BadgeCheck,
  Layers,
  Trophy,
  FileBarChart,
  Sparkles,
  Database,
  ListChecks,
  MessageSquareText,
  ShieldCheck,
  QrCode,
  FileUp,
  Wallet,
  Ban,
  Building2,
  Link2,
  Users,
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
import {
  YUPROOF,
  YUPROOF_PILLARS,
  YUPROOF_COMPARE,
  YUPROOF_STEPS,
  YUPROOF_MODULES,
  YUPROOF_LATER,
  YUPROOF_ROLES,
  YUPROOF_TRUST,
  YUPROOF_AUDIENCE,
  YUPROOF_PILOT,
  YUPROOF_PRICING,
  YUPROOF_DEMO,
  YUPROOF_FAQ,
  YUPROOF_DISCLAIMER,
} from "./yuproof";

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

/** A heading in two parts: plain text, then the part set in the accent serif. */
export type SplitTitle = [string, string];

/** Section wording on the product page. Each field falls back to the YuCampus wording,
 *  so a product only lists what differs. */
export type ProductCopy = {
  whyTitle: SplitTitle;
  compareBefore: string;
  insideTitle: SplitTitle;
  insideNote: string;
  laterLabel: string;
  howTitle: SplitTitle;
  screensTitle: SplitTitle;
  rolesKicker: string;
  rolesTitle: SplitTitle;
  trustTitle: string;
  audienceTitle: string;
  startKicker: string;
  startTitle: SplitTitle;
  startNote: string;
  /** Plain part only; the product name is added in front ("See YuCampus in a") */
  pricingTitle: SplitTitle;
  faqTitle: SplitTitle;
  /** Main button when the product isn't live yet */
  ctaLabel: string;
  /** Organisation field label on the demo / pilot form */
  orgLabel: string;
};

export const DEFAULT_COPY: ProductCopy = {
  whyTitle: ["Accreditation work, without the", "last-minute rush"],
  compareBefore: "Today in many colleges",
  insideTitle: ["Everything in", "one platform"],
  insideNote: "Start with the modules you need today. Add more any time, on the same data.",
  laterLabel: "Coming next on the same platform:",
  howTitle: ["Set up once,", "ready all year"],
  screensTitle: ["Real screens, designed for", "busy colleges"],
  rolesKicker: "For everyone on campus",
  rolesTitle: ["Built for", "every role"],
  trustTitle: "Why colleges can trust it",
  audienceTitle: "Made for Indian institutions",
  startKicker: "Getting started",
  startTitle: ["Up and running in", "about a month"],
  startNote: "A typical onboarding plan, done fully online. We do the heavy lifting with your team.",
  pricingTitle: ["in a", "short online demo"],
  faqTitle: ["What colleges", "usually ask us"],
  ctaLabel: "Request a demo",
  orgLabel: "College / university",
};

/** Illustrative card shown in the hero when a product has no real screen yet. */
export type HeroCard = {
  label: string;
  result: string;
  rows: [string, string][];
  footnote: string;
};

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
  copy?: Partial<ProductCopy>;
  heroCard?: HeroCard;
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
  {
    slug: "yuproof",
    name: YUPROOF.name,
    byline: YUPROOF.byline,
    logo: {
      icon: "/products/yuproof/icon.png",
      wordmark: "/products/yuproof/wordmark.svg",
      wordmarkLight: "/products/yuproof/wordmark-light.svg",
    },
    brand: { primary: "#2B3990", accent: "#34D399" },
    category: "Document verification",
    status: "Coming soon · Free pilots open",
    tagline: YUPROOF.tagline,
    summary: YUPROOF.summary,
    oneLiner: YUPROOF.oneLiner,
    coverage: ["Degrees", "Mark sheets", "Internship letters", "Experience letters", "Course certificates"],
    pillars: YUPROOF_PILLARS,
    compare: YUPROOF_COMPARE,
    steps: YUPROOF_STEPS,
    features: [
      { icon: ShieldCheck, title: "Tamper-proof issuing", text: "Every document gets a fingerprint on a public blockchain. Change one letter and it no longer matches." },
      { icon: QrCode, title: "Scan to verify", text: "A QR code on every PDF. Anyone checks it with a phone camera, no app or login needed." },
      { icon: FileUp, title: "Bulk issue from Excel", text: "Issue a whole batch at once with your own certificate template." },
      { icon: Wallet, title: "Holder wallet", text: "Students and employees keep every verified document in one place and share it by link." },
      { icon: Users, title: "Bulk checks for HR", text: "Upload a batch of candidates' documents and get one verification report." },
      { icon: Ban, title: "Cancel and correct", text: "Issuers can cancel a document; anyone who checks it later sees it was cancelled." },
      { icon: Building2, title: "Verified issuers only", text: "Every institution is checked before it can issue, so fake universities can't." },
      { icon: Link2, title: "Built into YuCampus", text: "Colleges on YuCampus issue straight from the platform they already use." },
    ],
    modules: YUPROOF_MODULES,
    later: YUPROOF_LATER,
    screenshots: [],
    roles: YUPROOF_ROLES,
    trust: YUPROOF_TRUST,
    audience: YUPROOF_AUDIENCE,
    onboarding: YUPROOF_PILOT,
    pricing: YUPROOF_PRICING,
    demo: YUPROOF_DEMO,
    faq: YUPROOF_FAQ,
    resources: [],
    disclaimer: YUPROOF_DISCLAIMER,
    copy: {
      whyTitle: ["Fake certificates", "stop here"],
      compareBefore: "Today",
      insideTitle: ["Issue, keep and verify in", "one place"],
      insideNote: "For anyone who issues documents, anyone who holds them and anyone who checks them.",
      laterLabel: "Coming next on YuProof:",
      howTitle: ["From issue to verify,", "in four steps"],
      rolesKicker: "For issuers, holders and verifiers",
      rolesTitle: ["Built for", "everyone who handles documents"],
      trustTitle: "Why you can trust it",
      audienceTitle: "Starting in India",
      startKicker: "Free pilot",
      startTitle: ["How the", "free pilot works"],
      startNote: "Four weeks, fully online, at no cost. We build it with you.",
      pricingTitle: ["early, with a", "free pilot"],
      faqTitle: ["What people", "usually ask us"],
      ctaLabel: "Request a free pilot",
      orgLabel: "Organisation (college, institute or company)",
    },
    heroCard: {
      label: "Verification result",
      result: "Genuine document",
      rows: [
        ["Document", "B.Tech degree certificate"],
        ["Issued to", "Sample Student"],
        ["Issued by", "Sample College of Engineering (verified issuer)"],
        ["Issued on", "12 June 2026"],
        ["Record", "Matches the blockchain record"],
      ],
      footnote: "Sample result for illustration",
    },
    leadSource: "yuproof-pilot",
  },
];

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

/** A product's section wording, with the defaults filled in. */
export function productCopy(p: Product): ProductCopy {
  return { ...DEFAULT_COPY, ...p.copy };
}
