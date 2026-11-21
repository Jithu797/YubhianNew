// Canonical public address of the website, used for canonical URLs, Open Graph, the
// sitemap, robots.txt and structured data. Set NEXT_PUBLIC_SITE_URL in Vercel if the
// primary domain ever changes (no trailing slash).
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.yubhiantechnologies.in").replace(/\/+$/, "");

// Registered office address: shown in the footer, on the contact page, in the privacy
// policy and in the structured data search engines read.
export const OFFICE_ADDRESS_LINES = [
  "H.No: 2-159, Saravana Bhavan,",
  "Gummuluru, Akividu Mandal,",
  "West Godavari District,",
  "Andhra Pradesh, India – 534235",
];
export const OFFICE_ADDRESS = OFFICE_ADDRESS_LINES.join("\n");
/** Google Maps search for the office (embed and directions link). */
export const OFFICE_MAP_QUERY = "Saravana Bhavan, Gummuluru, Akividu, West Godavari, Andhra Pradesh 534235";
