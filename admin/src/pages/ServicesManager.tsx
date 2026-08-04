import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ChevronUp, ChevronDown, Pencil, Trash2, Plus, X } from "lucide-react";
import { listDocs, createDoc, updateDocById, deleteDocById, orderBy } from "../lib/firestoreHelpers";
import { COLLECTIONS } from "../lib/collections";

type Service = {
  $id: string;
  title: string;
  description: string;
  icon: string;
  tags: string[];
  accent_color: string;
  order?: number;
  is_active?: boolean;
  slug: string;
  detail_content?: string;
};

const ICON_OPTIONS = [
  "Brain", "Sparkles", "Bot", "Workflow", "Terminal", "Code2", "Smartphone", "Layers",
  "Building2", "Cloud", "GitBranch", "Plug", "Palette", "BarChart3", "Link", "Briefcase", "LifeBuoy",
];
const EMPTY = { title: "", description: "", icon: "Brain", tags: "", accent_color: "#2563EB", slug: "", detail_content: "", is_active: true };

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function ServicesManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Service | null>(null);

  async function load() {
    setLoading(true);
    try {
      setServices(await listDocs<Service>(COLLECTIONS.services, [orderBy("order", "asc")]));
    } catch {
      setServices([]);
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

  function openEdit(s: Service) {
    setEditing(s);
    setForm({
      title: s.title, description: s.description, icon: s.icon,
      tags: (s.tags ?? []).join(", "), accent_color: s.accent_color,
      slug: s.slug, detail_content: s.detail_content ?? "", is_active: s.is_active ?? true,
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
      description: form.description,
      icon: form.icon,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      accent_color: form.accent_color,
      slug: form.slug || slugify(form.title),
      detail_content: form.detail_content,
      is_active: form.is_active,
      order: editing?.order ?? services.length,
    };
    try {
      if (editing) {
        await updateDocById(COLLECTIONS.services, editing.$id, payload);
      } else {
        await createDoc(COLLECTIONS.services, payload);
      }
      toast.success(editing ? "Service updated" : "Service added");
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
      await deleteDocById(COLLECTIONS.services, confirmDelete.$id);
      toast.success("Service removed");
      setConfirmDelete(null);
      load();
    } catch {
      toast.error("Couldn't delete — check Firestore connection");
    }
  }

  async function move(index: number, dir: -1 | 1) {
    const next = [...services];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setServices(next);
    try {
      await Promise.all(next.map((s, i) => updateDocById(COLLECTIONS.services, s.$id, { order: i })));
    } catch {
      toast.error("Couldn't save order — check Firestore connection");
    }
  }

  async function toggleActive(s: Service) {
    const updated = { ...s, is_active: !s.is_active };
    setServices((list) => list.map((x) => (x.$id === s.$id ? updated : x)));
    try {
      await updateDocById(COLLECTIONS.services, s.$id, { is_active: updated.is_active });
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
          {services.length} service{services.length !== 1 ? "s" : ""} — controls the homepage Services grid
        </p>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium" style={{ background: "var(--grad)" }}>
          <Plus size={15} /> Add Service
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        {loading ? (
          <p className="text-sm text-center py-10" style={{ color: "var(--gray)" }}>Loading...</p>
        ) : services.length === 0 ? (
          <p className="text-sm text-center py-10" style={{ color: "var(--gray)" }}>
            No services in Firestore yet. The live site is showing the built-in defaults from{" "}
            <code className="px-1 rounded" style={{ background: "var(--navy2)" }}>services-data.ts</code>. Add rows here to manage them from the admin instead.
          </p>
        ) : (
          <div className="flex flex-col">
            {services.map((s, i) => (
              <div key={s.$id} className="flex items-center gap-4 px-5 py-4" style={{ borderBottom: i < services.length - 1 ? "1px solid rgba(15,23,42,0.06)" : "none" }}>
                <div className="flex flex-col">
                  <button onClick={() => move(i, -1)} disabled={i === 0} className="disabled:opacity-30" style={{ color: "var(--gray)" }}><ChevronUp size={14} /></button>
                  <button onClick={() => move(i, 1)} disabled={i === services.length - 1} className="disabled:opacity-30" style={{ color: "var(--gray)" }}><ChevronDown size={14} /></button>
                </div>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: s.accent_color + "20" }}>
                  <span className="text-xs font-bold" style={{ color: s.accent_color }}>{s.icon.slice(0, 2)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--white)" }}>{s.title}</p>
                  <p className="text-xs truncate" style={{ color: "var(--gray)" }}>{s.description}</p>
                </div>
                <label className="flex items-center gap-2 text-xs shrink-0" style={{ color: "var(--gray)" }}>
                  <input type="checkbox" checked={s.is_active ?? true} onChange={() => toggleActive(s)} className="accent-[var(--blue)]" />
                  Active
                </label>
                <button onClick={() => openEdit(s)} style={{ color: "var(--cyan)" }}><Pencil size={15} /></button>
                <button onClick={() => setConfirmDelete(s)} style={{ color: "#dc2626" }}><Trash2 size={15} /></button>
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
              <h3 className="text-lg font-bold" style={{ fontFamily: "Plus Jakarta Sans", color: "var(--white)" }}>{editing ? "Edit Service" : "Add Service"}</h3>
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
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--gray2)" }}>Description *</label>
              <textarea rows={3} className={inputClass + " resize-none"} style={inputStyle} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--gray2)" }}>Icon</label>
                <select className={inputClass} style={inputStyle} value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}>
                  {ICON_OPTIONS.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--gray2)" }}>Accent Color</label>
                <input type="color" className="w-full h-[42px] rounded-xl" style={inputStyle} value={form.accent_color} onChange={(e) => setForm({ ...form, accent_color: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--gray2)" }}>Tags (comma separated)</label>
              <input className={inputClass} style={inputStyle} value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--gray2)" }}>Detail Content</label>
              <textarea rows={5} className={inputClass + " resize-none"} style={inputStyle} value={form.detail_content} onChange={(e) => setForm({ ...form, detail_content: e.target.value })} />
            </div>
            <label className="flex items-center gap-2 text-sm" style={{ color: "var(--gray2)" }}>
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="accent-[var(--blue)]" />
              Is Active
            </label>
            <button onClick={handleSave} disabled={saving} className="mt-2 py-3 rounded-xl text-white text-sm font-medium disabled:opacity-60" style={{ background: "var(--grad)" }}>
              {saving ? "Saving..." : "Save Service"}
            </button>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/60" onClick={() => setConfirmDelete(null)} />
          <div className="relative w-full max-w-sm rounded-2xl p-6" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "Plus Jakarta Sans", color: "var(--white)" }}>Delete {confirmDelete.title}?</h3>
            <p className="text-sm mb-6" style={{ color: "var(--gray)" }}>This removes the service from the homepage grid immediately.</p>
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
