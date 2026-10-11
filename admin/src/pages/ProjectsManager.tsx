import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDropzone } from "react-dropzone";
import { ChevronUp, ChevronDown, Pencil, Trash2, Plus, X, Upload, ExternalLink, Image as ImageIcon } from "lucide-react";
import { listDocs, createDoc, updateDocById, deleteDocById, orderBy } from "../lib/firestoreHelpers";
import { uploadImage } from "../lib/storageHelpers";
import { COLLECTIONS } from "../lib/collections";

// Completed projects shown on the website's Work page as proof of work — and on a
// product's page when tagged with that product. Mirrors the Clients manager.

type ProjectDocLink = { title: string; url: string };
type Project = {
  $id: string;
  name: string;
  client?: string;
  industry?: string;
  year?: string;
  summary?: string;
  services?: string[];
  url?: string;
  screenshots?: string[];
  documents?: ProjectDocLink[];
  product_slug?: string;
  order?: number;
  is_active?: boolean;
};

// Products on the website that a project can be listed under (website/src/lib/products.ts).
const PRODUCT_OPTIONS = [
  { value: "", label: "None — general project" },
  { value: "yucampus", label: "YuCampus" },
];

type Form = {
  name: string;
  client: string;
  industry: string;
  year: string;
  summary: string;
  services: string;
  url: string;
  product_slug: string;
  is_active: boolean;
  documents: ProjectDocLink[];
};

