"use client";

import { Children, type ReactNode } from "react";

type MarqueeProps = {
  children: ReactNode;
  className?: string;
  /** Seconds for one full loop — lower is faster. */
  duration?: number;
  reverse?: boolean;
  gapClassName?: string;
};

/** Infinite horizontal scroll for logo/text strips (press logos, client logos). Pure
 *  CSS animation (see .marquee-track in globals.css) — content is duplicated once so
 *  translateX(-50%) loops seamlessly, and it auto-disables under prefers-reduced-motion
 *  via the same stylesheet rule rather than a JS check, since it's a CSS animation. */
export default function Marquee({ children, className = "", duration = 32, reverse = false, gapClassName = "gap-6" }: MarqueeProps) {
  const items = Children.toArray(children);

  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{
        maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <div
        className={`marquee-track${reverse ? " marquee-reverse" : ""} flex ${gapClassName} w-max`}
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        {[...items, ...items].map((item, i) => (
          <div key={i} className="shrink-0">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
