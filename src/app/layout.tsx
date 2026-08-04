import type { Metadata } from "next";
import { Roboto_Flex } from "next/font/google";
import "./globals.css";
import PageLoader from "@/components/PageLoader";
import PageTransition from "@/components/PageTransition";
import CookieConsent from "@/components/CookieConsent";
import SmoothScroll from "@/components/SmoothScroll";

// Variable names are kept as --font-syne/--font-dm-sans (the original pairing) so no
// component markup had to change. Both point at Roboto Flex — a real, openly-licensed
// variable font (unlike Google's proprietary "Google Sans Flex", which isn't safe to
// use on a third-party commercial site) with the same optical-size/width/weight axis
// technology, giving the same one-family, many-cuts approach via existing font-weight
// utility classes rather than switching typefaces between headings and body.
const headingFont = Roboto_Flex({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const bodyFont = Roboto_Flex({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
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
