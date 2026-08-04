import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, addDoc, updateDoc, doc, getDocs, orderBy, query, limit } from "firebase/firestore";
import toast from "react-hot-toast";
import { ChevronUp, ChevronDown, Pencil } from "lucide-react";
import { db } from "../lib/firebase";
import { COLLECTIONS } from "../lib/collections";

type Settings = {
  $id?: string;
  hero_title: string;
  typewriter_words: string[];
  hero_subtitle: string;
  cta_primary: string;
  cta_secondary: string;
  stat_projects: number;
  stat_clients: number;
  stat_team: number;
  stat_years: number;
  cta_banner_title: string;
  cta_banner_subtitle: string;
};

const DEFAULTS: Settings = {
  hero_title: "We Build Intelligent",
  typewriter_words: ["AI Solutions", "Web Applications", "Mobile Apps", "Digital Products", "SaaS Platforms"],
  hero_subtitle: "Yubhian Technologies delivers enterprise-grade IT solutions from Andhra Pradesh, India.",
  cta_primary: "Explore Our Services",
  cta_secondary: "See Our Work",
  stat_projects: 15,
  stat_clients: 10,
  stat_team: 15,
  stat_years: 1,
  cta_banner_title: "Ready to build something great?",
  cta_banner_subtitle: "Let's turn your idea into a powerful digital product.",
};

type ServiceDoc = { $id: string; title: string; order?: number; is_active?: boolean };

const TABS = ["Hero", "Stats", "Services Order", "CTA Banner"] as const;
type Tab = (typeof TABS)[number];

