import {
  GraduationCap,
  Hammer,
  Presentation,
  FlaskConical,
  Rocket,
  BrainCircuit,
  Sparkles,
  Bot,
  Globe,
  Smartphone,
  Cloud,
  BarChart3,
  PenTool,
  Link2,
  type LucideIcon,
} from "lucide-react";

// Content for /training: programmes Yubhian runs with colleges and universities.
// Describes what we offer and how it runs; no invented partners, numbers or results.

export type TrackId = "skills" | "workshops" | "fdp" | "research" | "internships";

export type Track = {
  id: TrackId;
  /** Short name used on tabs, chips and the programme brief */
  name: string;
  /** Name used inside a sentence: "A Faculty Development Programme on …" */
  phrase: string;
  icon: LucideIcon;
  tagline: string;
  forWho: string;
  formats: string[];
  covers: string[];
  outcomes: string[];
};

export const TRACKS: Track[] = [
  {
    id: "skills",
    name: "Skill training",
    phrase: "skill training programme",
    icon: GraduationCap,
    tagline: "Job-ready skills, taught the way industry works.",
    forWho: "Students from first year to final year: B.Tech, MCA, MBA, degree and diploma.",
    formats: ["30 to 60 hours", "Value-added or certificate course", "Inside your timetable"],
    covers: [
      "Hands-on sessions on the tools companies use today",
      "A guided project in every module, not just slides",
      "Weekly practice tasks with feedback",
      "Interview and portfolio preparation in the final week",
    ],
    outcomes: ["A working project on GitHub", "Assessment scores per student", "Certificate of completion", "Attendance and feedback report for the college"],
  },
  {
    id: "workshops",
    name: "Workshops",
    phrase: "hands-on workshop",
    icon: Hammer,
    tagline: "One to three days. Everyone builds something real.",
    forWho: "Students and clubs who want a fast, practical start on a new technology.",
    formats: ["1 to 3 days", "Bootcamps and hackathons", "Guest talks and tech days"],
    covers: [
      "A short concept session, then straight to building",
      "Step-by-step labs with our engineers in the room",
      "A mini-hackathon or build challenge to finish",
      "Starter code and notes everyone keeps",
    ],
    outcomes: ["Something built by the end of the day", "Participation certificates", "Photos and a short event report", "Next steps for students who want more"],
  },
  {
    id: "fdp",
    name: "Faculty Development (FDP)",
    phrase: "Faculty Development Programme",
    icon: Presentation,
    tagline: "Help your faculty teach, research and assess with today's tools.",
    forWho: "Faculty members and heads of department across engineering, science and management.",
    formats: ["1, 3, 5 or 6 days", "On campus or online", "Planned around your academic calendar"],
    covers: [
      "AI and generative AI for teaching, research and admin work",
      "Hands-on labs faculty can repeat with their own classes",
      "Designing projects and assessments around new technology",
      "Outcome-based education and keeping accreditation data in order",
    ],
    outcomes: ["Ready-to-use lab material and slides", "Recordings of online sessions", "FDP certificates", "Attendance, feedback and a programme report"],
  },
  {
    id: "research",
    name: "Research & development",
    phrase: "research and development collaboration",
    icon: FlaskConical,
    tagline: "Turn research ideas into working prototypes.",
    forWho: "Faculty researchers, PhD scholars, and student teams with an idea worth building.",
    formats: ["Joint projects", "Project guidance", "AI lab setup"],
    covers: [
      "Applied AI research with faculty, from problem to prototype",
      "Technical guidance for major and final-year projects",
      "Help turning results into papers and project reports",
      "Setting up an AI and innovation lab: tools, curriculum and project pipeline",
    ],
    outcomes: ["A working prototype, not just a proposal", "Code and documentation you own", "Regular reviews with our engineers", "A clear path from idea to product"],
  },
  {
    id: "internships",
    name: "AI internships",
    phrase: "internship with real-time AI projects",
    icon: Rocket,
    tagline: "Real projects, real code reviews, real experience.",
    forWho: "Pre-final and final-year students ready to work on live AI and software projects.",
    formats: ["4, 8 or 12 weeks", "6-month final-year option", "Online, on campus or hybrid"],
    covers: [
      "Students join a project squad building a real AI feature",
      "Daily stand-ups, task boards and code reviews, like a real team",
      "Mentoring from engineers who build our own products",
      "A demo day where every squad shows what it shipped",
    ],
    outcomes: ["Real project experience for the CV", "A portfolio of reviewed code", "Internship certificate", "Recommendation letters for standout work"],
  },
];

