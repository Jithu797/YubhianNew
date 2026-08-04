import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Star, Pencil, Trash2, Plus, X } from "lucide-react";
import { listDocs, createDoc, updateDocById, deleteDocById, orderBy } from "../lib/firestoreHelpers";
import { COLLECTIONS } from "../lib/collections";

type Testimonial = {
  $id: string;
  client_name: string;
  client_role: string;
  company?: string;
  quote: string;
  rating: number;
  is_active?: boolean;
  order?: number;
};

const EMPTY = { client_name: "", client_role: "", company: "", quote: "", rating: 5, is_active: true };

export default function TestimonialsManager() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Testimonial | null>(null);

  async function load() {
    setLoading(true);
    try {
      setItems(await listDocs<Testimonial>(COLLECTIONS.testimonials, [orderBy("order", "asc")]));
    } catch {
      setItems([]);
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

  function openEdit(t: Testimonial) {
    setEditing(t);
    setForm({ client_name: t.client_name, client_role: t.client_role, company: t.company ?? "", quote: t.quote, rating: t.rating, is_active: t.is_active ?? true });
    setPanelOpen(true);
  }

  async function handleSave() {
    if (!form.client_name || !form.quote) {
      toast.error("Client name and quote are required");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, order: editing?.order ?? items.length };
      if (editing) {
        await updateDocById(COLLECTIONS.testimonials, editing.$id, payload);
      } else {
        await createDoc(COLLECTIONS.testimonials, payload);
      }
      toast.success(editing ? "Testimonial updated" : "Testimonial added");
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
      await deleteDocById(COLLECTIONS.testimonials, confirmDelete.$id);
      toast.success("Testimonial removed");
      setConfirmDelete(null);
      load();
    } catch {
      toast.error("Couldn't delete — check Firestore connection");
    }
  }

  async function toggleActive(t: Testimonial) {
    const updated = { ...t, is_active: !t.is_active };
    setItems((list) => list.map((x) => (x.$id === t.$id ? updated : x)));
    try {
      await updateDocById(COLLECTIONS.testimonials, t.$id, { is_active: updated.is_active });
    } catch {
      toast.error("Couldn't update — check Firestore connection");
    }
  }

  const inputClass = "w-full px-4 py-2.5 rounded-xl text-sm outline-none";
  const inputStyle = { background: "var(--navy2)", border: "1px solid var(--border)", color: "var(--white)" };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: "var(--gray)" }}>{items.length} testimonial{items.length !== 1 ? "s" : ""}</p>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium" style={{ background: "var(--grad)" }}>
          <Plus size={15} /> Add Testimonial
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-center py-10" style={{ color: "var(--gray)" }}>Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-center py-10 rounded-2xl" style={{ color: "var(--gray)", background: "var(--surface)", border: "1px solid var(--border)" }}>
          No testimonials yet. Add your first one.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {items.map((t) => (
            <div key={t.$id} className="rounded-2xl p-5 flex flex-col gap-3" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={13} fill="#F59E0B" stroke="#F59E0B" />)}
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 text-xs" style={{ color: "var(--gray)" }}>
                    <input type="checkbox" checked={t.is_active ?? true} onChange={() => toggleActive(t)} className="accent-[var(--blue)]" /> Active
                  </label>
                  <button onClick={() => openEdit(t)} style={{ color: "var(--cyan)" }}><Pencil size={14} /></button>
                  <button onClick={() => setConfirmDelete(t)} style={{ color: "#dc2626" }}><Trash2 size={14} /></button>
                </div>
              </div>
              <p className="text-sm font-light leading-relaxed" style={{ color: "var(--gray2)" }}>&ldquo;{t.quote}&rdquo;</p>
              <p className="text-xs" style={{ color: "var(--gray)" }}>
                <span className="font-medium" style={{ color: "var(--white)" }}>{t.client_name}</span>, {t.client_role}{t.company ? `, ${t.company}` : ""}
              </p>
            </div>
          ))}
        </div>
      )}

      {panelOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60" onClick={() => setPanelOpen(false)} />
          <div className="relative w-full max-w-[440px] h-full overflow-y-auto p-6 flex flex-col gap-4" style={{ background: "var(--navy2)", borderLeft: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold" style={{ fontFamily: "Plus Jakarta Sans", color: "var(--white)" }}>{editing ? "Edit Testimonial" : "Add Testimonial"}</h3>
              <button onClick={() => setPanelOpen(false)} style={{ color: "var(--gray)" }}><X size={18} /></button>
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--gray2)" }}>Client Name *</label>
              <input className={inputClass} style={inputStyle} value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--gray2)" }}>Role *</label>
              <input className={inputClass} style={inputStyle} value={form.client_role} onChange={(e) => setForm({ ...form, client_role: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--gray2)" }}>Company</label>
              <input className={inputClass} style={inputStyle} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--gray2)" }}>Quote *</label>
              <textarea rows={4} className={inputClass + " resize-none"} style={inputStyle} value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--gray2)" }}>Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} onClick={() => setForm({ ...form, rating: n })}>
                    <Star size={22} fill={n <= form.rating ? "#F59E0B" : "none"} stroke="#F59E0B" />
                  </button>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm" style={{ color: "var(--gray2)" }}>
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="accent-[var(--blue)]" />
              Is Active
            </label>
            <button onClick={handleSave} disabled={saving} className="mt-2 py-3 rounded-xl text-white text-sm font-medium disabled:opacity-60" style={{ background: "var(--grad)" }}>
              {saving ? "Saving..." : "Save Testimonial"}
            </button>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/60" onClick={() => setConfirmDelete(null)} />
          <div className="relative w-full max-w-sm rounded-2xl p-6" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "Plus Jakarta Sans", color: "var(--white)" }}>Delete this testimonial?</h3>
            <p className="text-sm mb-6" style={{ color: "var(--gray)" }}>This removes it from the homepage carousel immediately.</p>
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
