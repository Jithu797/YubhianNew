import { GraduationCap, Briefcase, ScanQrCode, Wallet, Vote, Stethoscope, Globe, Fingerprint, type LucideIcon } from "lucide-react";
import type { YuModule } from "./yucampus";

// Single source for YuProof copy, used by the product page and the products listing.
// YuProof is in development: this page describes the product we are building and invites
// free pilot partners. No invented customers or results; the hero card shows sample data.

export const YUPROOF = {
  name: "YuProof",
  byline: "YuProof by Yubhian Technologies",
  tagline: "Certificates that can't be faked, verified in seconds",
  oneLiner: "Fake certificates stop here.",
  summary:
    "Colleges, institutes and companies issue tamper-proof degrees, mark sheets and experience letters. Anyone checks them in seconds by scanning a QR code: no calls, no emails, no waiting.",
};

/** The three promises under the hero. */
export const YUPROOF_PILLARS = [
  { title: "Issue once, trusted everywhere", text: "Each document gets a digital fingerprint recorded on a public blockchain." },
  { title: "Verify in seconds", text: "Scan the QR code or upload the PDF. Change one mark and the check fails." },
  { title: "Private by design", text: "Only the fingerprint goes on the blockchain. Personal data never does." },
];

/** Today vs with YuProof. */
export const YUPROOF_COMPARE = {
  before: [
    "Fake degrees and experience letters sold online for a few thousand rupees",
    "Employers phone and email colleges, then wait weeks for a reply",
    "Edited mark sheets that look exactly like the real thing",
    "Students pay agents for attestation before going abroad",
    "Colleges answer the same verification requests again and again",
  ],
  after: [
    "Every document carries a fingerprint that cannot be forged",
    "Anyone verifies in seconds with a phone camera",
    "One changed mark or letter and the check fails",
    "One share link works for employers in India and abroad",
    "Verification happens without the college lifting a finger",
  ],
};

/** How it works, from issue to verify. */
export const YUPROOF_STEPS = [
  { title: "The issuer is verified", text: "A college, institute or company completes a quick check before it can issue anything." },
  { title: "Issue documents", text: "Upload from Excel or straight from YuCampus. Each PDF gets a QR code and a fingerprint on the blockchain." },
  { title: "Holders keep and share", text: "Students and employees keep every document in one wallet and share a link that can expire." },
  { title: "Anyone verifies", text: "Scan the QR or upload the PDF: Genuine, Tampered, or Cancelled by the issuer, with the issuer's verified name." },
];

/** Who issues and who checks (shown as chips on the products listing). */
export const YUPROOF_MODULES: YuModule[] = [
  { name: "Issue", scope: "Colleges", detail: "Degrees, mark sheets, transfer and course certificates.", icon: GraduationCap },
  { name: "Issue", scope: "Companies", detail: "Internship, experience and relieving letters.", icon: Briefcase },
  { name: "Verify", scope: "Employers", detail: "Scan, upload, or check a whole batch of candidates at once.", icon: ScanQrCode },
  { name: "Keep", scope: "Wallet", detail: "Every verified document in one place, shared by link.", icon: Wallet },
];

/** Coming next on the same platform. */
export const YUPROOF_LATER: { name: string; icon: LucideIcon }[] = [
  { name: "Tamper-proof campus elections", icon: Vote },
  { name: "Medical and licence documents", icon: Stethoscope },
  { name: "Verification from abroad", icon: Globe },
  { name: "Share proof without sharing marks", icon: Fingerprint },
];

export const YUPROOF_ROLES = [
  { role: "Colleges and universities", text: "Issue degrees and mark sheets that verify themselves. No more verification letters." },
  { role: "Institutes and edtech", text: "Course and skill certificates that employers can trust at a glance." },
  { role: "Companies and HR teams", text: "Issue experience letters, and check every candidate's documents in one report." },
  { role: "Students and employees", text: "Keep every document in one wallet and share it with a link." },
  { role: "Employers and verifiers", text: "Scan a QR code and know in seconds whether a document is genuine." },
];

