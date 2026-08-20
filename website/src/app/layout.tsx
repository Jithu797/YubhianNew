import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";
import PageLoader from "@/components/PageLoader";
import PageTransition from "@/components/PageTransition";
import CookieConsent from "@/components/CookieConsent";
import SmoothScroll from "@/components/SmoothScroll";

// Two families, deliberately contrasting: Sora carries the headings (geometric,
// technical character) while Inter handles everything else (designed for legibility at
// small sizes). Both are variable fonts, so no discrete `weight` array is passed —
// requesting per-weight files from a variable-only family 404s on Google's CDN.
//
// The CSS variable names are unchanged from the original pairing so no component markup
// had to be touched.
const headingFont = Sora({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Yubhian Technologies LLP — Enterprise IT & Software Solutions",
    template: "%s | Yubhian Technologies LLP",
  },
  description:
    "Yubhian Technologies delivers enterprise-grade IT solutions, specialising in AI/ML, custom web and mobile development, and strategic software consulting.",
  keywords: [
    "IT company India",
    "AI ML development",
    "web development Andhra Pradesh",
    "mobile app development",
    "blockchain solutions",
    "cloud solutions",
    "software consulting",
    "Yubhian Technologies",
  ],
  authors: [{ name: "Yubhian Technologies LLP" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://yubhiantechnologies.in",
    siteName: "Yubhian Technologies LLP",
    title: "Yubhian Technologies LLP — Enterprise IT & Software Solutions",
    description:
      "Enterprise-grade IT solutions from Andhra Pradesh, India. AI/ML, Web, Mobile, Blockchain, Cloud & Consulting.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yubhian Technologies LLP",
    description: "Enterprise IT solutions from Andhra Pradesh, India.",
  },
  robots: { index: true, follow: true },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Yubhian Technologies LLP",
  url: "https://yubhiantechnologies.in",
  logo: "https://yubhiantechnologies.in/logo.jpg",
  email: "info@yubhiantechnologies.in",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kaikaluru",
    addressRegion: "Andhra Pradesh",
    addressCountry: "IN",
  },
  founder: [
    { "@type": "Person", name: "Naga Venkata Rishi Kakarla" },
    { "@type": "Person", name: "Jithendra Venkata Sai Bonam" },
    { "@type": "Person", name: "Satyanarayana Reddy Satti" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${headingFont.variable} ${bodyFont.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {/* The preloader is dismissed by JS; without it the overlay would cover the
            site permanently, so hide it outright when scripting is unavailable. */}
        <noscript>
          <style>{`.preloader-overlay{display:none !important}`}</style>
        </noscript>
      </head>
      <body className="min-h-screen">
        <SmoothScroll />
        <PageLoader />
        <PageTransition>{children}</PageTransition>
        <CookieConsent />
      </body>
    </html>
  );
}
