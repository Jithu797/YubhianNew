import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
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
        ],
      },
    ];
  },
};

export default nextConfig;
