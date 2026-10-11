// Canonical public address of the website, used for canonical URLs, Open Graph, the
// sitemap, robots.txt and structured data. Set NEXT_PUBLIC_SITE_URL in Vercel if the
// primary domain ever changes (no trailing slash).
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.yubhiantechnologies.in").replace(/\/+$/, "");
