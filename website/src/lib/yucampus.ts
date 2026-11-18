import { BadgeCheck, Layers, Trophy, FileBarChart, Briefcase, ClipboardList, GraduationCap, Landmark, Target, ClipboardCheck, type LucideIcon } from "lucide-react";

// Single source for YuCampus copy, shared by the product page, the products listing and
// the homepage spotlight. Everything here comes from Yubhian's own YuCampus brochure —
// no invented customers or results. Screens on the page show sample data.

export const YUCAMPUS = {
  name: "YuCampus",
  byline: "YuCampus by Yubhian Technologies",
  // Non-breaking hyphen (U+2011) so the headline never wraps after "accreditation-".
  tagline: "Your campus, always accreditation‑ready",
  oneLiner: "Accreditation work, without the last-minute rush.",
  summary:
    "One platform for NAAC, NBA, NIRF and AISHE. Collect evidence all year, reuse data everywhere, and export portal-ready reports.",
};

/** The three promises under the hero. */
export const YUCAMPUS_PILLARS = [
  { title: "Collect once", text: "Enter data one time and reuse it in every report." },
  { title: "AI does the sorting", text: "Uploads are read and placed under the right criteria." },
  { title: "Export with confidence", text: "Portal-ready files, checked for gaps before you submit." },
];

/** Today vs with YuCampus. */
export const YUCAMPUS_COMPARE = {
  before: [
    "Evidence scattered across emails, drives and WhatsApp",
    "Months of manual formatting before every submission",
    "The same numbers typed again for NAAC, NBA and NIRF",
    "Gaps found only days before the deadline",
    "Hard to keep up with changing formats and rules",
  ],
  after: [
    "Every document in one searchable, organised place",
    "Reports generated in official formats in minutes",
    "Data entered once and reused across every framework",
    "Live readiness tracking shows gaps months early",
    "Formats updated by our team when rules change",
  ],
};

/** How it works, in the order a college experiences it. */
export const YUCAMPUS_STEPS = [
  { title: "Set up once", text: "Add departments, programs and users, or import them from Excel." },
  { title: "Collect all year", text: "Faculty upload from their phones. AI reads each document and suggests the right criteria." },
  { title: "Review and track", text: "IQAC approves evidence and watches readiness by criterion and department." },
  { title: "Export and submit", text: "Fix the flagged gaps, then download portal-ready reports and evidence packs." },
];

export type YuModule = { name: string; scope: string; detail: string; icon: LucideIcon };

/** The frameworks YuCampus covers (shown as chips on the products listing). */
export const YUCAMPUS_MODULES: YuModule[] = [
  { name: "Accredit", scope: "NAAC", detail: "Criteria tracking, metric checklists, SSR and AQAR in the official format.", icon: BadgeCheck },
  { name: "Accredit", scope: "NBA", detail: "CO–PO mapping, automatic attainment, and SAR preparation.", icon: Layers },
  { name: "Rank", scope: "NIRF", detail: "Three-year data, parameter readiness and export-ready sheets.", icon: Trophy },
  { name: "Report", scope: "AISHE", detail: "Government data in one place, checked for consistency across portals.", icon: FileBarChart },
];

/** Coming next on the same platform. */
export const YUCAMPUS_LATER: { name: string; icon: LucideIcon }[] = [
  { name: "Placements", icon: Briefcase },
  { name: "Examinations", icon: ClipboardList },
  { name: "Alumni", icon: GraduationCap },
  { name: "AICTE approval data", icon: Landmark },
  { name: "NBA outcomes setup", icon: Target },
  { name: "Peer team visit kit", icon: ClipboardCheck },
];

/** A year with YuCampus (months are an example; it follows the institution's calendar). */
export const YUCAMPUS_YEAR = [
  { when: "Jul", title: "Set up the year", text: "Departments, users and task templates carry forward automatically." },
  { when: "Monthly", title: "Collect as you go", text: "Departments upload evidence; reminders do the chasing." },
  { when: "Oct", title: "Internal audit", text: "Use the live readiness view instead of a paper checklist." },
  { when: "Dec", title: "AQAR", text: "Fix flagged gaps, then export in the official format." },
  { when: "Jan", title: "NIRF", text: "Data sheets created from the same records." },
  { when: "Mar", title: "NBA SAR", text: "Attainment already calculated from your mappings." },
  { when: "Jun", title: "Close the year", text: "Lock it and start the next year in one click." },
];

/** Enter once, used everywhere. */
export const YUCAMPUS_REUSE = {
  source: "Your data registers",
  sourceDetail: "faculty · students · research · activities · finance",
  outputs: ["NAAC SSR and AQAR", "NBA SAR", "NIRF data sheets", "AISHE survey"],
  note: "The same faculty count, placement figures and research list feed every report, so numbers always match across portals.",
};

