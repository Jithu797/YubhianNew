"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { BLOG_POSTS, CATEGORY_COLOR, formatDate, getAllPosts, type BlogPost } from "@/lib/blog-data";

const PAGE_SIZE = 6;

export default function BlogListing() {
  const [posts, setPosts] = useState<BlogPost[]>(BLOG_POSTS);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    getAllPosts().then(setPosts);
  }, []);

  const categories = useMemo(() => ["All", ...Array.from(new Set(posts.map((p) => p.category)))], [posts]);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchesCategory = category === "All" || p.category === category;
      const matchesQuery =
        !query ||
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [posts, query, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Search + filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between">
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--gray)" }} />
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Search articles..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--white)" }}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => { setCategory(c); setPage(1); }}
              className="px-4 py-1.5 rounded-full text-xs font-medium transition-colors"
              style={
                category === c
                  ? { background: "var(--grad)", color: "white" }
                  : { background: "var(--surface)", color: "var(--gray)", border: "1px solid var(--border)" }
              }
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {pageItems.length === 0 ? (
        <p className="text-center py-20 text-sm" style={{ color: "var(--gray)" }}>No articles match your search.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pageItems.map((p) => {
            const color = CATEGORY_COLOR[p.category] ?? "var(--blue)";
            return (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="group flex flex-col h-full rounded-2xl overflow-hidden"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <div className="relative h-40 overflow-hidden" style={{ background: `linear-gradient(135deg, ${color}33, ${color}0d)` }}>
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
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: color + "22", color }}>
                    {p.category}
                  </span>
                </div>
                <div className="p-6 flex flex-col gap-3 flex-1">
                  <h3 className="text-base font-medium leading-snug line-clamp-2 transition-colors group-hover:text-[var(--cyan)]" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>
                    {p.title}
                  </h3>
                  <p className="text-sm font-light leading-relaxed line-clamp-3 flex-1" style={{ color: "var(--gray)" }}>
                    {p.excerpt}
                  </p>
                  <p className="text-xs pt-3" style={{ color: "var(--gray)", borderTop: "1px solid rgba(15,23,42,0.08)" }}>
                    {p.author} · {p.readTime} min read · {formatDate(p.date)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-12">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className="w-9 h-9 rounded-lg text-sm font-medium transition-colors"
              style={
                page === i + 1
                  ? { background: "var(--grad)", color: "white" }
                  : { background: "var(--surface)", color: "var(--gray)", border: "1px solid var(--border)" }
              }
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
