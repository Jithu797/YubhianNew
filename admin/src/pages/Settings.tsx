import { useEffect, useState } from "react";
import { updateProfile, updatePassword } from "firebase/auth";
import toast from "react-hot-toast";
import { AlertTriangle, Download } from "lucide-react";
import { auth } from "../lib/firebase";
import { listDocs, createDoc, updateDocById, deleteDocById, limit } from "../lib/firestoreHelpers";
import { COLLECTIONS } from "../lib/collections";
import { useAuth } from "../context/useAuth";

const TABS = ["Account", "Admin Users", "Site Config", "Danger Zone"] as const;
type Tab = (typeof TABS)[number];

type SiteConfig = {
  $id?: string;
  contact_email: string;
  ga_id: string;
  linkedin_url: string;
  twitter_url: string;
  instagram_url: string;
  address: string;
};

const DEFAULT_CONFIG: SiteConfig = {
  contact_email: "info@yubhiantechnologies.in",
  ga_id: "",
  linkedin_url: "https://linkedin.com/company/yubhian-technologies",
  twitter_url: "",
  instagram_url: "",
  address: "Kaikaluru, Andhra Pradesh, India",
};

const inputClass = "w-full px-4 py-2.5 rounded-xl text-sm outline-none";
const inputStyle = { background: "var(--navy2)", border: "1px solid var(--border)", color: "var(--white)" };
const labelClass = "text-xs font-medium mb-1.5 block";

