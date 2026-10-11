import type { NextConfig } from "next";

// Directives that restrict where the page can be framed, what <base> and <object> may do,
// and where forms may post — none of them affect the site's own scripts and styles.
// (A script-src allowlist would need per-request nonces; see the security report.)
const CSP = "frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self'";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  // The single product page moved into the product catalogue; keep old links working.
  async redirects() {
    return [{ source: "/product", destination: "/products/yucampus", permanent: true }];
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
