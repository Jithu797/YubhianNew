"use client";

import { useState } from "react";
import { Twitter, Linkedin } from "@/components/icons/SocialIcons";
import { Link2, Check } from "lucide-react";

export default function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  function share(network: "twitter" | "linkedin") {
    const url = window.location.href;
    const text = encodeURIComponent(title);
    const target =
      network === "twitter"
        ? `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`
        : `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(target, "_blank", "noopener,noreferrer");
  }

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const btnClass = "w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:text-[var(--white)]";
  const btnStyle = { background: "var(--surface)", border: "1px solid var(--border)", color: "var(--gray)" };

  return (
    <div className="flex items-center gap-3 mt-6 pt-6" style={{ borderTop: "1px solid var(--border)" }}>
      <span className="text-xs" style={{ color: "var(--gray)" }}>Share this article</span>
      <button onClick={() => share("twitter")} className={btnClass} style={btnStyle} aria-label="Share on Twitter">
        <Twitter size={15} />
      </button>
      <button onClick={() => share("linkedin")} className={btnClass} style={btnStyle} aria-label="Share on LinkedIn">
        <Linkedin size={15} />
      </button>
      <button onClick={copyLink} className={btnClass} style={btnStyle} aria-label="Copy link">
        {copied ? <Check size={15} /> : <Link2 size={15} />}
      </button>
    </div>
  );
}
