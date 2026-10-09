import type { Metadata } from "next";
import { initials } from "@/lib/utils";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BLOG_POSTS, getAllPosts, getPostBySlugRemote, formatDate, CATEGORY_COLOR } from "@/lib/blog-data";
import ShareButtons from "./ShareButtons";

// Revalidate periodically so posts published/edited in the admin CMS show up without
// a full redeploy. Static params below are just build-time hints — Next.js still
// renders any other slug on demand (dynamicParams defaults to true).
export const revalidate = 60;

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlugRemote(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: "article" },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlugRemote(slug);
  if (!post) notFound();

  const allPosts = await getAllPosts();
  const color = CATEGORY_COLOR[post.category] ?? "var(--blue)";
  const related = allPosts.filter((p) => p.slug !== post.slug && p.category === post.category).slice(0, 2);
  const fallbackRelated = related.length ? related : allPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <>
      <Navbar />
      <main className="page-top px-6 pb-24" style={{ background: "var(--navy)" }}>
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-5" style={{ background: color + "22", color }}>
            {post.category}
          </span>
          <h1 className="article-title mb-5 leading-tight" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>
            {post.title}
          </h1>
          <p className="text-sm" style={{ color: "var(--gray)" }}>
            {post.author} · {post.readTime} min read · {formatDate(post.date)}
          </p>
        </div>

        {post.image && (
          <div className="max-w-5xl mx-auto mb-12 rounded-2xl overflow-hidden h-[260px] md:h-[420px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-12">
          {/* Article */}
          <article className="flex flex-col gap-5 max-w-2xl">
            {Array.isArray(post.content) ? (
              post.content.map((para, i) => (
                <p key={i} className="text-[15px] leading-loose font-normal" style={{ color: "var(--gray2)" }}>
                  {para}
                </p>
              ))
            ) : (
              <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />
            )}
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((t) => (
                <span key={t} className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: "var(--surface)", color: "var(--gray)", border: "1px solid var(--border)" }}>
                  #{t}
                </span>
              ))}
            </div>
            <ShareButtons title={post.title} />
          </article>

          {/* Sidebar */}
          <aside className="flex flex-col gap-6 h-max lg:sticky lg:top-28">
            <div className="rounded-2xl p-6" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "var(--cyan)" }}>Written by</p>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ background: "var(--grad)" }}>
                  {initials(post.author)}
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>{post.author}</p>
                  <p className="text-xs" style={{ color: "var(--gray)" }}>Yubhian Technologies LLP</p>
                </div>
              </div>
            </div>

            {fallbackRelated.length > 0 && (
              <div className="rounded-2xl p-6" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "var(--cyan)" }}>Related posts</p>
                <div className="flex flex-col gap-4">
                  {fallbackRelated.map((r) => (
                    <Link key={r.slug} href={`/blog/${r.slug}`} className="text-sm font-medium hover:text-[var(--cyan)] transition-colors leading-snug" style={{ color: "var(--white)" }}>
                      {r.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
