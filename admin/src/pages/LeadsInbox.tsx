import { useCallback, useEffect, useState } from "react";
import type { Timestamp } from "firebase/firestore";
import toast from "react-hot-toast";
import { Search, Download, RefreshCw, Trash2, Mail } from "lucide-react";
import { listDocs, updateDocById, deleteDocById, orderBy, limit } from "../lib/firestoreHelpers";
import { COLLECTIONS } from "../lib/collections";

type Lead = {
  $id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  service_interest?: string;
  budget?: string;
  status: "new" | "read" | "replied" | "closed";
  source?: string;
  created_at?: Timestamp;
};

const TABS = ["All", "New", "Read", "Replied", "Closed"] as const;

function formatDate(ts?: Timestamp) {
  if (!ts) return "";
  return ts.toDate().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

export default function LeadsInbox() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Lead | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setLeads(await listDocs<Lead>(COLLECTIONS.leads, [orderBy("created_at", "desc"), limit(100)]));
    } catch {
      setLeads([]);
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

  const filtered = leads.filter((l) => {
    const matchesTab = tab === "All" || l.status === tab.toLowerCase();
    const matchesQuery = !query || l.name.toLowerCase().includes(query.toLowerCase()) || l.email.toLowerCase().includes(query.toLowerCase());
    return matchesTab && matchesQuery;
  });

  const unreadCount = leads.filter((l) => l.status === "new").length;

  async function updateStatus(lead: Lead, status: Lead["status"]) {
    setLeads((list) => list.map((l) => (l.$id === lead.$id ? { ...l, status } : l)));
    if (selected?.$id === lead.$id) setSelected({ ...lead, status });
    try {
      await updateDocById(COLLECTIONS.leads, lead.$id, { status });
    } catch {
      toast.error("Couldn't update — check Firestore connection");
    }
  }

  function openLead(lead: Lead) {
    setSelected(lead);
    if (lead.status === "new") updateStatus(lead, "read");
  }

  async function handleDelete() {
    if (!selected) return;
    try {
      await deleteDocById(COLLECTIONS.leads, selected.$id);
      toast.success("Lead deleted");
      setLeads((list) => list.filter((l) => l.$id !== selected.$id));
      setSelected(null);
      setConfirmDelete(false);
    } catch {
      toast.error("Couldn't delete — check Firestore connection");
    }
  }

  function exportCsv() {
    const header = ["Name", "Email", "Phone", "Company", "Service", "Budget", "Status", "Date", "Message"];
    const rows = filtered.map((l) => [l.name, l.email, l.phone ?? "", l.company ?? "", l.service_interest ?? "", l.budget ?? "", l.status, formatDate(l.created_at), l.message.replace(/\n/g, " ")]);
    const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "yubhian-leads.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col gap-5 lg:h-[calc(100vh-160px)]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-sm" style={{ color: "var(--gray)" }}>
          {leads.length} total · <span style={{ color: unreadCount ? "#dc2626" : "var(--gray)" }}>{unreadCount} unread</span>
        </p>
        <div className="flex gap-2">
          <button onClick={load} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium" style={{ background: "var(--surface)", color: "var(--gray2)", border: "1px solid var(--border)" }}>
            <RefreshCw size={13} /> Refresh
          </button>
          <button onClick={exportCsv} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-white" style={{ background: "var(--grad)" }}>
            <Download size={13} /> Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-5 flex-1 min-h-0">
        {/* List */}
        <div className="flex flex-col rounded-2xl overflow-hidden max-h-[60vh] lg:max-h-none" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="p-3 flex flex-col gap-3" style={{ borderBottom: "1px solid var(--border)" }}>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--gray)" }} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search leads..."
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
                  {t}{t === "New" && unreadCount > 0 ? ` (${unreadCount})` : ""}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <p className="text-sm text-center py-10" style={{ color: "var(--gray)" }}>Loading...</p>
            ) : filtered.length === 0 ? (
              <p className="text-sm text-center py-10" style={{ color: "var(--gray)" }}>No leads found.</p>
            ) : (
              filtered.map((l) => (
                <button
                  key={l.$id}
                  onClick={() => openLead(l)}
                  className="w-full text-left px-4 py-3 flex flex-col gap-1 transition-colors"
                  style={{
                    background: selected?.$id === l.$id ? "rgba(37,99,235,0.1)" : "transparent",
                    borderBottom: "1px solid rgba(15,23,42,0.06)",
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-sm truncate ${l.status === "new" ? "font-bold" : "font-medium"}`} style={{ color: l.status === "new" ? "var(--white)" : "var(--gray2)" }}>
                      {l.name}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: l.status === "new" ? "#dc2626" : "transparent" }} />
                  </div>
                  <span className="text-xs truncate" style={{ color: "var(--gray)" }}>{l.email}</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    {l.service_interest && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(37,99,235,0.15)", color: "var(--blue2)" }}>{l.service_interest}</span>
                    )}
                    <span className="text-[10px]" style={{ color: "var(--gray)" }}>{formatDate(l.created_at)}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Detail */}
        <div className="rounded-2xl p-6 overflow-y-auto" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          {!selected ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-sm" style={{ color: "var(--gray)" }}>Select a lead to view details.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold" style={{ fontFamily: "Plus Jakarta Sans", color: "var(--white)" }}>{selected.name}</h3>
                  <p className="text-sm" style={{ color: "var(--gray)" }}>{selected.email}{selected.phone ? ` · ${selected.phone}` : ""}</p>
                  {selected.company && <p className="text-sm" style={{ color: "var(--gray)" }}>{selected.company}</p>}
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full capitalize" style={{ background: "rgba(37,99,235,0.15)", color: "var(--blue2)" }}>{selected.status}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {selected.service_interest && <span className="text-xs px-3 py-1 rounded-full" style={{ background: "var(--navy2)", color: "var(--gray2)" }}>{selected.service_interest}</span>}
                {selected.budget && <span className="text-xs px-3 py-1 rounded-full" style={{ background: "var(--navy2)", color: "var(--gray2)" }}>{selected.budget}</span>}
                {selected.source && <span className="text-xs px-3 py-1 rounded-full" style={{ background: "var(--navy2)", color: "var(--gray2)" }}>{selected.source}</span>}
              </div>

              <p className="text-xs" style={{ color: "var(--gray)" }}>{formatDate(selected.created_at)}</p>

              <div className="rounded-xl p-4" style={{ background: "var(--navy2)", border: "1px solid var(--border)" }}>
                <p className="text-sm font-light leading-relaxed whitespace-pre-wrap" style={{ color: "var(--gray2)" }}>{selected.message}</p>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <a href={`mailto:${selected.email}`} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium" style={{ background: "var(--grad)" }}>
                  <Mail size={14} /> Reply via Email
                </a>
                <button onClick={() => updateStatus(selected, "replied")} className="px-4 py-2.5 rounded-xl text-sm font-medium" style={{ background: "var(--navy2)", color: "var(--gray2)", border: "1px solid var(--border)" }}>
                  Mark Replied
                </button>
                <button onClick={() => updateStatus(selected, "closed")} className="px-4 py-2.5 rounded-xl text-sm font-medium" style={{ background: "var(--navy2)", color: "var(--gray2)", border: "1px solid var(--border)" }}>
                  Close Lead
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
            <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "Plus Jakarta Sans", color: "var(--white)" }}>Delete this lead?</h3>
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
