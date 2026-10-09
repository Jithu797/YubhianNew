import { BadgeCheck, Trophy, FileBarChart, Briefcase, ClipboardList, FlaskConical, GraduationCap, type LucideIcon } from "lucide-react";

// Single source for YuCampus copy, shared by the /product page and the homepage
// spotlight. Every statement here comes from Yubhian's own product brief — no invented
// customers, metrics or dates.

export const YUCAMPUS = {
  name: "YuCampus",
  byline: "YuCampus by Yubhian",
  oneLiner: "YuCampus keeps every campus accreditation-ready, all year round.",
  summary:
    "A web-based platform that helps Indian colleges and universities prepare for accreditation and rankings — without the usual last-minute stress.",
};

/** Why colleges need this now. */
export const YUCAMPUS_WHY = [
  {
    title: "NAAC has moved to binary accreditation",
    text: "Accreditation is now a clear pass/fail outcome, so gaps in evidence can't be smoothed over at the last minute.",
  },
  {
    title: "One Nation One Data cross-checks everything",
    text: "Institutional data is now cross-checked across agencies, so the numbers you submit have to be accurate and consistent everywhere.",
  },
  {
    title: "Readiness is a year-round job now",
    text: "Colleges need clean, consistent data all year — not a scramble to assemble a report once every five years.",
  },
];

/** How it works, in the order a college experiences it. */
export const YUCAMPUS_STEPS = [
  {
    title: "Upload, all year",
    text: "Faculty add documents, photos and data whenever they happen — from a laptop or a phone.",
  },
  {
    title: "Organised & tracked",
    text: "YuCampus files everything under the right NAAC and NBA criteria and shows the IQAC team exactly what's complete and what's missing.",
  },
  {
    title: "Reports, ready to submit",
    text: "Generate ready-to-submit reports like the SSR, AQAR and SAR — from data that's been kept current all along.",
  },
];

export type YuModule = { name: string; scope: string; detail: string; icon: LucideIcon; stage: "First" | "Next" | "Later" };

export const YUCAMPUS_MODULES: YuModule[] = [
  { name: "YuCampus Accredit", scope: "NAAC & NBA", detail: "Evidence collection, criterion tracking and SSR, AQAR and SAR reports.", icon: BadgeCheck, stage: "First" },
  { name: "YuCampus Rank", scope: "NIRF", detail: "Ranking data, gathered and kept consistent through the year.", icon: Trophy, stage: "Next" },
  { name: "YuCampus Report", scope: "AISHE & One Nation One Data", detail: "Government reporting from the same single source of truth.", icon: FileBarChart, stage: "Next" },
];

export const YUCAMPUS_LATER: { name: string; icon: LucideIcon }[] = [
  { name: "Placements", icon: Briefcase },
  { name: "Exams", icon: ClipboardList },
  { name: "Research", icon: FlaskConical },
  { name: "Alumni", icon: GraduationCap },
];

export const YUCAMPUS_AUDIENCE = {
  now: ["Affiliated colleges", "Autonomous colleges", "Private universities", "State universities"],
  later: "NIRF and government reporting modules for NITs, IIITs and other premier institutes.",
};

export const YUCAMPUS_PLATFORM = [
  { title: "One cloud platform", text: "Nothing to install — every college works in the same secure, always-updated platform." },
  { title: "Your own secure account & address", text: "Each college gets its own private account and web address." },
  { title: "Rules as configurable data", text: "Accreditation rules are stored as data, so when NAAC or NBA change their formats, the update reaches every college instantly." },
];

export const YUCAMPUS_PRICING = {
  model: "Yearly subscription per college, priced by institution size and the modules you choose.",
  pilot: "We're starting with free pilots for early colleges.",
};

export const YUCAMPUS_FAQ = [
  { q: "What is YuCampus?", a: "A web-based platform that helps Indian colleges and universities stay ready for accreditation and rankings all year — faculty upload evidence as it happens, YuCampus organises it under NAAC and NBA criteria, and it generates ready-to-submit reports like the SSR, AQAR and SAR." },
  { q: "Which accreditations and rankings does it cover?", a: "YuCampus Accredit (NAAC and NBA) comes first. YuCampus Rank (NIRF) and YuCampus Report (AISHE and One Nation One Data) follow, with placements, exams, research and alumni modules planned later." },
  { q: "Who is it for?", a: "Mainly affiliated colleges, autonomous colleges, and private and state universities — with NIRF and government reporting modules later for NITs, IIITs and other premier institutes." },
  { q: "What happens when NAAC or NBA change their formats?", a: "Accreditation rules are stored as configurable data rather than hard-coded, so format changes are updated once and reach every college instantly." },
  { q: "Is each college's data kept separate?", a: "Yes. Every college gets its own secure account and web address on the platform." },
  { q: "How much does it cost?", a: "YuCampus is a yearly subscription per college, priced by size and the modules you choose. We're starting with free pilots for early colleges — apply below." },
];

/** The seven NAAC criteria, shown in the illustrative readiness preview. */
export const NAAC_CRITERIA = [
  "Curricular Aspects",
  "Teaching-Learning & Evaluation",
  "Research, Innovations & Extension",
  "Infrastructure & Learning Resources",
  "Student Support & Progression",
  "Governance, Leadership & Management",
  "Institutional Values & Best Practices",
];
