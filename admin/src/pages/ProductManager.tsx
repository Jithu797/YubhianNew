import { Link } from "react-router-dom";
import { Package, Inbox, FolderKanban, ExternalLink } from "lucide-react";

// The website's product pages (/products and /products/<slug>) are defined in the
// website code (website/src/lib/products.ts), so this page explains where each part of
// a product's presence is managed instead of editing the old single "product" record,
// which the website no longer reads.
const WEBSITE_URL = (import.meta.env.VITE_WEBSITE_API_URL as string | undefined) ?? "";

export default function ProductManager() {
  const cards = [
    {
      icon: Package,
      title: "Product pages",
      text: "YuCampus's page — features, workflow, modules, pricing model, FAQ, screenshots and resource links — is defined in the website code (website/src/lib/products.ts). Ask your developer to add screenshots or documents there; each section appears automatically once it has content.",
      action: WEBSITE_URL ? { label: "View YuCampus page", href: `${WEBSITE_URL}/products/yucampus`, external: true } : null,
    },
    {
      icon: Inbox,
      title: "Demo & pilot requests",
      text: "Every \"Request a demo\" or \"Free pilot\" form on the product page arrives in the Leads Inbox with the source \"yucampus-pilot\", and triggers the usual email notification.",
      action: { label: "Open Leads Inbox", href: "/leads", external: false },
    },
    {
      icon: FolderKanban,
      title: "Proof of work",
      text: "Add completed projects with screenshots, live links and documents under Projects. Tag a project with YuCampus to also show it in the Proof section of the YuCampus page.",
      action: { label: "Open Projects", href: "/projects", external: false },
    },
  ];

  return (
    <div className="grid gap-5 md:grid-cols-3">
      {cards.map((c) => (
        <div key={c.title} className="rounded-2xl p-6 flex flex-col gap-3" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <span className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(30,63,168,0.12)", color: "var(--cyan)" }}>
            <c.icon size={18} />
          </span>
          <h3 className="text-base font-bold" style={{ fontFamily: "Plus Jakarta Sans", color: "var(--white)" }}>{c.title}</h3>
          <p className="text-sm leading-relaxed" style={{ color: "var(--gray)" }}>{c.text}</p>
          {c.action &&
            (c.action.external ? (
              <a href={c.action.href} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: "var(--cyan)" }}>
                {c.action.label} <ExternalLink size={13} />
              </a>
            ) : (
              <Link to={c.action.href} className="mt-auto text-sm font-medium" style={{ color: "var(--cyan)" }}>
                {c.action.label} →
              </Link>
            ))}
        </div>
      ))}
    </div>
  );
}
