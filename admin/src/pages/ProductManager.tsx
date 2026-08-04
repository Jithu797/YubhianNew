import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { X, Plus } from "lucide-react";
import { listDocs, createDoc, updateDocById, limit } from "../lib/firestoreHelpers";
import { COLLECTIONS } from "../lib/collections";

type Product = {
  $id?: string;
  name: string;
  tagline: string;
  description: string;
  status: string;
  features: string[];
  demo_url: string;
  waitlist_count: number;
};

const DEFAULTS: Product = {
  name: "Yubhian Flagship Product",
  tagline: "Something powerful is coming",
  description: "We are not just a services company. Yubhian is building its own product.",
  status: "coming_soon",
  features: [],
  demo_url: "",
  waitlist_count: 0,
};

const STATUS_OPTIONS = ["coming_soon", "beta", "launched"];

export default function ProductManager() {
  const [product, setProduct] = useState<Product>(DEFAULTS);
  const [featureInput, setFeatureInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const docs = await listDocs<Product>(COLLECTIONS.product, [limit(1)]);
        if (docs.length) setProduct({ ...DEFAULTS, ...docs[0] });
      } catch {
        // Firestore not configured — keep defaults
      }
    })();
  }, []);

  function update<K extends keyof Product>(key: K, value: Product[K]) {
    setProduct((p) => ({ ...p, [key]: value }));
    setDirty(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (product.$id) {
        await updateDocById(COLLECTIONS.product, product.$id, product);
      } else {
        const ref = await createDoc(COLLECTIONS.product, product);
        setProduct((p) => ({ ...p, $id: ref.id }));
      }
      toast.success("Product info saved");
      setDirty(false);
    } catch {
      toast.error("Couldn't save — check Firestore connection");
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "w-full px-4 py-2.5 rounded-xl text-sm outline-none";
  const inputStyle = { background: "var(--surface)", border: "1px solid var(--border)", color: "var(--white)" };
  const labelClass = "text-xs font-medium mb-1.5 block";

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="rounded-2xl p-6 flex flex-col gap-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <div>
          <label className={labelClass} style={{ color: "var(--gray2)" }}>Product Name</label>
          <input className={inputClass} style={inputStyle} value={product.name} onChange={(e) => update("name", e.target.value)} />
        </div>
        <div>
          <label className={labelClass} style={{ color: "var(--gray2)" }}>Tagline</label>
          <input className={inputClass} style={inputStyle} value={product.tagline} onChange={(e) => update("tagline", e.target.value)} />
        </div>
        <div>
          <label className={labelClass} style={{ color: "var(--gray2)" }}>Description</label>
          <textarea rows={4} className={inputClass + " resize-none"} style={inputStyle} value={product.description} onChange={(e) => update("description", e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass} style={{ color: "var(--gray2)" }}>Status</label>
            <select className={inputClass} style={inputStyle} value={product.status} onChange={(e) => update("status", e.target.value)}>
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass} style={{ color: "var(--gray2)" }}>Waitlist Count</label>
            <input type="number" className={inputClass} style={inputStyle} value={product.waitlist_count} onChange={(e) => update("waitlist_count", Number(e.target.value))} />
          </div>
        </div>
        <div>
          <label className={labelClass} style={{ color: "var(--gray2)" }}>Demo URL</label>
          <input className={inputClass} style={inputStyle} value={product.demo_url} onChange={(e) => update("demo_url", e.target.value)} />
        </div>
        <div>
          <label className={labelClass} style={{ color: "var(--gray2)" }}>Features</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {product.features.map((f, i) => (
              <span key={i} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs" style={{ background: "rgba(37,99,235,0.15)", color: "var(--blue2)" }}>
                {f}
                <button onClick={() => update("features", product.features.filter((_, idx) => idx !== i))} className="hover:text-[var(--white)]"><X size={11} /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              className={inputClass} style={inputStyle} value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              placeholder="Add a feature and press Enter"
              onKeyDown={(e) => {
                if (e.key === "Enter" && featureInput.trim()) {
                  e.preventDefault();
                  update("features", [...product.features, featureInput.trim()]);
                  setFeatureInput("");
                }
              }}
            />
            <button
              onClick={() => {
                if (featureInput.trim()) {
                  update("features", [...product.features, featureInput.trim()]);
                  setFeatureInput("");
                }
              }}
              className="px-4 rounded-xl text-white"
              style={{ background: "var(--grad)" }}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving || !dirty}
        className="self-end px-6 py-2.5 rounded-xl text-white text-sm font-medium disabled:opacity-50"
        style={{ background: "var(--grad)" }}
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}
