import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useDropzone } from "react-dropzone";
import { ArrowLeft, Upload } from "lucide-react";
import { getDocById, createDoc, updateDocById } from "../lib/firestoreHelpers";
import { uploadImage } from "../lib/storageHelpers";
import { COLLECTIONS } from "../lib/collections";
import { useAuth } from "../context/useAuth";
import RichTextEditor from "../components/RichTextEditor";

const CATEGORIES = ["AI & ML", "Web Dev", "Mobile", "Company", "Tutorial", "News"];

type PostForm = {
  title: string;
  slug: string;
  content: string;
  status: "draft" | "published";
  published_at: string;
  category: string;
  tags: string;
  read_time: number;
  cover_url: string;
  excerpt: string;
  author_name: string;
};

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export default function BlogEditor() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState<PostForm>({
    title: "", slug: "", content: "", status: "draft",
    published_at: new Date().toISOString().slice(0, 16),
    category: CATEGORIES[0], tags: "", read_time: 1,
    cover_url: "", excerpt: "", author_name: user?.name || "",
  });
  const [slugTouched, setSlugTouched] = useState(false);
  const [excerptTouched, setExcerptTouched] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const dirtyRef = useRef(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 1,
    onDrop: (files) => {
      if (files[0]) {
        setCoverFile(files[0]);
        setCoverPreview(URL.createObjectURL(files[0]));
        dirtyRef.current = true;
      }
    },
  });

  useEffect(() => {
    if (isNew) return;
    (async () => {
      try {
        const doc = await getDocById<Record<string, unknown>>(COLLECTIONS.blogs, id!);
        if (!doc) throw new Error("not found");
        setForm({
          title: doc.title as string, slug: doc.slug as string, content: doc.content as string,
          status: doc.status as "draft" | "published",
          published_at: ((doc.published_at as string) ?? new Date().toISOString()).slice(0, 16),
          category: doc.category as string, tags: ((doc.tags as string[]) ?? []).join(", "),
          read_time: (doc.read_time as number) ?? 1, cover_url: (doc.cover_url as string) ?? "",
          excerpt: (doc.excerpt as string) ?? "", author_name: (doc.author_name as string) ?? "",
        });
        setSlugTouched(true);
        setExcerptTouched(true);
        setCoverPreview((doc.cover_url as string) || null);
      } catch {
        toast.error("Couldn't load post — check Firestore connection");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isNew]);

  function update<K extends keyof PostForm>(key: K, value: PostForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    dirtyRef.current = true;
  }

  function handleTitleChange(title: string) {
    update("title", title);
    if (!slugTouched) update("slug", slugify(title));
  }

  function handleContentChange(html: string) {
    update("content", html);
    const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
    update("read_time", Math.max(1, Math.round(words / 200)));
    if (!excerptTouched) update("excerpt", stripHtml(html).slice(0, 150));
  }

  async function handleSave(publish?: boolean) {
    if (!form.title) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    try {
      let cover_url = form.cover_url;
      if (coverFile) {
        cover_url = await uploadImage("blogs", coverFile);
      }
      const payload = {
        title: form.title,
        slug: form.slug || slugify(form.title),
        content: form.content,
        excerpt: form.excerpt,
        category: form.category,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        author_name: form.author_name || user?.name || "Yubhian Team",
        status: publish === undefined ? form.status : publish ? "published" : "draft",
        published_at: new Date(form.published_at).toISOString(),
        read_time: form.read_time,
        cover_url,
        views: 0,
      };
      if (isNew) {
        const created = await createDoc(COLLECTIONS.blogs, payload);
        toast.success(publish ? "Post published" : "Draft saved");
        navigate(`/blogs/edit/${created.id}`, { replace: true });
      } else {
        await updateDocById(COLLECTIONS.blogs, id!, payload);
        toast.success(publish ? "Post published" : "Draft saved");
      }
      setLastSaved(new Date());
      dirtyRef.current = false;
    } catch {
      toast.error("Couldn't save — check Firestore connection");
    } finally {
      setSaving(false);
    }
  }

  // Auto-save every 30s if dirty
  useEffect(() => {
    const interval = setInterval(() => {
      if (dirtyRef.current && form.title) handleSave();
    }, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const inputClass = "w-full px-4 py-2.5 rounded-xl text-sm outline-none";
  const inputStyle = { background: "var(--surface)", border: "1px solid var(--border)", color: "var(--white)" };

  if (loading) {
    return <p className="text-sm text-center py-20" style={{ color: "var(--gray)" }}>Loading post...</p>;
  }

  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* Top bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Link to="/blogs" className="flex items-center gap-2 text-sm font-medium" style={{ color: "var(--gray)" }}>
          <ArrowLeft size={15} /> Back
        </Link>
        <div className="flex items-center gap-4">
          {lastSaved && (
            <span className="text-xs" style={{ color: "var(--gray)" }}>
              Saved {lastSaved.toLocaleTimeString()}
            </span>
          )}
          <button onClick={() => handleSave(false)} disabled={saving} className="px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-60" style={{ background: "var(--surface)", color: "var(--gray2)", border: "1px solid var(--border)" }}>
            Save Draft
          </button>
          <button onClick={() => handleSave(true)} disabled={saving} className="px-5 py-2 rounded-xl text-white text-sm font-medium disabled:opacity-60" style={{ background: "var(--grad)" }}>
            {saving ? "Saving..." : "Publish"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        {/* Editor */}
        <div className="flex flex-col gap-4 max-w-2xl">
          <input
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Post title..."
            className="w-full bg-transparent text-3xl font-bold outline-none"
            style={{ fontFamily: "Plus Jakarta Sans", color: "var(--white)" }}
          />
          <div className="flex items-center gap-1 text-sm">
            <span style={{ color: "var(--gray)" }}>yubhiantechnologies.in/blog/</span>
            <input
              value={form.slug}
              onChange={(e) => { setSlugTouched(true); update("slug", e.target.value); }}
              className="bg-transparent outline-none border-b border-dashed"
              style={{ color: "var(--cyan)", borderColor: "var(--border)" }}
            />
          </div>
          <RichTextEditor content={form.content} onChange={handleContentChange} />
        </div>

        {/* Settings sidebar */}
        <div className="flex flex-col gap-5">
          <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium" style={{ color: "var(--white)" }}>Status</span>
              <div className="flex gap-1 rounded-lg p-0.5" style={{ background: "var(--navy2)" }}>
                {(["draft", "published"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => update("status", s)}
                    className="px-3 py-1 rounded-md text-xs font-medium capitalize"
                    style={form.status === s ? { background: "var(--grad)", color: "white" } : { color: "var(--gray)" }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--gray2)" }}>Publish Date</label>
              <input type="datetime-local" className={inputClass} style={inputStyle} value={form.published_at} onChange={(e) => update("published_at", e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--gray2)" }}>Category</label>
              <select className={inputClass} style={inputStyle} value={form.category} onChange={(e) => update("category", e.target.value)}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--gray2)" }}>Tags (comma separated)</label>
              <input className={inputClass} style={inputStyle} value={form.tags} onChange={(e) => update("tags", e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--gray2)" }}>Read Time (min)</label>
              <input type="number" min={1} className={inputClass} style={inputStyle} value={form.read_time} onChange={(e) => update("read_time", Number(e.target.value))} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--gray2)" }}>Author</label>
              <input className={inputClass} style={inputStyle} value={form.author_name} onChange={(e) => update("author_name", e.target.value)} />
            </div>
          </div>

          <div className="rounded-2xl p-5 flex flex-col gap-3" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <label className="text-xs font-medium block" style={{ color: "var(--gray2)" }}>Cover Image</label>
            <div {...getRootProps()} className="rounded-xl overflow-hidden cursor-pointer" style={{ border: `1.5px dashed ${isDragActive ? "var(--cyan)" : "var(--border)"}` }}>
              <input {...getInputProps()} />
              {coverPreview ? (
                <img src={coverPreview} alt="Cover preview" className="w-full h-32 object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 py-8">
                  <Upload size={20} style={{ color: "var(--gray)" }} />
                  <p className="text-xs" style={{ color: "var(--gray)" }}>Drag &amp; drop or click to browse</p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl p-5 flex flex-col gap-3" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <label className="text-xs font-medium block" style={{ color: "var(--gray2)" }}>Excerpt</label>
            <textarea
              rows={3}
              className={inputClass + " resize-none"}
              style={inputStyle}
              value={form.excerpt}
              onChange={(e) => { setExcerptTouched(true); update("excerpt", e.target.value); }}
            />
          </div>

          <div className="rounded-2xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <label className="text-xs font-medium mb-2 block" style={{ color: "var(--gray2)" }}>SEO Preview</label>
            <div className="rounded-lg p-3" style={{ background: "var(--navy2)" }}>
              <p className="text-[13px] truncate" style={{ color: "#8ab4f8" }}>yubhiantechnologies.in/blog/{form.slug || "post-slug"}</p>
              <p className="text-[15px] truncate" style={{ color: "#e8eaed" }}>{form.title || "Post title"}</p>
              <p className="text-xs line-clamp-2" style={{ color: "var(--gray)" }}>{form.excerpt || "Post excerpt will appear here..."}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
