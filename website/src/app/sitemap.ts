import type { MetadataRoute } from "next";
import { getAllServices } from "@/lib/services-data";
import { getAllPosts } from "@/lib/blog-data";
import { getAllCareers } from "@/lib/careers-data";
import { SITE_URL } from "@/lib/site";

const BASE_URL = SITE_URL;

// Regenerate periodically so services/posts/careers added via the admin CMS appear in the
// sitemap without a full redeploy.
export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, posts, careers] = await Promise.all([getAllServices(), getAllPosts(), getAllCareers()]);

  const staticRoutes = ["", "/about", "/services", "/blog", "/careers", "/contact", "/work", "/products", "/products/yucampus"].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const legalRoutes = ["/privacy-policy", "/cookie-policy"].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.3,
  }));

  const serviceRoutes = services.map((s) => ({
    url: `${BASE_URL}/services/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const blogRoutes = posts.map((p) => ({
    url: `${BASE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const careerRoutes = careers.map((c) => ({
    url: `${BASE_URL}/careers/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...legalRoutes, ...serviceRoutes, ...blogRoutes, ...careerRoutes];
}
