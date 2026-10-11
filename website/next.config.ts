import type { NextConfig } from "next";

// Directives that restrict where the page can be framed, what <base> and <object> may do,
// and where forms may post — none of them affect the site's own scripts and styles.
// (A script-src allowlist would need per-request nonces; see the security report.)
const CSP = "frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self'";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  async redirects() {
    // Addresses from the previous site (a single-page app served from /index.html) and
    // common old-style page names. Phones' history, bookmarks and search results still
    // open these; without a redirect they landed on the 404 page.
    const legacy: [string, string][] = [
      ["/index.html", "/"],
      ["/index.htm", "/"],
      ["/home", "/"],
      ["/about-us", "/about"],
      ["/aboutus", "/about"],
      ["/contact-us", "/contact"],
      ["/contactus", "/contact"],
      ["/portfolio", "/work"],
      ["/our-work", "/work"],
      ["/projects", "/work"],
      ["/clients", "/work"],
      ["/service", "/services"],
      ["/our-services", "/services"],
      ["/career", "/careers"],
      ["/jobs", "/careers"],
      ["/blogs", "/blog"],
      ["/privacy", "/privacy-policy"],
      ["/cookies", "/cookie-policy"],
      // The single product page moved into the product catalogue.
      ["/product", "/products/yucampus"],
      ["/yucampus", "/products/yucampus"],
    ];
    return [
      ...legacy.map(([source, destination]) => ({ source, destination, permanent: true })),
      // Any other old "page.html" address → the same page without the extension.
      { source: "/:page([a-z0-9-]+)\\.html", destination: "/:page", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Content-Security-Policy", value: CSP },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