const EMPTY: Form = { name: "", client: "", industry: "", year: "", summary: "", services: "", url: "", product_slug: "", is_active: true, documents: [] };

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<Form>(EMPTY);
  // Screenshots: already-uploaded URLs plus newly picked files (uploaded on save).
  const [shots, setShots] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<{ file: File; preview: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Project | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    maxSize: 8 * 1024 * 1024,
    onDrop: (files) => setNewFiles((list) => [...list, ...files.map((file) => ({ file, preview: URL.createObjectURL(file) }))]),
    onDropRejected: () => toast.error("Screenshots must be images under 8 MB"),
  });

  async function load() {
    setLoading(true);
    try {
      setProjects(await listDocs<Project>(COLLECTIONS.projects, [orderBy("order", "asc")]));
    } catch {
      setProjects([]);
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
    setShots([]);
    setNewFiles([]);
    setPanelOpen(true);
  }

  function openEdit(p: Project) {
    setEditing(p);
    setForm({
      name: p.name,
      client: p.client ?? "",
      industry: p.industry ?? "",
      year: p.year ?? "",
      summary: p.summary ?? "",
      services: (p.services ?? []).join(", "),
      url: p.url ?? "",
      product_slug: p.product_slug ?? "",
      is_active: p.is_active ?? true,
      documents: p.documents ?? [],
    });
    setShots(p.screenshots ?? []);
    setNewFiles([]);
    setPanelOpen(true);
  }

  async function handleSave() {
    if (!form.name.trim() || !form.summary.trim()) {
      toast.error("Project name and summary are required");
      return;
    }
    setSaving(true);
    try {
      const uploaded: string[] = [];
      for (const { file } of newFiles) uploaded.push(await uploadImage("projects", file));
      const payload = {
        name: form.name.trim(),
        client: form.client.trim(),
        industry: form.industry.trim(),
        year: form.year.trim(),
        summary: form.summary.trim(),
        services: form.services.split(",").map((s) => s.trim()).filter(Boolean),
        url: form.url.trim(),
        product_slug: form.product_slug,
        is_active: form.is_active,
        documents: form.documents.map((d) => ({ title: d.title.trim() || "Link", url: d.url.trim() })).filter((d) => d.url),
        screenshots: [...shots, ...uploaded],
        order: editing?.order ?? projects.length,
      };
      if (editing) await updateDocById(COLLECTIONS.projects, editing.$id, payload);
      else await createDoc(COLLECTIONS.projects, payload);
      toast.success(editing ? "Project updated" : "Project added");
      setPanelOpen(false);
      load();
    } catch {
      toast.error("Couldn't save — check the upload and Firestore connection");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirmDelete) return;
    try {
      await deleteDocById(COLLECTIONS.projects, confirmDelete.$id);
      toast.success("Project removed");
      setConfirmDelete(null);
      load();
    } catch {
      toast.error("Couldn't delete — check Firestore connection");
    }
  }

  async function move(index: number, dir: -1 | 1) {
    const next = [...projects];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setProjects(next);
    try {
      await Promise.all(next.map((p, i) => updateDocById(COLLECTIONS.projects, p.$id, { order: i })));
    } catch {
      toast.error("Couldn't save order — check Firestore connection");
    }
  }

  async function toggleActive(p: Project) {
    const updated = { ...p, is_active: !(p.is_active ?? true) };
    setProjects((list) => list.map((x) => (x.$id === p.$id ? updated : x)));
    try {
      await updateDocById(COLLECTIONS.projects, p.$id, { is_active: updated.is_active });
    } catch {
      toast.error("Couldn't update — check Firestore connection");
    }
  }

  const inputClass = "w-full px-4 py-2.5 rounded-xl text-sm outline-none";
  const inputStyle = { background: "var(--navy2)", border: "1px solid var(--border)", color: "var(--white)" };
  const labelClass = "text-xs font-medium mb-1.5 block";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm" style={{ color: "var(--gray)" }}>
          {projects.length} project{projects.length !== 1 ? "s" : ""} — shown on the website&apos;s Work page as proof of work (and on a product&apos;s page when tagged)
        </p>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium shrink-0" style={{ background: "var(--grad)" }}>
          <Plus size={15} /> Add Project
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        {loading ? (
          <p className="text-sm text-center py-10" style={{ color: "var(--gray)" }}>Loading...</p>
        ) : projects.length === 0 ? (
          <p className="text-sm text-center py-10" style={{ color: "var(--gray)" }}>
            No projects yet. The website&apos;s Projects section stays hidden until you add one here.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["", "Preview", "Project", "Product", "Active", "Links", ""].map((h, i) => (
                    <th key={i} className="text-left px-4 py-3 text-xs uppercase tracking-wide font-medium" style={{ color: "var(--gray)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {projects.map((p, i) => (
                  <tr key={p.$id} style={{ borderBottom: "1px solid rgba(15,23,42,0.06)" }}>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <button onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up" className="disabled:opacity-30" style={{ color: "var(--gray)" }}><ChevronUp size={13} /></button>
                        <button onClick={() => move(i, 1)} disabled={i === projects.length - 1} aria-label="Move down" className="disabled:opacity-30" style={{ color: "var(--gray)" }}><ChevronDown size={13} /></button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {p.screenshots?.[0] ? (
                        <img src={p.screenshots[0]} alt="" className="w-16 h-10 rounded-lg object-cover" />
                      ) : (
                        <div className="w-16 h-10 rounded-lg flex items-center justify-center" style={{ background: "var(--navy2)", color: "var(--gray)" }}><ImageIcon size={15} /></div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium" style={{ color: "var(--white)" }}>{p.name}</p>
                      <p className="text-xs" style={{ color: "var(--gray)" }}>{[p.client, p.industry, p.year].filter(Boolean).join(" · ")}</p>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--gray2)" }}>
                      {PRODUCT_OPTIONS.find((o) => o.value === (p.product_slug ?? ""))?.label.split(" —")[0] ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <input type="checkbox" aria-label={`Show ${p.name} on the website`} checked={p.is_active ?? true} onChange={() => toggleActive(p)} className="accent-[var(--blue)]" />
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--gray)" }}>
                      {p.url ? (
                        <a href={p.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1" style={{ color: "var(--cyan)" }}>
                          Live <ExternalLink size={12} />
                        </a>
                      ) : "—"}
                      {p.documents?.length ? ` · ${p.documents.length} doc${p.documents.length > 1 ? "s" : ""}` : ""}
                      {p.screenshots?.length ? ` · ${p.screenshots.length} img` : ""}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button onClick={() => openEdit(p)} aria-label={`Edit ${p.name}`} style={{ color: "var(--cyan)" }}><Pencil size={15} /></button>
                        <button onClick={() => setConfirmDelete(p)} aria-label={`Delete ${p.name}`} style={{ color: "#dc2626" }}><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Slide-over editor */}
      {panelOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60" onClick={() => setPanelOpen(false)} />
          <div className="relative w-full max-w-[560px] h-full overflow-y-auto p-6 flex flex-col gap-4" style={{ background: "var(--navy2)", borderLeft: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold" style={{ fontFamily: "Plus Jakarta Sans", color: "var(--white)" }}>{editing ? "Edit Project" : "Add Project"}</h3>
              <button onClick={() => setPanelOpen(false)} aria-label="Close" style={{ color: "var(--gray)" }}><X size={18} /></button>
            </div>

            <div>
              <label className={labelClass} style={{ color: "var(--gray2)" }}>Project name *</label>
              <input className={inputClass} style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass} style={{ color: "var(--gray2)" }}>Client</label>
                <input className={inputClass} style={inputStyle} value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} />
              </div>
              <div>
                <label className={labelClass} style={{ color: "var(--gray2)" }}>Industry</label>
                <input className={inputClass} style={inputStyle} value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
              </div>
              <div>
                <label className={labelClass} style={{ color: "var(--gray2)" }}>Year</label>
                <input className={inputClass} style={inputStyle} value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="2026" />
              </div>
              <div>
                <label className={labelClass} style={{ color: "var(--gray2)" }}>Product</label>
                <select className={inputClass} style={inputStyle} value={form.product_slug} onChange={(e) => setForm({ ...form, product_slug: e.target.value })}>
                  {PRODUCT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className={labelClass} style={{ color: "var(--gray2)" }}>Summary * <span style={{ color: "var(--gray)" }}>(what it is and what you delivered)</span></label>
              <textarea rows={4} className={inputClass + " resize-none"} style={inputStyle} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
            </div>
            <div>
              <label className={labelClass} style={{ color: "var(--gray2)" }}>Services delivered <span style={{ color: "var(--gray)" }}>(comma-separated)</span></label>
              <input className={inputClass} style={inputStyle} value={form.services} onChange={(e) => setForm({ ...form, services: e.target.value })} placeholder="Web app, AI chatbot, Cloud" />
            </div>
            <div>
              <label className={labelClass} style={{ color: "var(--gray2)" }}>Live project URL</label>
              <input className={inputClass} style={inputStyle} value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://…" />
            </div>

            {/* Screenshots */}
            <div>
              <p className={labelClass} style={{ color: "var(--gray2)" }}>Screenshots</p>
              {(shots.length > 0 || newFiles.length > 0) && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {shots.map((s) => (
                    <div key={s} className="relative group">
                      <img src={s} alt="" className="w-full aspect-[4/3] rounded-lg object-cover" />
                      <button onClick={() => setShots((l) => l.filter((x) => x !== s))} aria-label="Remove screenshot" className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center bg-black/70 text-white"><X size={13} /></button>
                    </div>
                  ))}
                  {newFiles.map((f) => (
                    <div key={f.preview} className="relative">
                      <img src={f.preview} alt="" className="w-full aspect-[4/3] rounded-lg object-cover opacity-80" />
                      <span className="absolute bottom-1 left-1 text-[10px] px-1.5 rounded bg-black/70 text-white">new</span>
                      <button onClick={() => setNewFiles((l) => l.filter((x) => x.preview !== f.preview))} aria-label="Remove screenshot" className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center bg-black/70 text-white"><X size={13} /></button>
                    </div>
                  ))}
                </div>
              )}
              <div {...getRootProps()} className="rounded-xl p-5 flex flex-col items-center gap-2 cursor-pointer text-center" style={{ background: "var(--surface)", border: `1.5px dashed ${isDragActive ? "var(--cyan)" : "var(--border)"}` }}>
                <input {...getInputProps()} />
                <Upload size={20} style={{ color: "var(--gray)" }} />
                <p className="text-xs" style={{ color: "var(--gray)" }}>Drag &amp; drop screenshots, or click to browse (images, up to 8 MB each)</p>
              </div>
            </div>

            {/* Documents & links */}
            <div>
              <p className={labelClass} style={{ color: "var(--gray2)" }}>Documents &amp; links <span style={{ color: "var(--gray)" }}>(case study, docs, app store, press…)</span></p>
              <div className="flex flex-col gap-2">
                {form.documents.map((d, i) => (
                  <div key={i} className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)_auto] gap-2">
                    <input className={inputClass} style={inputStyle} placeholder="Title" value={d.title} onChange={(e) => setForm({ ...form, documents: form.documents.map((x, k) => (k === i ? { ...x, title: e.target.value } : x)) })} />
                    <input className={inputClass} style={inputStyle} placeholder="https://…" value={d.url} onChange={(e) => setForm({ ...form, documents: form.documents.map((x, k) => (k === i ? { ...x, url: e.target.value } : x)) })} />
                    <button onClick={() => setForm({ ...form, documents: form.documents.filter((_, k) => k !== i) })} aria-label="Remove link" style={{ color: "#dc2626" }}><Trash2 size={15} /></button>
                  </div>
                ))}
                <button onClick={() => setForm({ ...form, documents: [...form.documents, { title: "", url: "" }] })} className="self-start flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg" style={{ color: "var(--cyan)", border: "1px solid var(--border)" }}>
                  <Plus size={13} /> Add link
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm" style={{ color: "var(--gray2)" }}>
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="accent-[var(--blue)]" />
              Show on the website
            </label>

            <button onClick={handleSave} disabled={saving} className="mt-2 py-3 rounded-xl text-white text-sm font-medium disabled:opacity-60" style={{ background: "var(--grad)" }}>
              {saving ? (newFiles.length ? "Uploading & saving..." : "Saving...") : "Save Project"}
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
            <p className="text-sm mb-6" style={{ color: "var(--gray)" }}>It will disappear from the website immediately.</p>
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
