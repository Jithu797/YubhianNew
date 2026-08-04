import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { listDocs, deleteDocById, orderBy } from "../lib/firestoreHelpers";
import { COLLECTIONS } from "../lib/collections";

type Blog = {
  $id: string;
  title: string;
  slug: string;
  category: string;
  status: string;
  published_at?: string;
  views?: number;
};

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<Blog | null>(null);

  async function load() {
    setLoading(true);
    try {
      setBlogs(await listDocs<Blog>(COLLECTIONS.blogs, [orderBy("published_at", "desc")]));
    } catch {
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Mount-time data fetch — the standard fetch-on-mount pattern.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  async function handleDelete() {
    if (!confirmDelete) return;
    try {
      await deleteDocById(COLLECTIONS.blogs, confirmDelete.$id);
      toast.success("Post deleted");
      setConfirmDelete(null);
      load();
    } catch {
      toast.error("Couldn't delete — check Firestore connection");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: "var(--gray)" }}>{blogs.length} post{blogs.length !== 1 ? "s" : ""}</p>
        <Link to="/blogs/new" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium" style={{ background: "var(--grad)" }}>
          <Plus size={15} /> New Blog Post
        </Link>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        {loading ? (
          <p className="text-sm text-center py-10" style={{ color: "var(--gray)" }}>Loading...</p>
        ) : blogs.length === 0 ? (
          <p className="text-sm text-center py-10" style={{ color: "var(--gray)" }}>No posts yet. Write your first one.</p>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Title", "Category", "Status", "Views", ""].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs uppercase tracking-wide font-medium" style={{ color: "var(--gray)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {blogs.map((b) => (
                <tr key={b.$id} style={{ borderBottom: "1px solid rgba(15,23,42,0.06)" }}>
                  <td className="px-5 py-3.5 font-medium" style={{ color: "var(--white)" }}>{b.title}</td>
                  <td className="px-5 py-3.5" style={{ color: "var(--gray)" }}>{b.category}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className="text-xs px-2.5 py-1 rounded-full"
                      style={
                        b.status === "published"
                          ? { background: "rgba(16,185,129,0.15)", color: "#047857" }
                          : { background: "rgba(100,116,139,0.15)", color: "var(--gray)" }
                      }
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5" style={{ color: "var(--gray)" }}>{b.views ?? 0}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {b.status === "published" && (
                        <a href={`https://yubhiantechnologies.in/blog/${b.slug}`} target="_blank" rel="noopener noreferrer" style={{ color: "var(--gray)" }}>
                          <Eye size={15} />
                        </a>
                      )}
                      <Link to={`/blogs/edit/${b.$id}`} style={{ color: "var(--cyan)" }}><Pencil size={15} /></Link>
                      <button onClick={() => setConfirmDelete(b)} style={{ color: "#dc2626" }}><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/60" onClick={() => setConfirmDelete(null)} />
          <div className="relative w-full max-w-sm rounded-2xl p-6" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "Plus Jakarta Sans", color: "var(--white)" }}>Delete &quot;{confirmDelete.title}&quot;?</h3>
            <p className="text-sm mb-6" style={{ color: "var(--gray)" }}>This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 rounded-xl text-sm font-medium" style={{ background: "var(--navy2)", color: "var(--gray2)", border: "1px solid var(--border)" }}>Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white" style={{ background: "#dc2626" }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
