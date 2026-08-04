export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  /** string[] = plain paragraphs (static fallback content); string = rich HTML from the admin's TipTap editor */
  content: string[] | string;
  category: string;
  tags: string[];
  author: string;
  date: string;
  readTime: number;
  /** Optional cover image — admin's BlogEditor already uploads this (`cover_url` in
   *  Firestore) but nothing on the public site read it until now. */
  image?: string;
};

export const CATEGORY_COLOR: Record<string, string> = {
  "AI & ML": "#7F77DD",
  "Web Dev": "#2563EB",
  Company: "#F59E0B",
  Mobile: "#06B6D4",
  Tutorial: "#1D9E75",
  News: "#D85A30",
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "ai-transforming-small-businesses-india-2026",
    title: "How AI is transforming small businesses in India in 2026",
    excerpt: "Indian SMEs are leveraging affordable AI tools to compete at enterprise scale — here's what's changing on the ground.",
    content: [
      "For years, AI was treated as a luxury only large enterprises could afford. That has changed fast. In 2026, small and mid-sized businesses across India are using AI tools that cost a fraction of what enterprise software used to, and the results are showing up directly on the bottom line.",
      "We've watched clients automate customer support triage, generate first-draft marketing copy, and forecast inventory demand — all with tools that would have required a dedicated data science team just three years ago.",
      "The biggest shift isn't the technology itself, it's accessibility. APIs from providers like OpenAI and Anthropic, combined with open-source models that can run on modest hardware, mean a five-person startup can ship an AI feature in a sprint that used to take a quarter.",
      "Our advice to founders: start with a narrow, well-defined problem — a support inbox, a repetitive data-entry task, a forecasting model — rather than trying to 'add AI' everywhere at once. The businesses seeing real ROI are the ones solving one problem well.",
    ],
    category: "AI & ML",
    tags: ["AI", "SME", "India", "Automation"],
    author: "Yubhian Team",
    date: "2026-05-14",
    readTime: 5,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=70",
  },
  {
    slug: "nextjs-gold-standard-company-websites-2026",
    title: "Why Next.js is the gold standard for company websites in 2026",
    excerpt: "We break down why Next.js dominates modern web development and why we build every client site on it.",
    content: [
      "Every client who asks us to build their website eventually asks the same question: 'why Next.js, and not something else?' Here's the honest answer.",
      "Performance is the first reason. Server components mean the browser downloads less JavaScript, pages load faster, and Core Web Vitals — which directly affect Google rankings — stay healthy without constant tuning.",
      "The second reason is developer velocity. The App Router's file-based routing, built-in image optimization, and first-class TypeScript support mean our team ships features faster and with fewer bugs than we would on a bespoke setup.",
      "Finally, the ecosystem. Vercel's deployment pipeline, the wide plugin ecosystem, and the fact that most engineers already know React means onboarding a new developer to a Next.js codebase takes days, not weeks.",
      "None of this means Next.js is right for every project — but for company websites, marketing sites, and most SaaS dashboards, it's the framework we reach for by default.",
    ],
    category: "Web Dev",
    tags: ["Next.js", "React", "Web Development", "Performance"],
    author: "Yubhian Team",
    date: "2026-04-28",
    readTime: 4,
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=70",
  },
  {
    slug: "building-our-first-product-honest-lessons",
    title: "Building our first product: honest lessons from the Yubhian team",
    excerpt: "What we learned building a product from scratch in Andhra Pradesh — the good, the hard, and the surprising.",
    content: [
      "Yubhian started as a services company, and for a long time that's all we planned to be. But after two years of building software for other people's ideas, we decided to build one of our own.",
      "The first lesson: services work and product work require completely different muscles. Client work rewards fast turnaround and clear scope. Product work rewards patience, saying no to features, and being willing to throw away a week of work when user feedback tells you it's wrong.",
      "The second lesson: talking to users early is uncomfortable but non-negotiable. We built a first version based purely on our own assumptions, and the first round of feedback humbled us — half the features we were proud of, nobody asked for.",
      "The third lesson: building from Andhra Pradesh, not a major tech hub, has been an advantage, not a limitation. Lower costs mean a longer runway to get the product right, and being close to the businesses we're building for keeps us grounded in real problems.",
      "We're not ready to share everything yet, but if you want to be one of the first to try it, join the waitlist on our product page.",
    ],
    category: "Company",
    tags: ["Product", "Startup", "Lessons Learned"],
    author: "Yubhian Team",
    date: "2026-04-10",
    readTime: 6,
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=70",
  },
];

export function getPostBySlug(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

/** Fetches all published posts from Firestore, falling back to the static list when
 *  Firestore isn't reachable yet or has no posts. Safe to call from Server or Client
 *  Components — it only ever performs a read. */
export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const { db } = await import("./firebase");
    const { collection, getDocs, limit, orderBy, query, where } = await import("firebase/firestore");
    const snap = await getDocs(
      query(
        collection(db, "blogs"),
        where("status", "==", "published"),
        orderBy("published_at", "desc"),
        limit(100)
      )
    );
    if (!snap.empty) {
      return snap.docs.map((doc) => {
        const d = doc.data();
        return {
          slug: d.slug,
          title: d.title,
          excerpt: d.excerpt,
          content: d.content ?? "",
          category: d.category,
          tags: d.tags ?? [],
          author: d.author_name,
          date: d.published_at,
          readTime: d.read_time,
          image: d.cover_url || undefined,
        };
      });
    }
  } catch {
    // Firestore not reachable yet — keep fallback
  }
  return BLOG_POSTS;
}

/** Looks up a single post by slug — checks Firestore first, falls back to the static list.
 *  Used by the detail page so posts created only in the CMS (not in the static fallback) still resolve. */
export async function getPostBySlugRemote(slug: string): Promise<BlogPost | undefined> {
  const posts = await getAllPosts();
  return posts.find((p) => p.slug === slug) ?? getPostBySlug(slug);
}
