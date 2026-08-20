import type { CSSProperties } from "react";

const NBSP = "\u00A0";

/** Per-character squash-and-bounce wave. The motion itself lives in CSS (.wave-char in
 *  globals.css) — only the per-character stagger is computed here, so this renders as
 *  plain markup with no client-side animation runtime. */
export default function WaveText({ text, className, style }: { text: string; className?: string; style?: CSSProperties }) {
  return (
    <span aria-label={text} className={className} style={{ display: "inline-block", ...style }}>
      {Array.from(text).map((ch, i) => (
        <span
          key={i}
          aria-hidden
          className="wave-char"
          style={{ animationDelay: `${i * 0.045}s` }}
        >
          {ch === " " ? NBSP : ch}
        </span>
      ))}
    </span>
  );
}
