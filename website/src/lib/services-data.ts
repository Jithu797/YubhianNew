import {
  Brain, Sparkles, Bot, Workflow, Terminal, Code2, Smartphone, Layers, Building2,
  Cloud, GitBranch, Plug, Palette, BarChart3, Link as LinkIcon, Briefcase, LifeBuoy,
  type LucideIcon,
} from "lucide-react";

export type ServiceDef = {
  slug: string;
  title: string;
  category: string;
  shortDesc: string;
  longDesc: string;
  icon: LucideIcon;
  accent: string;
  tags: string[];
  process: string[];
  techStack: string[];
};

// Category order for the navbar mega-menu and any other grouped display.
export const SERVICE_CATEGORIES = [
  "AI & Automation",
  "Software Development",
  "Cloud & Infrastructure",
  "Design & Data",
  "Blockchain & Consulting",
] as const;

export const SERVICES: ServiceDef[] = [
  // --- AI & Automation ---
  {
    slug: "ai-ml",
    title: "AI & Machine Learning Solutions",
    category: "AI & Automation",
    shortDesc: "Custom AI models, NLP, computer vision, and predictive analytics built for production.",
    longDesc: "We design and ship production AI systems — not prototypes that stay in a notebook. From custom-trained models to NLP pipelines and computer vision, we integrate intelligence directly into your product's core workflows.",
    icon: Brain,
    accent: "#7F77DD",
    tags: ["ML Models", "NLP", "Computer Vision", "Analytics"],
    process: ["Discovery & data audit", "Model selection & prototyping", "Training & evaluation", "Production integration", "Monitoring & retraining"],
    techStack: ["Python", "TensorFlow", "PyTorch", "OpenAI API", "LangChain", "Vector DBs"],
  },
  {
    slug: "generative-ai",
    title: "Generative AI & LLM Development",
    category: "AI & Automation",
    shortDesc: "Custom copilots, RAG pipelines, and fine-tuned LLMs tailored to your own data.",
    longDesc: "We build applications on top of large language models — retrieval-augmented generation, fine-tuning, and prompt engineering — so your product reasons over your own data, not just generic training data.",
    icon: Sparkles,
    accent: "#8B5CF6",
    tags: ["LLMs", "RAG", "Fine-tuning", "Prompt Engineering"],
    process: ["Use-case & data scoping", "Model & architecture selection", "RAG / fine-tuning pipeline build", "Evaluation & guardrails", "Production deployment"],
    techStack: ["OpenAI", "Anthropic Claude", "LangChain", "Pinecone", "Hugging Face"],
  },
  {
    slug: "ai-chatbots",
    title: "AI Chatbots & Virtual Assistants",
    category: "AI & Automation",
    shortDesc: "Conversational AI assistants for customer support, sales, and internal operations.",
    longDesc: "From customer-facing support bots to internal knowledge assistants, we build conversational AI that actually resolves queries — grounded in your documentation and integrated with your existing tools.",
    icon: Bot,
    accent: "#06B6D4",
    tags: ["Chatbots", "Voice Assistants", "Customer Support", "Automation"],
    process: ["Conversation design", "Knowledge base integration", "Bot development", "Testing & tone tuning", "Deployment & monitoring"],
    techStack: ["Dialogflow", "Rasa", "OpenAI", "Twilio", "WhatsApp Business API"],
  },
  {
    slug: "ai-automation",
    title: "AI Automation & Workflow Optimization",
    category: "AI & Automation",
    shortDesc: "Automate repetitive operations with AI-driven workflows and intelligent pipelines.",
    longDesc: "We identify the manual, repetitive parts of your operations and replace them with AI-assisted automation — document processing, data entry, approval chains — so your team spends time on judgment calls, not busywork.",
    icon: Workflow,
    accent: "#F59E0B",
    tags: ["Process Automation", "RPA", "Document AI", "Integrations"],
    process: ["Workflow audit", "Automation design", "AI pipeline build", "Integration & testing", "Rollout & training"],
    techStack: ["Zapier", "n8n", "Python", "OpenAI", "Make"],
  },

  // --- Software Development ---
  {
    slug: "custom-software",
    title: "Custom Software Development",
    category: "Software Development",
    shortDesc: "Bespoke software built around how your business actually operates.",
    longDesc: "Off-the-shelf tools eventually hit a wall. We design and build custom software matched exactly to your workflows, data model, and scale — owned by you, not licensed.",
    icon: Terminal,
    accent: "#2563EB",
    tags: ["Bespoke Systems", "Internal Tools", "Legacy Modernization"],
    process: ["Requirements workshop", "Architecture & data modeling", "Iterative development", "QA & UAT", "Deployment & handoff"],
    techStack: ["Node.js", "Python", "PostgreSQL", "TypeScript", "Docker"],
  },
  {
    slug: "web-development",
    title: "Web Application Development",
    category: "Software Development",
    shortDesc: "Full-stack web apps, progressive web apps, and e-commerce platforms built for scale.",
    longDesc: "We build fast, accessible, SEO-ready web applications on modern stacks — from marketing sites to complex internal tools and e-commerce platforms that need to scale from day one.",
    icon: Code2,
    accent: "#1D9E75",
    tags: ["React", "Next.js", "Node.js", "PostgreSQL"],
    process: ["Requirements & architecture", "UI/UX design", "Frontend & backend build", "QA & performance tuning", "Deployment & handoff"],
    techStack: ["React", "Next.js", "Node.js", "TypeScript", "PostgreSQL", "Tailwind CSS"],
  },
  {
    slug: "mobile-apps",
    title: "Mobile App Development",
    category: "Software Development",
    shortDesc: "Native iOS/Android and cross-platform React Native apps with seamless UX.",
    longDesc: "From MVP to App Store launch, we build mobile apps that feel native, perform well on real-world networks, and are easy to maintain as your product grows.",
    icon: Smartphone,
    accent: "#0EA5E9",
    tags: ["iOS", "Android", "React Native", "Flutter"],
    process: ["Product scoping", "UI/UX & prototyping", "Cross-platform development", "Device testing & QA", "App Store & Play Store launch"],
    techStack: ["React Native", "Swift", "Kotlin", "Firebase", "Expo"],
  },
  {
    slug: "saas-development",
    title: "SaaS Product Development",
    category: "Software Development",
    shortDesc: "End-to-end SaaS builds — multi-tenant architecture, billing, and onboarding done right.",
    longDesc: "From your first paying customer to your thousandth, we build SaaS products with the multi-tenancy, subscription billing, and onboarding flows that let you scale without a rewrite.",
    icon: Layers,
    accent: "#D85A30",
    tags: ["Multi-tenancy", "Subscription Billing", "Onboarding"],
    process: ["Product & pricing strategy", "Architecture design", "Core build & billing integration", "Beta testing", "Launch & scale support"],
    techStack: ["Next.js", "Stripe", "PostgreSQL", "Redis", "AWS"],
  },
  {
    slug: "enterprise-software",
    title: "Enterprise Software Solutions",
    category: "Software Development",
    shortDesc: "Large-scale systems built for reliability, compliance, and cross-team scale.",
    longDesc: "For organizations operating at scale, we build enterprise-grade systems with the access control, audit trails, and integration depth that IT and compliance teams require.",
    icon: Building2,
    accent: "#7F77DD",
    tags: ["ERP", "Access Control", "Compliance", "Integrations"],
    process: ["Stakeholder & compliance mapping", "System architecture", "Phased development", "Security & compliance review", "Rollout & change management"],
    techStack: ["Java", ".NET", "PostgreSQL", "Kubernetes", "Okta / SSO"],
  },

  // --- Cloud & Infrastructure ---
  {
    slug: "cloud",
    title: "Cloud Solutions & Migration",
    category: "Cloud & Infrastructure",
    shortDesc: "AWS/GCP/Azure setup, cloud migration, and infrastructure automation at scale.",
    longDesc: "We architect cloud infrastructure that scales with you — CI/CD pipelines, containerized deployments, and monitoring so you sleep well at 2am — and migrate existing systems without downtime.",
    icon: Cloud,
    accent: "#1D9E75",
    tags: ["AWS", "GCP", "Azure", "Migration"],
    process: ["Infrastructure audit", "Architecture design", "Migration planning", "Execution & cutover", "Monitoring & optimization"],
    techStack: ["AWS", "GCP", "Azure", "Docker", "Kubernetes", "Terraform"],
  },
  {
    slug: "devops-cicd",
    title: "DevOps & CI/CD",
    category: "Cloud & Infrastructure",
    shortDesc: "Automated pipelines, infrastructure as code, and zero-downtime deployments.",
    longDesc: "We set up the CI/CD pipelines and infrastructure automation that let your team ship multiple times a day with confidence — automated testing, staged rollouts, and instant rollback.",
    icon: GitBranch,
    accent: "#2563EB",
    tags: ["CI/CD", "IaC", "Monitoring", "Automation"],
    process: ["Pipeline audit", "CI/CD design", "Infrastructure as code setup", "Monitoring & alerting", "Team handoff & training"],
    techStack: ["GitHub Actions", "Terraform", "Docker", "Kubernetes", "Datadog"],
  },
  {
    slug: "api-integrations",
    title: "API Development & Integrations",
    category: "Cloud & Infrastructure",
    shortDesc: "Robust APIs and third-party integrations that connect your systems reliably.",
    longDesc: "Whether it's a public API for partners or wiring together the tools you already use, we build integrations that handle real-world edge cases — retries, rate limits, and data consistency included.",
    icon: Plug,
    accent: "#06B6D4",
    tags: ["REST", "GraphQL", "Webhooks", "Third-party APIs"],
    process: ["Integration scoping", "API design & documentation", "Development & testing", "Security review", "Monitoring & support"],
    techStack: ["Node.js", "GraphQL", "REST", "Postman", "Swagger"],
  },

  // --- Design & Data ---
  {
    slug: "ui-ux-design",
    title: "UI/UX Design",
    category: "Design & Data",
    shortDesc: "Interfaces that are intuitive first and beautiful second — designed to convert.",
    longDesc: "Good design isn't decoration — it's the difference between a product people tolerate and one they enjoy using. We design interfaces backed by user research, not just aesthetic trends.",
    icon: Palette,
    accent: "#EC4899",
    tags: ["User Research", "Wireframing", "Design Systems", "Prototyping"],
    process: ["User research", "Wireframing & IA", "Visual design", "Prototyping & testing", "Design system handoff"],
    techStack: ["Figma", "Framer", "Design Systems", "Usability Testing"],
  },
  {
    slug: "data-analytics",
    title: "Data Analytics & Business Intelligence",
    category: "Design & Data",
    shortDesc: "Turn scattered data into dashboards and decisions leadership can act on.",
    longDesc: "We build the data pipelines and BI dashboards that turn scattered spreadsheets and disconnected tools into a single source of truth your leadership team can actually trust.",
    icon: BarChart3,
    accent: "#8B5CF6",
    tags: ["Dashboards", "Data Pipelines", "Reporting", "Warehousing"],
    process: ["Data audit", "Pipeline & warehouse design", "Dashboard build", "Validation", "Training & handoff"],
    techStack: ["Python", "SQL", "Power BI", "Looker", "BigQuery"],
  },

  // --- Blockchain & Consulting ---
  {
    slug: "blockchain",
    title: "Blockchain Development",
    category: "Blockchain & Consulting",
    shortDesc: "Smart contracts, DeFi platforms, NFT marketplaces, and Web3 applications.",
    longDesc: "We design secure, audited smart contracts and Web3 applications — from tokenomics to on-chain logic to the front-end dApp that ties it all together.",
    icon: LinkIcon,
    accent: "#F59E0B",
    tags: ["Solidity", "Web3", "DeFi", "NFTs"],
    process: ["Architecture & tokenomics", "Smart contract development", "Security review", "dApp front-end build", "Mainnet deployment"],
    techStack: ["Solidity", "Hardhat", "Ethers.js", "IPFS", "Polygon"],
  },
  {
    slug: "consulting",
    title: "IT Consulting & Digital Transformation",
    category: "Blockchain & Consulting",
    shortDesc: "Technology strategy, digital transformation, and system architecture consulting.",
    longDesc: "Acting as a fractional CTO, we help founders and leadership teams make the right technology bets — architecture, hiring, vendor selection, and roadmap.",
    icon: Briefcase,
    accent: "#D85A30",
    tags: ["Strategy", "Architecture", "Digital Transformation"],
    process: ["Technical audit", "Roadmap workshop", "Architecture recommendations", "Implementation support", "Ongoing advisory"],
    techStack: ["Architecture Review", "Cost Optimization", "Team Structuring", "Vendor Evaluation"],
  },
  {
    slug: "maintenance-support",
    title: "Maintenance & Technical Support",
    category: "Blockchain & Consulting",
    shortDesc: "Ongoing support, monitoring, and updates so your product keeps running smoothly.",
    longDesc: "Launch day isn't the finish line. We provide ongoing maintenance, bug fixes, security patches, and technical support so your product stays reliable long after we've shipped it.",
    icon: LifeBuoy,
    accent: "#64748B",
    tags: ["Bug Fixes", "Monitoring", "Security Patches", "SLA Support"],
    process: ["Support plan setup", "Monitoring & alerting", "Ongoing maintenance", "Incident response", "Quarterly health review"],
    techStack: ["Sentry", "Datadog", "PagerDuty", "Git"],
  },
];

