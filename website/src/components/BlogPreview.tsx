"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BLOG_POSTS, CATEGORY_COLOR, formatDate, getAllPosts, type BlogPost } from "@/lib/blog-data";
import ScrollReveal from "./ScrollReveal";
import { REVEAL_STAGGER } from "@/lib/motion";

export default function BlogPreview() {
  const [posts, setPosts] = useState<BlogPost[]>(BLOG_POSTS.slice(0, 3));

  useEffect(() => {
    getAllPosts().then((all) => setPosts(all.slice(0, 3)));
  }, []);

  return (
    <section className="py-[var(--space-6xl)] px-6" style={{ background: "var(--navy)", borderTop: "1px solid var(--border)" }} id="blog">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
          <div>
            <p className="kicker mb-5">10 · Insights</p>
            <h2 className="section-title" style={{ color: "var(--white)" }}>
              From the Yubhian <span className="serif-accent">blog</span>
            </h2>
          </div>
          <Link href="/blog" className="text-sm font-medium transition-colors hover:text-[var(--white)]" style={{ color: "var(--cyan)" }}>
            <span className="link-swap">
              <span className="link-swap-inner" data-text="View all posts →">View all posts →</span>
            </span>
          </Link>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((p, i) => {
            const color = CATEGORY_COLOR[p.category] ?? "var(--blue)";
            return (
              <ScrollReveal key={p.slug} delay={i * REVEAL_STAGGER}>
                <Link href={`/blog/${p.slug}`} className="group flex flex-col h-full rounded-2xl overflow-hidden"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <div className="relative h-44 overflow-hidden" style={{ background: `linear-gradient(135deg, ${color}33, ${color}0d)` }}>
                    {p.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.image}
                        alt={p.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-5xl font-extrabold opacity-20" style={{ fontFamily: "var(--font-syne)", color }}>Y</span>
                      </div>
                    )}
                    <span
                      className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{ background: color + "22", color }}
                    >
                      {p.category}
                    </span>
                  </div>
                  <div className="p-6 flex flex-col gap-3 flex-1">
                    <h3
                      className="text-lg font-medium leading-snug line-clamp-2 transition-colors group-hover:text-[var(--cyan)]"
                      style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}
                    >
                      {p.title}
                    </h3>
                    <p className="text-sm font-normal leading-relaxed line-clamp-3 flex-1" style={{ color: "var(--gray)" }}>
                      {p.excerpt}
                    </p>
                    <p className="text-xs pt-3" style={{ color: "var(--gray)", borderTop: "1px solid rgba(11,16,51,0.08)" }}>
                      {p.author} · {p.readTime} min read · {formatDate(p.date)}
                    </p>
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