/** The path every programme follows, from first idea to proof of work. */
export const JOURNEY = [
  { step: "Learn", title: "Learn the idea", text: "Short, clear concept sessions. No long lectures: just enough to start building." },
  { step: "Build", title: "Build alongside engineers", text: "Hands-on labs led by people who write production code every day." },
  { step: "Ship", title: "Ship a real project", text: "Every learner finishes something that works: an app, a model or a feature." },
  { step: "Show", title: "Show the proof", text: "Code on GitHub, a certificate, and a report the college can file." },
];

export type Topic = { name: string; icon: LucideIcon; text: string; wide?: boolean };

/** What we teach: the same technologies we build with for clients. */
export const TOPICS: Topic[] = [
  { name: "AI & Machine Learning", icon: BrainCircuit, text: "Python, data preparation, classic ML, model evaluation and deployment.", wide: true },
  { name: "Generative AI & LLMs", icon: Sparkles, text: "Prompting, building with LLM APIs, retrieval (RAG) and using AI responsibly.", wide: true },
  { name: "AI chatbots & agents", icon: Bot, text: "Chat assistants, tool-using agents and everyday automation." },
  { name: "Full-stack web", icon: Globe, text: "Modern front ends, APIs and databases, end to end." },
  { name: "Mobile apps", icon: Smartphone, text: "Cross-platform apps from design to app store." },
  { name: "Cloud & DevOps", icon: Cloud, text: "Deploying apps, containers and CI/CD pipelines." },
  { name: "Data analytics & BI", icon: BarChart3, text: "SQL, dashboards and telling stories with data." },
  { name: "UI/UX design", icon: PenTool, text: "User research, wireframes and clickable prototypes." },
  { name: "Blockchain basics", icon: Link2, text: "Smart contracts and verifiable digital certificates." },
];

/** Why colleges choose to run programmes with us. */
export const CAMPUS_FIT = [
  { title: "Fits your syllabus and calendar", text: "We plan around your semester, exams and timetable, and map sessions to your courses." },
  { title: "On campus, online or hybrid", text: "Our team comes to your campus, runs it live online, or mixes both." },
  { title: "Evidence for NAAC and NBA", text: "Attendance, feedback, photos and a programme report, ready to file. Colleges on YuCampus can upload it straight in." },
  { title: "Taught by working engineers", text: "Trainers who build AI products and client software, not just teach them." },
  { title: "Small batches, real mentoring", text: "Mentors for every batch, so no one is left behind in the labs." },
  { title: "Everything stays with you", text: "Slides, lab guides, starter code and recordings are yours to keep and reuse." },
];

export const AUDIENCE = [
  "AICTE-approved engineering colleges",
  "Universities and their departments",
  "Autonomous and affiliated colleges",
  "MCA, MBA and degree colleges",
  "Placement cells and IQAC teams",
  "Student clubs and tech societies",
];

/** How a programme comes together, from first call to final report. */
export const PROCESS = [
  { title: "Tell us what you need", text: "A short call about your students or faculty, goals and dates." },
  { title: "Get a programme plan", text: "Topics, schedule, batch size, mode and a clear quote, in writing." },
  { title: "We run it", text: "Our trainers and mentors deliver, with labs, projects and assessments." },
  { title: "Reports and certificates", text: "Certificates for every participant and a complete report for the college." },
];

export const MODES = ["On campus", "Online", "Hybrid"] as const;
export const GROUP_SIZES = ["Up to 50", "50 to 150", "150 to 300", "300+"] as const;

export const TRAINING_FAQ = [
  { q: "Can the programme follow our syllabus?", a: "Yes. We start from your courses, semester and goals, and plan sessions around them. Every plan is written down and agreed before we begin." },
  { q: "Do you train on our campus?", a: "Yes. Our team can come to your campus, run the programme live online, or combine both. Labs work on your computer lab systems or students' own laptops." },
  { q: "Will participants get certificates?", a: "Yes. Everyone who completes the programme gets a certificate from Yubhian Technologies, and the college gets attendance, assessment and feedback records." },
  { q: "Can this be used for NAAC or NBA?", a: "We give you the attendance, feedback, photos and a programme report that accreditation teams usually ask for. Accreditation decisions are made by NAAC and NBA, not by us." },
  { q: "What do interns actually work on?", a: "Real AI and software features in small squads, with stand-ups, task boards and code reviews from our engineers. They finish with reviewed code they can show employers." },
  { q: "How much does it cost?", a: "It depends on the programme, its length, the number of participants and the mode. After the first call we send a written quote with no hidden costs." },
];