export function getServiceBySlug(slug: string) {
  return SERVICES.find((s) => s.slug === slug);
}

export const SERVICE_ICON_MAP: Record<string, LucideIcon> = {
  Brain, Sparkles, Bot, Workflow, Terminal, Code2, Smartphone, Layers, Building2,
  Cloud, GitBranch, Plug, Palette, BarChart3, Link: LinkIcon, Briefcase, LifeBuoy,
};

/** Fetches active services from Firestore, falling back to the static list when
 *  Firestore isn't reachable yet or has no rows. Narrative fields (longDesc, process,
 *  techStack) that aren't in the Firestore schema fall back to the static entry with
 *  the same slug, or generic placeholders for a service that only exists in the CMS. */
export async function getAllServices(): Promise<ServiceDef[]> {
  try {
    const { db } = await import("./firebase");
    const { collection, getDocs, orderBy, query, where } = await import("firebase/firestore");
    const snap = await getDocs(
      query(collection(db, "services"), where("is_active", "==", true), orderBy("order", "asc"))
    );
    if (!snap.empty) {
      return snap.docs.map((doc) => {
        const d = doc.data();
        const fallback = getServiceBySlug(d.slug);
        return {
          slug: d.slug,
          title: d.title,
          category: fallback?.category ?? "Software Development",
          shortDesc: d.description,
          longDesc: fallback?.longDesc ?? d.description,
          icon: SERVICE_ICON_MAP[d.icon] ?? Briefcase,
          accent: d.accent_color,
          tags: d.tags ?? [],
          process: fallback?.process ?? [],
          techStack: fallback?.techStack ?? [],
        };
      });
    }
  } catch {
    // Firestore not reachable yet — keep fallback
  }
  return SERVICES;
}

export async function getServiceBySlugRemote(slug: string): Promise<ServiceDef | undefined> {
  const services = await getAllServices();
  return services.find((s) => s.slug === slug) ?? getServiceBySlug(slug);
}
