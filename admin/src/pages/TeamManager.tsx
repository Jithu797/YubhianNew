import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDropzone } from "react-dropzone";
import { ChevronUp, ChevronDown, Pencil, Trash2, Plus, X, Upload } from "lucide-react";
import { listDocs, createDoc, updateDocById, deleteDocById, orderBy } from "../lib/firestoreHelpers";
import { uploadImage } from "../lib/storageHelpers";
import { COLLECTIONS } from "../lib/collections";
import { Linkedin } from "../components/SocialIcons";

type Member = {
  $id: string;
  name: string;
  role: string;
  bio?: string;
  photo_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  email?: string;
  is_director?: boolean;
  order?: number;
  is_active?: boolean;
};

const EMPTY = { name: "", role: "", bio: "", linkedin_url: "", twitter_url: "", email: "", is_director: false, is_active: true };

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

export default function TeamManager() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Member | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 1,
    onDrop: (files) => {
      if (files[0]) {
        setPhotoFile(files[0]);
        setPhotoPreview(URL.createObjectURL(files[0]));
      }
    },
  });

  async function load() {
    setLoading(true);
    try {
      setMembers(await listDocs<Member>(COLLECTIONS.team, [orderBy("order", "asc")]));
    } catch {
      setMembers([]);
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
    setPhotoFile(null);
    setPhotoPreview(null);
    setPanelOpen(true);
  }

  function openEdit(m: Member) {
    setEditing(m);
    setForm({
      name: m.name, role: m.role, bio: m.bio ?? "",
      linkedin_url: m.linkedin_url ?? "", twitter_url: m.twitter_url ?? "",
      email: m.email ?? "", is_director: m.is_director ?? false, is_active: m.is_active ?? true,
    });
    setPhotoFile(null);
    setPhotoPreview(m.photo_url ?? null);
    setPanelOpen(true);
  }

  async function handleSave() {
    if (!form.name || !form.role) {
      toast.error("Name and role are required");
      return;
    }
    setSaving(true);
    try {
      let photo_url = editing?.photo_url;
      if (photoFile) {
        photo_url = await uploadImage("team", photoFile);
      }
      const payload = { ...form, photo_url, order: editing?.order ?? members.length };
      if (editing) {
        await updateDocById(COLLECTIONS.team, editing.$id, payload);
      } else {
        await createDoc(COLLECTIONS.team, payload);
      }
      toast.success(editing ? "Team member updated" : "Team member added");
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
      await deleteDocById(COLLECTIONS.team, confirmDelete.$id);
      toast.success("Removed from team");
      setConfirmDelete(null);
      load();
    } catch {
      toast.error("Couldn't delete — check Firestore connection");
    }
  }

  async function move(index: number, dir: -1 | 1) {
    const next = [...members];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setMembers(next);
    try {
      await Promise.all(next.map((m, i) => updateDocById(COLLECTIONS.team, m.$id, { order: i })));
    } catch {
      toast.error("Couldn't save order — check Firestore connection");
    }
  }

  async function toggle(m: Member, field: "is_director" | "is_active") {
    const updated = { ...m, [field]: !m[field] };
    setMembers((list) => list.map((x) => (x.$id === m.$id ? updated : x)));
    try {
      await updateDocById(COLLECTIONS.team, m.$id, { [field]: updated[field] });
    } catch {
      toast.error("Couldn't update — check Firestore connection");
    }
  }

  const inputClass = "w-full px-4 py-2.5 rounded-xl text-sm outline-none";
  const inputStyle = { background: "var(--navy2)", border: "1px solid var(--border)", color: "var(--white)" };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: "var(--gray)" }}>{members.length} team member{members.length !== 1 ? "s" : ""}</p>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium" style={{ background: "var(--grad)" }}>
          <Plus size={15} /> Add Member
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        {loading ? (
          <p className="text-sm text-center py-10" style={{ color: "var(--gray)" }}>Loading...</p>
        ) : members.length === 0 ? (
          <p className="text-sm text-center py-10" style={{ color: "var(--gray)" }}>No team members yet. Add your first one.</p>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["", "Photo", "Name & Role", "Director", "Active", "LinkedIn", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wide font-medium" style={{ color: "var(--gray)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {members.map((m, i) => {
                const url = m.photo_url;
                return (
                  <tr key={m.$id} style={{ borderBottom: "1px solid rgba(15,23,42,0.06)" }}>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <button onClick={() => move(i, -1)} disabled={i === 0} className="disabled:opacity-30" style={{ color: "var(--gray)" }}><ChevronUp size={13} /></button>
                        <button onClick={() => move(i, 1)} disabled={i === members.length - 1} className="disabled:opacity-30" style={{ color: "var(--gray)" }}><ChevronDown size={13} /></button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {url ? (
                        <img src={url} alt={m.name} className="w-9 h-9 rounded-full object-cover" />
                      ) : (
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "var(--grad)" }}>
                          {initials(m.name)}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium" style={{ color: "var(--white)" }}>{m.name}</p>
                      <p className="text-xs" style={{ color: "var(--gray)" }}>{m.role}</p>
                    </td>
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={m.is_director ?? false} onChange={() => toggle(m, "is_director")} className="accent-[var(--blue)]" />
                    </td>
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={m.is_active ?? true} onChange={() => toggle(m, "is_active")} className="accent-[var(--blue)]" />
                    </td>
                    <td className="px-4 py-3">
                      {m.linkedin_url ? <Linkedin size={14} className="text-[var(--blue2)]" /> : <span style={{ color: "var(--gray)" }}>—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button onClick={() => openEdit(m)} style={{ color: "var(--cyan)" }}><Pencil size={15} /></button>
                        <button onClick={() => setConfirmDelete(m)} style={{ color: "#dc2626" }}><Trash2 size={15} /></button>
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
              <h3 className="text-lg font-bold" style={{ fontFamily: "Plus Jakarta Sans", color: "var(--white)" }}>{editing ? "Edit Member" : "Add Member"}</h3>
              <button onClick={() => setPanelOpen(false)} style={{ color: "var(--gray)" }}><X size={18} /></button>
            </div>

            <div {...getRootProps()} className="rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer text-center" style={{ background: "var(--surface)", border: `1.5px dashed ${isDragActive ? "var(--cyan)" : "var(--border)"}` }}>
              <input {...getInputProps()} />
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <Upload size={22} style={{ color: "var(--gray)" }} />
              )}
              <p className="text-xs" style={{ color: "var(--gray)" }}>Drag &amp; drop a photo, or click to browse</p>
            </div>

            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--gray2)" }}>Full Name *</label>
              <input className={inputClass} style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--gray2)" }}>Role *</label>
              <input className={inputClass} style={inputStyle} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
            </div>
            <label className="flex items-center gap-2 text-sm" style={{ color: "var(--gray2)" }}>
              <input type="checkbox" checked={form.is_director} onChange={(e) => setForm({ ...form, is_director: e.target.checked })} className="accent-[var(--blue)]" />
              Is Director
            </label>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--gray2)" }}>Bio ({form.bio.length}/500)</label>
              <textarea maxLength={500} rows={3} className={inputClass + " resize-none"} style={inputStyle} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--gray2)" }}>LinkedIn URL</label>
              <input className={inputClass} style={inputStyle} value={form.linkedin_url} onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--gray2)" }}>Twitter URL</label>
              <input className={inputClass} style={inputStyle} value={form.twitter_url} onChange={(e) => setForm({ ...form, twitter_url: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--gray2)" }}>Email</label>
              <input className={inputClass} style={inputStyle} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <label className="flex items-center gap-2 text-sm" style={{ color: "var(--gray2)" }}>
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="accent-[var(--blue)]" />
              Is Active
            </label>

            <button onClick={handleSave} disabled={saving} className="mt-2 py-3 rounded-xl text-white text-sm font-medium disabled:opacity-60" style={{ background: "var(--grad)" }}>
              {saving ? "Saving..." : "Save Member"}
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
            <p className="text-sm mb-6" style={{ color: "var(--gray)" }}>This will remove them from the team section immediately.</p>
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