export default function ContentEditor() {
  const [tab, setTab] = useState<Tab>("Hero");
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [wordInput, setWordInput] = useState("");
  const [services, setServices] = useState<ServiceDoc[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(query(collection(db, COLLECTIONS.siteSettings), limit(1)));
        if (!snap.empty) setSettings({ ...DEFAULTS, $id: snap.docs[0].id, ...snap.docs[0].data() } as Settings);
      } catch {
        // Firestore not configured — keep defaults
      }
      try {
        const snap = await getDocs(query(collection(db, COLLECTIONS.services), orderBy("order", "asc")));
        setServices(snap.docs.map((d) => ({ $id: d.id, ...d.data() })) as ServiceDoc[]);
      } catch {
        setServices([]);
      }
    })();
  }, []);

  function update<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings((s) => ({ ...s, [key]: value }));
    setDirty(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (settings.$id) {
        await updateDoc(doc(db, COLLECTIONS.siteSettings, settings.$id), settings);
      } else {
        const ref = await addDoc(collection(db, COLLECTIONS.siteSettings), settings);
        setSettings((s) => ({ ...s, $id: ref.id }));
      }
      toast.success("Content saved");
      setDirty(false);
    } catch {
      toast.error("Couldn't save — check Firestore connection");
    } finally {
      setSaving(false);
    }
  }

  async function moveService(index: number, dir: -1 | 1) {
    const next = [...services];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setServices(next);
    try {
      await Promise.all(
        next.map((s, i) => updateDoc(doc(db, COLLECTIONS.services, s.$id), { order: i }))
      );
    } catch {
      toast.error("Couldn't save order — check Firestore connection");
    }
  }

  async function toggleActive(s: ServiceDoc) {
    const updated = { ...s, is_active: !s.is_active };
    setServices((list) => list.map((x) => (x.$id === s.$id ? updated : x)));
    try {
      await updateDoc(doc(db, COLLECTIONS.services, s.$id), { is_active: updated.is_active });
    } catch {
      toast.error("Couldn't update — check Firestore connection");
    }
  }

  const inputClass = "w-full px-4 py-2.5 rounded-xl text-sm outline-none";
  const inputStyle = { background: "var(--navy2)", border: "1px solid var(--border)", color: "var(--white)" };
  const labelClass = "text-xs font-medium mb-1.5 block";

  return (
    <div className="flex flex-col gap-6 pb-20">
      {/* Tabs */}
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

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        {/* Editor panel */}
        <div className="rounded-2xl p-6 flex flex-col gap-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          {tab === "Hero" && (
            <>
              <div>
                <label className={labelClass} style={{ color: "var(--gray2)" }}>Hero Title Line 1</label>
                <input className={inputClass} style={inputStyle} value={settings.hero_title} onChange={(e) => update("hero_title", e.target.value)} />
              </div>
              <div>
                <label className={labelClass} style={{ color: "var(--gray2)" }}>Typewriter Words</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {settings.typewriter_words.map((w, i) => (
                    <span key={i} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs" style={{ background: "rgba(37,99,235,0.15)", color: "var(--blue2)" }}>
                      {w}
                      <button onClick={() => update("typewriter_words", settings.typewriter_words.filter((_, idx) => idx !== i))} className="hover:text-[var(--white)]">×</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    className={inputClass} style={inputStyle} value={wordInput}
                    onChange={(e) => setWordInput(e.target.value)}
                    placeholder="Add a word and press Enter"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && wordInput.trim()) {
                        e.preventDefault();
                        update("typewriter_words", [...settings.typewriter_words, wordInput.trim()]);
                        setWordInput("");
                      }
                    }}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass} style={{ color: "var(--gray2)" }}>Subtitle</label>
                <textarea className={inputClass + " resize-none"} style={inputStyle} rows={3} value={settings.hero_subtitle} onChange={(e) => update("hero_subtitle", e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass} style={{ color: "var(--gray2)" }}>Primary CTA Text</label>
                  <input className={inputClass} style={inputStyle} value={settings.cta_primary} onChange={(e) => update("cta_primary", e.target.value)} />
                </div>
                <div>
                  <label className={labelClass} style={{ color: "var(--gray2)" }}>Secondary CTA Text</label>
                  <input className={inputClass} style={inputStyle} value={settings.cta_secondary} onChange={(e) => update("cta_secondary", e.target.value)} />
                </div>
              </div>
            </>
          )}

          {tab === "Stats" && (
            <div className="grid grid-cols-2 gap-5">
              {([
                ["stat_projects", "Projects"],
                ["stat_clients", "Clients"],
                ["stat_team", "Team Members"],
                ["stat_years", "Years"],
              ] as const).map(([key, label]) => (
                <div key={key}>
                  <label className={labelClass} style={{ color: "var(--gray2)" }}>{label}</label>
                  <input
                    type="number" className={inputClass} style={inputStyle}
                    value={settings[key]} onChange={(e) => update(key, Number(e.target.value))}
                  />
                </div>
              ))}
            </div>
          )}

          {tab === "Services Order" && (
            <div className="flex flex-col gap-2">
              {services.length === 0 ? (
                <p className="text-sm text-center py-10" style={{ color: "var(--gray)" }}>
                  No services found. Manage services on the{" "}
                  <Link to="/services" style={{ color: "var(--cyan)" }}>Services</Link> page.
                </p>
              ) : (
                services.map((s, i) => (
                  <div key={s.$id} className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: "var(--navy2)", border: "1px solid var(--border)" }}>
                    <div className="flex flex-col">
                      <button onClick={() => moveService(i, -1)} disabled={i === 0} className="disabled:opacity-30" style={{ color: "var(--gray)" }}><ChevronUp size={14} /></button>
                      <button onClick={() => moveService(i, 1)} disabled={i === services.length - 1} className="disabled:opacity-30" style={{ color: "var(--gray)" }}><ChevronDown size={14} /></button>
                    </div>
                    <span className="flex-1 text-sm" style={{ color: "var(--white)" }}>{s.title}</span>
                    <label className="flex items-center gap-2 text-xs" style={{ color: "var(--gray)" }}>
                      <input type="checkbox" checked={s.is_active ?? true} onChange={() => toggleActive(s)} className="accent-[var(--blue)]" />
                      Active
                    </label>
                    <Link to="/services" style={{ color: "var(--cyan)" }}><Pencil size={14} /></Link>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === "CTA Banner" && (
            <>
              <div>
                <label className={labelClass} style={{ color: "var(--gray2)" }}>Banner Headline</label>
                <input className={inputClass} style={inputStyle} value={settings.cta_banner_title} onChange={(e) => update("cta_banner_title", e.target.value)} />
              </div>
              <div>
                <label className={labelClass} style={{ color: "var(--gray2)" }}>Subtext</label>
                <textarea className={inputClass + " resize-none"} style={inputStyle} rows={3} value={settings.cta_banner_subtitle} onChange={(e) => update("cta_banner_subtitle", e.target.value)} />
              </div>
            </>
          )}
        </div>

        {/* Live preview */}
        <div className="rounded-2xl p-6 h-max lg:sticky lg:top-24" style={{ background: "var(--navy2)", border: "1px solid var(--border)" }}>
          <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "var(--cyan)" }}>Live Preview</p>
          {tab === "Hero" && (
            <div className="flex flex-col gap-3">
              <h3 className="text-2xl font-extrabold leading-tight" style={{ fontFamily: "Plus Jakarta Sans", color: "var(--white)" }}>
                {settings.hero_title}
                <br />
                <span className="grad-text">{settings.typewriter_words[0] ?? ""}</span>
              </h3>
              <p className="text-xs font-light" style={{ color: "var(--gray)" }}>{settings.hero_subtitle}</p>
              <div className="flex gap-2 mt-2">
                <span className="px-3 py-1.5 rounded-lg text-xs text-white" style={{ background: "var(--grad)" }}>{settings.cta_primary}</span>
                <span className="px-3 py-1.5 rounded-lg text-xs" style={{ border: "1px solid rgba(15,23,42,0.16)", color: "var(--white)" }}>{settings.cta_secondary}</span>
              </div>
            </div>
          )}
          {tab === "Stats" && (
            <div className="grid grid-cols-2 gap-4">
              {[settings.stat_projects, settings.stat_clients, settings.stat_team, settings.stat_years].map((v, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl font-extrabold grad-text" style={{ fontFamily: "Plus Jakarta Sans" }}>{v}+</p>
                  <p className="text-[10px] uppercase tracking-wide" style={{ color: "var(--gray)" }}>{["Projects", "Clients", "Team", "Years"][i]}</p>
                </div>
              ))}
            </div>
          )}
          {tab === "Services Order" && (
            <p className="text-xs font-light" style={{ color: "var(--gray)" }}>
              Reordering updates the &quot;order&quot; field used to sort the Services section on the homepage.
            </p>
          )}
          {tab === "CTA Banner" && (
            <div className="text-center flex flex-col gap-2">
              <h3 className="text-lg font-extrabold" style={{ fontFamily: "Plus Jakarta Sans", color: "var(--white)" }}>{settings.cta_banner_title}</h3>
              <p className="text-xs font-light" style={{ color: "var(--gray)" }}>{settings.cta_banner_subtitle}</p>
            </div>
          )}
        </div>
      </div>

      {/* Sticky save bar */}
      <div className="fixed bottom-0 left-0 md:left-[260px] right-0 flex items-center justify-end gap-4 px-6 py-4" style={{ background: "var(--navy2)", borderTop: "1px solid var(--border)" }}>
        {dirty && (
          <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--gold)" }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--gold)" }} /> Unsaved changes
          </span>
        )}
        <button
          onClick={handleSave}
          disabled={saving || !dirty}
          className="px-6 py-2.5 rounded-xl text-white text-sm font-medium disabled:opacity-50"
          style={{ background: "var(--grad)" }}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
