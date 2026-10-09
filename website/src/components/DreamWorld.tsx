"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import type { WorldPalette } from "@/lib/chapters";

// Fixed layouts (not random) so server and client render identically.
const BLOBS = [
  { x: 8, y: 72, w: 62, h: 46, drift: -14 },
  { x: 58, y: 64, w: 70, h: 52, drift: 18 },
  { x: 30, y: 18, w: 44, h: 30, drift: -8 },
  { x: 78, y: 10, w: 40, h: 28, drift: 12 },
];
const SPARKLES = [
  [12, 22, 1.0], [24, 58, 0.6], [37, 12, 0.8], [46, 40, 0.5], [55, 26, 1.1], [63, 70, 0.7],
  [71, 18, 0.9], [82, 46, 0.6], [90, 12, 1.0], [18, 84, 0.5], [88, 78, 0.8], [6, 44, 0.7],
  [42, 76, 0.6], [74, 88, 0.5], [96, 34, 0.6], [29, 34, 0.4],
] as const;

/** Painted stand-in for a chapter's video: sky gradient, soft drifting light and
 *  four-point sparkles. `progress` (0→1 through the chapter) drives the drift so the
 *  scene still moves with scroll, the way the scrubbed video will. With `sparklesOnly`
 *  it draws just the twinkling sparkles, to lay over still artwork. */
export default function DreamWorld({
  palette,
  progress,
  sparklesOnly = false,
}: {
  palette: WorldPalette;
  progress: MotionValue<number>;
  sparklesOnly?: boolean;
}) {
  const driftA = useTransform(progress, [0, 1], ["0%", "-6%"]);
  const driftB = useTransform(progress, [0, 1], ["0%", "6%"]);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {!sparklesOnly && (
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${palette.sky[0]} 0%, ${palette.sky[1]} 100%)` }} />
      )}

      {!sparklesOnly &&
        BLOBS.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full dream-float"
          style={{
            left: `${b.x - b.w / 2}%`,
            top: `${b.y - b.h / 2}%`,
            width: `${b.w}%`,
            height: `${b.h}%`,
            background: `radial-gradient(closest-side, ${palette.blobs[i % palette.blobs.length]} 0%, transparent 100%)`,
            opacity: 0.75,
            filter: "blur(18px)",
            x: i % 2 ? driftB : driftA,
            animationDelay: `${i * -3.5}s`,
          }}
        />
      ))}

      {palette.sparkle &&
        SPARKLES.map(([x, y, s], i) => (
          <span
            key={i}
            className="absolute dream-sparkle"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${s * 18}px`,
              height: `${s * 18}px`,
              color: palette.sparkle!,
              animationDelay: `${(i * 0.73) % 4}s`,
            }}
          >
            <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor">
              <path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0z" />
            </svg>
          </span>
        ))}

      {/* Fine grain so flat gradients read as painted rather than digital */}
      {!sparklesOnly && <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay dream-grain" />}
    </div>
  );
}