export default function Settings() {
  const { user, refresh } = useAuth();
  const [tab, setTab] = useState<Tab>("Account");

  // Account tab
  const [name, setName] = useState(user?.name ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savingAccount, setSavingAccount] = useState(false);

  // Site config tab
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [savingConfig, setSavingConfig] = useState(false);

  // Danger zone
  const [exporting, setExporting] = useState(false);
  const [clearConfirmStep, setClearConfirmStep] = useState(0);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const docs = await listDocs<SiteConfig>(COLLECTIONS.siteSettings, [limit(1)]);
        if (docs.length) setConfig({ ...DEFAULT_CONFIG, ...docs[0] });
      } catch {
        // Firestore not configured — keep defaults
      }
    })();
  }, []);

  async function handleUpdateName() {
    if (!auth.currentUser) {
      toast.error("Name changes need a real Firebase Auth account — the fixed founders login has no profile to update");
      return;
    }
    setSavingAccount(true);
    try {
      await updateProfile(auth.currentUser, { displayName: name });
      await refresh();
      toast.success("Name updated");
    } catch {
      toast.error("Couldn't update name — check Firestore connection");
    } finally {
      setSavingAccount(false);
    }
  }

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!auth.currentUser) {
      toast.error("Password changes need a real Firebase Auth account — the fixed founders login has no account to update");
      return;
    }
    if (!currentPassword || newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    setSavingAccount(true);
    try {
      await updatePassword(auth.currentUser, newPassword);
      toast.success("Password updated");
      setCurrentPassword("");
      setNewPassword("");
    } catch {
      toast.error("Couldn't update password — you may need to sign in again before changing it");
    } finally {
      setSavingAccount(false);
    }
  }

  async function handleSaveConfig() {
    setSavingConfig(true);
    try {
      if (config.$id) {
        await updateDocById(COLLECTIONS.siteSettings, config.$id, config);
      } else {
        const ref = await createDoc(COLLECTIONS.siteSettings, config);
        setConfig((c) => ({ ...c, $id: ref.id }));
      }
      toast.success("Site config saved");
    } catch {
      toast.error("Couldn't save — check Firestore connection");
    } finally {
      setSavingConfig(false);
    }
  }

  async function handleExport() {
    setExporting(true);
    try {
      const collections = COLLECTIONS as Record<string, string>;
      const entries = await Promise.all(
        Object.entries(collections).map(async ([key, id]) => {
          try {
            return [key, await listDocs(id)];
          } catch {
            return [key, []];
          }
        })
      );
      const data = Object.fromEntries(entries);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "yubhian-data-export.json";
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Export downloaded");
    } finally {
      setExporting(false);
    }
  }

  async function handleClearLeads() {
    setClearing(true);
    try {
      const leads = await listDocs(COLLECTIONS.leads, [limit(100)]);
      await Promise.all(leads.map((d) => deleteDocById(COLLECTIONS.leads, d.$id)));
      toast.success("All leads cleared");
    } catch {
      toast.error("Couldn't clear leads — check Firestore connection");
    } finally {
      setClearing(false);
      setClearConfirmStep(0);
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex gap-1 rounded-xl p-1 w-max" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={tab === t ? { background: "var(--grad)", color: "white" } : { color: "var(--gray)" }}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Account" && (
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl p-6 flex flex-col gap-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <h3 className="font-bold" style={{ fontFamily: "Plus Jakarta Sans", color: "var(--white)" }}>Profile</h3>
            <div>
              <label className={labelClass} style={{ color: "var(--gray2)" }}>Name</label>
              <input className={inputClass} style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <p className="text-xs" style={{ color: "var(--gray)" }}>Email: {user?.email}</p>
            <button onClick={handleUpdateName} disabled={savingAccount} className="self-start px-5 py-2 rounded-xl text-white text-sm font-medium disabled:opacity-60" style={{ background: "var(--grad)" }}>
              Save Name
            </button>
          </div>

          <form onSubmit={handleUpdatePassword} className="rounded-2xl p-6 flex flex-col gap-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <h3 className="font-bold" style={{ fontFamily: "Plus Jakarta Sans", color: "var(--white)" }}>Change Password</h3>
            <div>
              <label className={labelClass} style={{ color: "var(--gray2)" }}>Current Password</label>
              <input type="password" className={inputClass} style={inputStyle} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            </div>
            <div>
              <label className={labelClass} style={{ color: "var(--gray2)" }}>New Password</label>
              <input type="password" className={inputClass} style={inputStyle} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>
            <button type="submit" disabled={savingAccount} className="self-start px-5 py-2 rounded-xl text-white text-sm font-medium disabled:opacity-60" style={{ background: "var(--grad)" }}>
              Update Password
            </button>
          </form>
        </div>
      )}

      {tab === "Admin Users" && (
        <div className="rounded-2xl p-6" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <p className="text-sm leading-relaxed" style={{ color: "var(--gray)" }}>
            Listing and inviting admin users requires Firebase Admin SDK (a service account key), which can&apos;t
            be called securely from the browser. Manage admins directly from the Firebase console&apos;s Authentication
            section, or wire up a Cloud Function if you want this done from here.
          </p>
        </div>
      )}

      {tab === "Site Config" && (
        <div className="rounded-2xl p-6 flex flex-col gap-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div>
            <label className={labelClass} style={{ color: "var(--gray2)" }}>Contact Email</label>
            <input className={inputClass} style={inputStyle} value={config.contact_email} onChange={(e) => setConfig({ ...config, contact_email: e.target.value })} />
          </div>
          <div>
            <label className={labelClass} style={{ color: "var(--gray2)" }}>Google Analytics ID</label>
            <input className={inputClass} style={inputStyle} value={config.ga_id} onChange={(e) => setConfig({ ...config, ga_id: e.target.value })} placeholder="G-XXXXXXXXXX" />
          </div>
          <div>
            <label className={labelClass} style={{ color: "var(--gray2)" }}>LinkedIn URL</label>
            <input className={inputClass} style={inputStyle} value={config.linkedin_url} onChange={(e) => setConfig({ ...config, linkedin_url: e.target.value })} />
          </div>
          <div>
            <label className={labelClass} style={{ color: "var(--gray2)" }}>Twitter URL</label>
            <input className={inputClass} style={inputStyle} value={config.twitter_url} onChange={(e) => setConfig({ ...config, twitter_url: e.target.value })} />
          </div>
          <div>
            <label className={labelClass} style={{ color: "var(--gray2)" }}>Instagram URL</label>
            <input className={inputClass} style={inputStyle} value={config.instagram_url} onChange={(e) => setConfig({ ...config, instagram_url: e.target.value })} />
          </div>
          <div>
            <label className={labelClass} style={{ color: "var(--gray2)" }}>Company Address</label>
            <input className={inputClass} style={inputStyle} value={config.address} onChange={(e) => setConfig({ ...config, address: e.target.value })} />
          </div>
          <button onClick={handleSaveConfig} disabled={savingConfig} className="self-start px-5 py-2 rounded-xl text-white text-sm font-medium disabled:opacity-60" style={{ background: "var(--grad)" }}>
            {savingConfig ? "Saving..." : "Save Config"}
          </button>
        </div>
      )}

      {tab === "Danger Zone" && (
        <div className="rounded-2xl p-6 flex flex-col gap-6" style={{ background: "rgba(220,38,38,0.05)", border: "1px solid rgba(220,38,38,0.3)" }}>
          <div className="flex items-start gap-3">
            <AlertTriangle size={18} style={{ color: "#dc2626" }} className="shrink-0 mt-0.5" />
            <p className="text-sm" style={{ color: "var(--gray2)" }}>
              These actions are irreversible. Proceed carefully.
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--white)" }}>Export all data as JSON</p>
              <p className="text-xs" style={{ color: "var(--gray)" }}>Downloads every collection as a single JSON file.</p>
            </div>
            <button onClick={handleExport} disabled={exporting} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-60" style={{ background: "var(--surface)", color: "var(--gray2)", border: "1px solid var(--border)" }}>
              <Download size={14} /> {exporting ? "Exporting..." : "Export"}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--white)" }}>Clear all leads</p>
              <p className="text-xs" style={{ color: "var(--gray)" }}>Permanently deletes every lead in the inbox.</p>
            </div>
            {clearConfirmStep === 0 ? (
              <button onClick={() => setClearConfirmStep(1)} className="px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ background: "#dc2626" }}>
                Clear Leads
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: "#dc2626" }}>Are you absolutely sure?</span>
                <button onClick={() => setClearConfirmStep(0)} className="px-3 py-1.5 rounded-lg text-xs" style={{ background: "var(--surface)", color: "var(--gray2)" }}>Cancel</button>
                <button onClick={handleClearLeads} disabled={clearing} className="px-3 py-1.5 rounded-lg text-xs text-white disabled:opacity-60" style={{ background: "#dc2626" }}>
                  {clearing ? "Clearing..." : "Yes, delete all"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