export const YUCAMPUS_ROLES = [
  { role: "Principal or Dean", text: "Accreditation health of the whole institution on one screen." },
  { role: "IQAC coordinator", text: "Tasks, reviews, readiness tracking and reports in one place." },
  { role: "Heads of department", text: "Department progress, pending work and one-click reminders." },
  { role: "NBA and NIRF coordinators", text: "CO–PO mapping, attainment and ranking data, calculated for you." },
  { role: "Faculty", text: "Upload evidence from a phone in seconds. No formats to learn." },
];

export const YUCAMPUS_TRUST = [
  "Data stored in India",
  "Each role sees only its data",
  "Encrypted, with daily backups",
  "Works on phone and computer",
  "English, Telugu and Hindi",
  "Format updates included",
];

export const YUCAMPUS_AUDIENCE = {
  now: ["Affiliated colleges", "Autonomous colleges", "Private universities", "State universities"],
  later: "NIRF and government reporting for NITs, IIITs and other premier institutes.",
};

/** Up and running in about a month — a typical onboarding plan, done fully online. */
export const YUCAMPUS_ONBOARDING = {
  steps: [
    { when: "Week 1", title: "Online demo", text: "A short video call to show YuCampus and understand your process." },
    { when: "Week 2", title: "Setup", text: "We import departments, programs and staff from your Excel sheets." },
    { when: "Week 3", title: "Training", text: "Short online sessions for each role over video call." },
    { when: "Week 4", title: "Go live", text: "First tasks assigned and uploads begin." },
  ],
  needs: ["List of departments and programs", "Staff list with roles (Excel is fine)", "One IQAC contact person", "Your last AQAR or SSR, if available"],
  integrations: ["Excel import and export", "College ERP data", "WhatsApp", "Email", "Google sign-in", "Microsoft sign-in", "Word and PDF reports", "Phone and computer"],
  support: [
    { title: "Online training", text: "Live video sessions, role by role" },
    { title: "WhatsApp support", text: "Quick answers from our team" },
    { title: "Video tutorials", text: "English, Telugu and Hindi" },
    { title: "Role-based manuals", text: "Faculty need just one page" },
    { title: "Format updates", text: "When NAAC, NBA or NIRF change" },
    { title: "Yearly review", text: "We help you plan the next cycle" },
  ],
};

export const YUCAMPUS_PRICING = {
  model: "Simple yearly plans, priced by college size and the modules you choose. No installation cost, no servers to buy, and updates included.",
  pilot: "Start with a free 20-minute online demo.",
};

export const YUCAMPUS_DEMO = {
  steps: ["20-minute online demo", "Meeting with your team", "Access to app and guides"],
  note: "We walk you through it on Google Meet or Zoom, answer your questions, and understand what your college needs. No travel, no commitment.",
  phone: "+91 8179728108",
  email: "info@yubhiantechnologies.in",
  promise: "We set it up with you online, train your team over video call, and keep every format current. You focus on quality, not paperwork.",
};

export const YUCAMPUS_FAQ = [
  { q: "Is our data safe?", a: "It is stored on servers in India and encrypted. Each person sees only what their role allows, and you can export all your data at any time." },
  { q: "Do we need an IT team?", a: "No. YuCampus runs in a web browser and on phones. We handle hosting, updates and backups." },
  { q: "Does it replace our ERP?", a: "No. It works alongside your ERP and can take data from it or from Excel, so nothing is typed twice." },
  { q: "What if NAAC or NBA change formats?", a: "Our team updates the templates centrally, so every college gets the new format without extra work." },
  { q: "Will faculty find it difficult?", a: "Faculty mainly upload from their phone. Their guide is a single page, and training takes minutes." },
  { q: "Is the AI always right?", a: "No tool is. The AI only suggests. Nothing goes into a report until your IQAC approves it." },
  { q: "Which frameworks does it cover?", a: "NAAC (criteria tracking, SSR and AQAR), NBA (CO–PO mapping, attainment and SAR), NIRF (three-year data and data sheets) and AISHE (government data, checked for consistency). Start with the modules you need and add more any time, on the same data." },
  { q: "How long does it take to start?", a: "About a month, fully online: a demo in week 1, setup from your Excel sheets in week 2, role-by-role training in week 3, and go-live in week 4." },
  { q: "How much does it cost?", a: "Simple yearly plans, priced by college size and the modules you choose — with no installation cost, no servers to buy, and updates included. Start with a free 20-minute online demo." },
];

export const YUCAMPUS_DISCLAIMER =
  "YuCampus is an independent product of Yubhian Technologies LLP and is not affiliated with NAAC, NBA, NIRF, AISHE or AICTE. Screens show sample data.";