export const YUPROOF_TRUST = [
  "Only a fingerprint on the blockchain",
  "Personal data stored in India",
  "Every issuer verified first",
  "Issuers can cancel a document",
  "Built on open W3C standards",
  "Works on phone and computer",
];

export const YUPROOF_AUDIENCE = {
  now: ["Colleges and universities", "Coaching and training institutes", "Edtech platforms", "Companies issuing experience letters"],
  later: "verification for employers and universities abroad, starting with the Gulf and the UK.",
};

/** How a free pilot runs, fully online. */
export const YUPROOF_PILOT = {
  steps: [
    { when: "Week 1", title: "Online call", text: "We understand which documents you issue and how they are verified today." },
    { when: "Week 2", title: "Setup", text: "We verify your institution and set up your certificate template with the QR code." },
    { when: "Week 3", title: "First batch", text: "Issue a first batch of real documents from Excel or YuCampus." },
    { when: "Week 4", title: "Feedback", text: "Your students and their employers try verification; we improve it with you." },
  ],
  needs: ["A sample of the document you issue", "Student or employee list (Excel is fine)", "One contact person", "Your logo and authorised signatory"],
  integrations: ["YuCampus", "Excel import", "PDF certificates", "QR codes", "Email", "Phone and computer"],
  support: [
    { title: "Free during the pilot", text: "No cost while we build it with you" },
    { title: "WhatsApp support", text: "Quick answers from our team" },
    { title: "Online training", text: "Short sessions over video call" },
    { title: "Simple guides", text: "One page each for issuers and verifiers" },
    { title: "Early access", text: "New features first, shaped by your feedback" },
    { title: "YuCampus colleges", text: "Issue straight from the platform you already use" },
  ],
};

export const YUPROOF_PRICING = {
  model: "Free for students and employees. Issuers and verifiers will pay a small fee per document or a simple yearly plan. Pilot partners use YuProof free during the pilot.",
  pilot: "Join the free pilot.",
};

export const YUPROOF_DEMO = {
  steps: ["Short online call", "Free pilot setup", "Issue your first documents"],
  note: "YuProof is in development and we are choosing a small group of pilot partners. Tell us which documents you issue or check, and we will get back to you.",
  phone: "+91 8179728108",
  email: "info@yubhiantechnologies.in",
  promise: "Every certificate you issue should speak for itself, anywhere in the world, in seconds.",
};

export const YUPROOF_FAQ = [
  { q: "Is YuProof a cryptocurrency?", a: "No. There is no coin or token to buy. We use a public blockchain only as a permanent, tamper-proof record of document fingerprints." },
  { q: "Is our students' data on the blockchain?", a: "No. Only a fingerprint (a hash) of each document goes on the blockchain. Names, marks and other personal data stay in our secure database in India." },
  { q: "How does verification work?", a: "The verifier scans the QR code or uploads the PDF. YuProof recalculates the fingerprint and compares it with the blockchain record. If anything has been changed, the check fails." },
  { q: "What if we issue a document by mistake?", a: "The issuer can cancel it. Anyone who checks it afterwards sees that it was cancelled, and when." },
  { q: "Does it replace DigiLocker or NAD?", a: "No. It works alongside them and covers what they don't: institutes, edtech courses, internship and experience letters, and verification from abroad." },
  { q: "Do we need blockchain knowledge?", a: "No. You upload documents as you do today. YuProof handles the fingerprints, QR codes and blockchain in the background." },
  { q: "When is it available?", a: "We are building YuProof now with a small group of free pilot partners. Request a pilot and we will contact you." },
];

export const YUPROOF_DISCLAIMER =
  "YuProof is a product of Yubhian Technologies LLP, currently in development; features described may change before launch. It is not affiliated with NAD, DigiLocker, UGC or AICTE. The verification card shows sample data.";
