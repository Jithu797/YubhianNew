import { useCallback, useEffect, useState } from "react";
import type { Timestamp } from "firebase/firestore";
import toast from "react-hot-toast";
import { Search, FileText, RefreshCw, Trash2, Mail } from "lucide-react";
import { listDocs, updateDocById, deleteDocById, orderBy, limit } from "../lib/firestoreHelpers";
import { COLLECTIONS } from "../lib/collections";

type Application = {
  $id: string;
  career_slug: string;
  career_title: string;
  name: string;
  email: string;
  phone?: string;
  resume_url: string;
  message?: string;
  status: "new" | "reviewed" | "shortlisted" | "rejected";
  created_at?: Timestamp;
};

const TABS = ["All", "New", "Reviewed", "Shortlisted", "Rejected"] as const;

function formatDate(ts?: Timestamp) {
  if (!ts) return "";
  return ts.toDate().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

export default function CareerApplicationsInbox() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Application | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setApplications(await listDocs<Application>(COLLECTIONS.careerApplications, [orderBy("created_at", "desc"), limit(100)]));
    } catch {
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Mount-time data fetch plus a polling interval — the standard fetch-on-mount pattern.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, [load]);

  const filtered = applications.filter((a) => {
    const matchesTab = tab === "All" || a.status === tab.toLowerCase();
    const matchesQuery = !query || a.name.toLowerCase().includes(query.toLowerCase()) || a.email.toLowerCase().includes(query.toLowerCase()) || a.career_title.toLowerCase().includes(query.toLowerCase());
    return matchesTab && matchesQuery;
  });

  const newCount = applications.filter((a) => a.status === "new").length;

  async function updateStatus(app: Application, status: Application["status"]) {
    setApplications((list) => list.map((a) => (a.$id === app.$id ? { ...a, status } : a)));
    if (selected?.$id === app.$id) setSelected({ ...app, status });
    try {
      await updateDocById(COLLECTIONS.careerApplications, app.$id, { status });
    } catch {
      toast.error("Couldn't update — check Firestore connection");
    }
  }

  function openApplication(app: Application) {
    setSelected(app);
    if (app.status === "new") updateStatus(app, "reviewed");
  }

  async function handleDelete() {
    if (!selected) return;
    try {
      await deleteDocById(COLLECTIONS.careerApplications, selected.$id);
      toast.success("Application deleted");
      setApplications((list) => list.filter((a) => a.$id !== selected.$id));
      setSelected(null);
      setConfirmDelete(false);
    } catch {
      toast.error("Couldn't delete — check Firestore connection");
    }
  }

  return (
    <div className="flex flex-col gap-5 lg:h-[calc(100vh-160px)]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-sm" style={{ color: "var(--gray)" }}>
          {applications.length} total · <span style={{ color: newCount ? "#dc2626" : "var(--gray)" }}>{newCount} new</span>
        </p>
        <button onClick={load} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium" style={{ background: "var(--surface)", color: "var(--gray2)", border: "1px solid var(--border)" }}>
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-5 flex-1 min-h-0">
        {/* List */}
        <div className="flex flex-col rounded-2xl overflow-hidden max-h-[60vh] lg:max-h-none" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="p-3 flex flex-col gap-3" style={{ borderBottom: "1px solid var(--border)" }}>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--gray)" }} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search applicants..."
                className="w-full pl-8 pr-3 py-2 rounded-lg text-sm outline-none" style={{ background: "var(--navy2)", border: "1px solid var(--border)", color: "var(--white)" }} />
            </div>
            <div className="flex gap-1 overflow-x-auto">
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                  style={tab === t ? { background: "var(--grad)", color: "white" } : { color: "var(--gray)", background: "var(--navy2)" }}
                >
                  {t}{t === "New" && newCount > 0 ? ` (${newCount})` : ""}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <p className="text-sm text-center py-10" style={{ color: "var(--gray)" }}>Loading...</p>
            ) : filtered.length === 0 ? (
              <p className="text-sm text-center py-10" style={{ color: "var(--gray)" }}>No applications found.</p>
            ) : (
              filtered.map((a) => (
                <button
                  key={a.$id}
                  onClick={() => openApplication(a)}
                  className="w-full text-left px-4 py-3 flex flex-col gap-1 transition-colors"
                  style={{
                    background: selected?.$id === a.$id ? "rgba(37,99,235,0.1)" : "transparent",
                    borderBottom: "1px solid rgba(15,23,42,0.06)",
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-sm truncate ${a.status === "new" ? "font-bold" : "font-medium"}`} style={{ color: a.status === "new" ? "var(--white)" : "var(--gray2)" }}>
                      {a.name}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: a.status === "new" ? "#dc2626" : "transparent" }} />
                  </div>
                  <span className="text-xs truncate" style={{ color: "var(--gray)" }}>{a.career_title}</span>
                  <span className="text-[10px]" style={{ color: "var(--gray)" }}>{formatDate(a.created_at)}</span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Detail */}
        <div className="rounded-2xl p-6 overflow-y-auto" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          {!selected ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-sm" style={{ color: "var(--gray)" }}>Select an application to view details.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold" style={{ fontFamily: "Plus Jakarta Sans", color: "var(--white)" }}>{selected.name}</h3>
                  <p className="text-sm" style={{ color: "var(--gray)" }}>{selected.email}{selected.phone ? ` · ${selected.phone}` : ""}</p>
                  <p className="text-sm" style={{ color: "var(--gray)" }}>Applied for: {selected.career_title}</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full capitalize" style={{ background: "rgba(37,99,235,0.15)", color: "var(--blue2)" }}>{selected.status}</span>
              </div>

              <p className="text-xs" style={{ color: "var(--gray)" }}>{formatDate(selected.created_at)}</p>

              {selected.message && (
                <div className="rounded-xl p-4" style={{ background: "var(--navy2)", border: "1px solid var(--border)" }}>
                  <p className="text-sm font-light leading-relaxed whitespace-pre-wrap" style={{ color: "var(--gray2)" }}>{selected.message}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-2">
                <a href={selected.resume_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium" style={{ background: "var(--grad)" }}>
                  <FileText size={14} /> View Resume
                </a>
                <a href={`mailto:${selected.email}`} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium" style={{ background: "var(--navy2)", color: "var(--gray2)", border: "1px solid var(--border)" }}>
                  <Mail size={14} /> Email Applicant
                </a>
                <button onClick={() => updateStatus(selected, "shortlisted")} className="px-4 py-2.5 rounded-xl text-sm font-medium" style={{ background: "var(--navy2)", color: "var(--gray2)", border: "1px solid var(--border)" }}>
                  Shortlist
                </button>
                <button onClick={() => updateStatus(selected, "rejected")} className="px-4 py-2.5 rounded-xl text-sm font-medium" style={{ background: "var(--navy2)", color: "var(--gray2)", border: "1px solid var(--border)" }}>
                  Reject
                </button>
                <button onClick={() => setConfirmDelete(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium" style={{ color: "#dc2626" }}>
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {confirmDelete && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/60" onClick={() => setConfirmDelete(false)} />
          <div className="relative w-full max-w-sm rounded-2xl p-6" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "Plus Jakarta Sans", color: "var(--white)" }}>Delete this application?</h3>
            <p className="text-sm mb-6" style={{ color: "var(--gray)" }}>This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(false)} className="flex-1 py-2.5 rounded-xl text-sm font-medium" style={{ background: "var(--navy2)", color: "var(--gray2)", border: "1px solid var(--border)" }}>Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white" style={{ background: "#dc2626" }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
