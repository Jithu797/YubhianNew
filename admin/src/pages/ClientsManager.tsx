import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDropzone } from "react-dropzone";
import { ChevronUp, ChevronDown, Pencil, Trash2, Plus, X, Upload, Building2 } from "lucide-react";
import { listDocs, createDoc, updateDocById, deleteDocById, orderBy } from "../lib/firestoreHelpers";
import { uploadImage } from "../lib/storageHelpers";
import { COLLECTIONS } from "../lib/collections";

type Client = {
  $id: string;
  name: string;
  logo_url?: string;
  industry?: string;
  website_url?: string;
  order?: number;
  is_active?: boolean;
};

const EMPTY = { name: "", industry: "", website_url: "", is_active: true };

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

export default function ClientsManager() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Client | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 1,
    onDrop: (files) => {
      if (files[0]) {
        setLogoFile(files[0]);
        setLogoPreview(URL.createObjectURL(files[0]));
      }
    },
  });

  async function load() {
    setLoading(true);
    try {
      setClients(await listDocs<Client>(COLLECTIONS.clients, [orderBy("order", "asc")]));
    } catch {
      setClients([]);
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
    setLogoFile(null);
    setLogoPreview(null);
    setPanelOpen(true);
  }

  function openEdit(c: Client) {
    setEditing(c);
    setForm({
      name: c.name, industry: c.industry ?? "",
      website_url: c.website_url ?? "", is_active: c.is_active ?? true,
    });
    setLogoFile(null);
    setLogoPreview(c.logo_url ?? null);
    setPanelOpen(true);
  }

  async function handleSave() {
    if (!form.name) {
      toast.error("Client name is required");
      return;
    }
    setSaving(true);
    try {
      let logo_url = editing?.logo_url;
      if (logoFile) {
        logo_url = await uploadImage("clients", logoFile);
      }
      const payload = { ...form, logo_url, order: editing?.order ?? clients.length };
      if (editing) {
        await updateDocById(COLLECTIONS.clients, editing.$id, payload);
      } else {
        await createDoc(COLLECTIONS.clients, payload);
      }
      toast.success(editing ? "Client updated" : "Client added");
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
      await deleteDocById(COLLECTIONS.clients, confirmDelete.$id);
      toast.success("Client removed");
      setConfirmDelete(null);
      load();
    } catch {
      toast.error("Couldn't delete — check Firestore connection");
    }
  }

  async function move(index: number, dir: -1 | 1) {
    const next = [...clients];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setClients(next);
    try {
      await Promise.all(next.map((c, i) => updateDocById(COLLECTIONS.clients, c.$id, { order: i })));
    } catch {
      toast.error("Couldn't save order — check Firestore connection");
    }
  }

  async function toggleActive(c: Client) {
    const updated = { ...c, is_active: !c.is_active };
    setClients((list) => list.map((x) => (x.$id === c.$id ? updated : x)));
    try {
      await updateDocById(COLLECTIONS.clients, c.$id, { is_active: updated.is_active });
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
          {clients.length} client{clients.length !== 1 ? "s" : ""} — controls the homepage &quot;Our Clients&quot; showcase
        </p>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium" style={{ background: "var(--grad)" }}>
          <Plus size={15} /> Add Client
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        {loading ? (
          <p className="text-sm text-center py-10" style={{ color: "var(--gray)" }}>Loading...</p>
        ) : clients.length === 0 ? (
          <p className="text-sm text-center py-10" style={{ color: "var(--gray)" }}>
            No clients yet. The homepage showcase stays hidden until you add real clients here.
          </p>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["", "Logo", "Name & Industry", "Active", "Website", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wide font-medium" style={{ color: "var(--gray)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clients.map((c, i) => {
                const url = c.logo_url;
                return (
                  <tr key={c.$id} style={{ borderBottom: "1px solid rgba(15,23,42,0.06)" }}>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <button onClick={() => move(i, -1)} disabled={i === 0} className="disabled:opacity-30" style={{ color: "var(--gray)" }}><ChevronUp size={13} /></button>
                        <button onClick={() => move(i, 1)} disabled={i === clients.length - 1} className="disabled:opacity-30" style={{ color: "var(--gray)" }}><ChevronDown size={13} /></button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {url ? (
                        <img src={url} alt={c.name} className="w-9 h-9 rounded-lg object-cover" />
                      ) : (
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ background: "var(--grad)" }}>
                          {initials(c.name)}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium" style={{ color: "var(--white)" }}>{c.name}</p>
                      <p className="text-xs" style={{ color: "var(--gray)" }}>{c.industry}</p>
                    </td>
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={c.is_active ?? true} onChange={() => toggleActive(c)} className="accent-[var(--blue)]" />
                    </td>
                    <td className="px-4 py-3">
                      {c.website_url ? (
                        <a href={c.website_url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--cyan)" }}>
                          <Building2 size={14} />
                        </a>
                      ) : (
                        <span style={{ color: "var(--gray)" }}>—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button onClick={() => openEdit(c)} style={{ color: "var(--cyan)" }}><Pencil size={15} /></button>
                        <button onClick={() => setConfirmDelete(c)} style={{ color: "#dc2626" }}><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {/* Slide-over */}
      {panelOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60" onClick={() => setPanelOpen(false)} />
          <div className="relative w-full max-w-[480px] h-full overflow-y-auto p-6 flex flex-col gap-4" style={{ background: "var(--navy2)", borderLeft: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold" style={{ fontFamily: "Plus Jakarta Sans", color: "var(--white)" }}>{editing ? "Edit Client" : "Add Client"}</h3>
              <button onClick={() => setPanelOpen(false)} style={{ color: "var(--gray)" }}><X size={18} /></button>
            </div>

            <div {...getRootProps()} className="rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer text-center" style={{ background: "var(--surface)", border: `1.5px dashed ${isDragActive ? "var(--cyan)" : "var(--border)"}` }}>
              <input {...getInputProps()} />
              {logoPreview ? (
                <img src={logoPreview} alt="Preview" className="w-16 h-16 rounded-lg object-cover" />
              ) : (
                <Upload size={22} style={{ color: "var(--gray)" }} />
              )}
              <p className="text-xs" style={{ color: "var(--gray)" }}>Drag &amp; drop a logo, or click to browse</p>
            </div>

            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--gray2)" }}>Client Name *</label>
              <input className={inputClass} style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--gray2)" }}>Industry</label>
              <input className={inputClass} style={inputStyle} value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--gray2)" }}>Website URL</label>
              <input className={inputClass} style={inputStyle} value={form.website_url} onChange={(e) => setForm({ ...form, website_url: e.target.value })} />
            </div>
            <label className="flex items-center gap-2 text-sm" style={{ color: "var(--gray2)" }}>
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="accent-[var(--blue)]" />
              Is Active
            </label>

            <button onClick={handleSave} disabled={saving} className="mt-2 py-3 rounded-xl text-white text-sm font-medium disabled:opacity-60" style={{ background: "var(--grad)" }}>
              {saving ? "Saving..." : "Save Client"}
            </button>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/60" onClick={() => setConfirmDelete(null)} />
          <div className="relative w-full max-w-sm rounded-2xl p-6" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "Plus Jakarta Sans", color: "var(--white)" }}>Remove {confirmDelete.name}?</h3>
            <p className="text-sm mb-6" style={{ color: "var(--gray)" }}>This will remove them from the homepage showcase immediately.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 rounded-xl text-sm font-medium" style={{ background: "var(--navy2)", color: "var(--gray2)", border: "1px solid var(--border)" }}>Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white" style={{ background: "#dc2626" }}>Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
