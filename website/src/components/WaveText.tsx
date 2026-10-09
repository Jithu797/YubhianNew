import type { CSSProperties } from "react";

/** Per-character squash-and-bounce wave. The motion itself lives in CSS (.wave-char in
 *  globals.css) — only the per-character stagger is computed here, so this renders as
 *  plain markup with no client-side animation runtime. Characters are grouped into
 *  unbreakable words with real spaces between them, so a long line wraps between words
 *  rather than mid-word. */
export default function WaveText({ text, className, style }: { text: string; className?: string; style?: CSSProperties }) {
  const words = text.split(" ");
  // Character offset of each word in the full string, so the wave keeps one continuous
  // stagger across words (spaces count as a beat).
  const starts = words.map((_, w) => words.slice(0, w).reduce((n, word) => n + word.length + 1, 0));

  return (
    <span aria-label={text} className={className} style={{ display: "inline-block", ...style }}>
      {words.map((word, w) => (
        <span key={w} aria-hidden>
          <span className="inline-block whitespace-nowrap">
            {Array.from(word).map((ch, c) => (
              <span key={c} className="wave-char" style={{ animationDelay: `${(starts[w] + c) * 0.045}s` }}>
                {ch}
              </span>
            ))}
          </span>
          {w < words.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}
