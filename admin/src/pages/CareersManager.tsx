import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ChevronUp, ChevronDown, Pencil, Trash2, Plus, X } from "lucide-react";
import { listDocs, createDoc, updateDocById, deleteDocById, orderBy } from "../lib/firestoreHelpers";
import { COLLECTIONS } from "../lib/collections";

type Career = {
  $id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  order?: number;
  is_active?: boolean;
};

const TYPE_OPTIONS = ["Full-time", "Part-time", "Internship", "Contract"];
const EMPTY = { title: "", slug: "", department: "", location: "", type: "Full-time", description: "", requirements: "", is_active: true };

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function CareersManager() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing] = useState<Career | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Career | null>(null);

  async function load() {
    setLoading(true);
    try {
      setCareers(await listDocs<Career>(COLLECTIONS.careers, [orderBy("order", "asc")]));
    } catch {
      setCareers([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Mount-time data fetch — the standard fetch-on-mount pattern.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  function openAdd() {
    setEditing(null);
    setForm(EMPTY);
    setPanelOpen(true);
  }

  function openEdit(c: Career) {
    setEditing(c);
    setForm({
      title: c.title, slug: c.slug, department: c.department ?? "", location: c.location ?? "",
      type: c.type ?? "Full-time", description: c.description ?? "",
      requirements: (c.requirements ?? []).join("\n"), is_active: c.is_active ?? true,
    });
    setPanelOpen(true);
  }

  async function handleSave() {
    if (!form.title || !form.description) {
      toast.error("Title and description are required");
      return;
    }
    setSaving(true);
    const payload = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      department: form.department,
      location: form.location,
      type: form.type,
      description: form.description,
      requirements: form.requirements.split("\n").map((r) => r.trim()).filter(Boolean),
      is_active: form.is_active,
      order: editing?.order ?? careers.length,
    };
    try {
      if (editing) {
        await updateDocById(COLLECTIONS.careers, editing.$id, payload);
      } else {
        await createDoc(COLLECTIONS.careers, payload);
      }
      toast.success(editing ? "Position updated" : "Position added");
      setPanelOpen(false);
      load();
    } catch {
      toast.error("Couldn't save — check Firestore connection");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirmDelete) return;
    try {
      await deleteDocById(COLLECTIONS.careers, confirmDelete.$id);
      toast.success("Position removed");
      setConfirmDelete(null);
      load();
    } catch {
      toast.error("Couldn't delete — check Firestore connection");
    }
  }

  async function move(index: number, dir: -1 | 1) {
    const next = [...careers];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setCareers(next);
    try {
      await Promise.all(next.map((c, i) => updateDocById(COLLECTIONS.careers, c.$id, { order: i })));
    } catch {
      toast.error("Couldn't save order — check Firestore connection");
    }
  }

  async function toggleActive(c: Career) {
    const updated = { ...c, is_active: !c.is_active };
    setCareers((list) => list.map((x) => (x.$id === c.$id ? updated : x)));
    try {
      await updateDocById(COLLECTIONS.careers, c.$id, { is_active: updated.is_active });
    } catch {
      toast.error("Couldn't update — check Firestore connection");
    }
  }

  const inputClass = "w-full px-4 py-2.5 rounded-xl text-sm outline-none";
  const inputStyle = { background: "var(--navy2)", border: "1px solid var(--border)", color: "var(--white)" };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: "var(--gray)" }}>
          {careers.length} open position{careers.length !== 1 ? "s" : ""} — controls the public Careers page
        </p>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium" style={{ background: "var(--grad)" }}>
          <Plus size={15} /> Add Position
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        {loading ? (
          <p className="text-sm text-center py-10" style={{ color: "var(--gray)" }}>Loading...</p>
        ) : careers.length === 0 ? (
          <p className="text-sm text-center py-10" style={{ color: "var(--gray)" }}>
            No open positions yet. The Careers page stays hidden until you add one here.
          </p>
        ) : (
          <div className="flex flex-col">
            {careers.map((c, i) => (
              <div key={c.$id} className="flex items-center gap-4 px-5 py-4" style={{ borderBottom: i < careers.length - 1 ? "1px solid rgba(15,23,42,0.06)" : "none" }}>
                <div className="flex flex-col">
                  <button onClick={() => move(i, -1)} disabled={i === 0} className="disabled:opacity-30" style={{ color: "var(--gray)" }}><ChevronUp size={14} /></button>
                  <button onClick={() => move(i, 1)} disabled={i === careers.length - 1} className="disabled:opacity-30" style={{ color: "var(--gray)" }}><ChevronDown size={14} /></button>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--white)" }}>{c.title}</p>
                  <p className="text-xs truncate" style={{ color: "var(--gray)" }}>{c.department}{c.location ? ` · ${c.location}` : ""} · {c.type}</p>
                </div>
                <label className="flex items-center gap-2 text-xs shrink-0" style={{ color: "var(--gray)" }}>
                  <input type="checkbox" checked={c.is_active ?? true} onChange={() => toggleActive(c)} className="accent-[var(--blue)]" />
                  Active
                </label>
                <button onClick={() => openEdit(c)} style={{ color: "var(--cyan)" }}><Pencil size={15} /></button>
                <button onClick={() => setConfirmDelete(c)} style={{ color: "#dc2626" }}><Trash2 size={15} /></button>
              </div>
            ))}
          </div>
        )}
      </div>

      {panelOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60" onClick={() => setPanelOpen(false)} />
          <div className="relative w-full max-w-[480px] h-full overflow-y-auto p-6 flex flex-col gap-4" style={{ background: "var(--navy2)", borderLeft: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold" style={{ fontFamily: "Plus Jakarta Sans", color: "var(--white)" }}>{editing ? "Edit Position" : "Add Position"}</h3>
              <button onClick={() => setPanelOpen(false)} style={{ color: "var(--gray)" }}><X size={18} /></button>
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--gray2)" }}>Title *</label>
              <input className={inputClass} style={inputStyle} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--gray2)" }}>Slug</label>
              <input className={inputClass} style={inputStyle} placeholder={slugify(form.title)} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--gray2)" }}>Department</label>
                <input className={inputClass} style={inputStyle} value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--gray2)" }}>Location</label>
                <input className={inputClass} style={inputStyle} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--gray2)" }}>Employment Type</label>
              <select className={inputClass} style={inputStyle} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                {TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--gray2)" }}>Description *</label>
              <textarea rows={5} className={inputClass + " resize-none"} style={inputStyle} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--gray2)" }}>Requirements (one per line)</label>
              <textarea rows={5} className={inputClass + " resize-none"} style={inputStyle} value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} />
            </div>
            <label className="flex items-center gap-2 text-sm" style={{ color: "var(--gray2)" }}>
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="accent-[var(--blue)]" />
              Is Active
            </label>
            <button onClick={handleSave} disabled={saving} className="mt-2 py-3 rounded-xl text-white text-sm font-medium disabled:opacity-60" style={{ background: "var(--grad)" }}>
              {saving ? "Saving..." : "Save Position"}
            </button>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/60" onClick={() => setConfirmDelete(null)} />
          <div className="relative w-full max-w-sm rounded-2xl p-6" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "Plus Jakarta Sans", color: "var(--white)" }}>Delete {confirmDelete.title}?</h3>
            <p className="text-sm mb-6" style={{ color: "var(--gray)" }}>This removes the position from the public Careers page immediately.</p>
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
