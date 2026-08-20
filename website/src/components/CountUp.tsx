"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/** Eased 0→target count, firing once when `active` turns true. Shared by <CountUp>
 *  and any component that needs the raw number (e.g. to drive a progress bar too). */
export function useCountUp(target: number, active: boolean, duration = 2000) {
  const [value, setValue] = useState(0);
  const reduceMotion = useReducedMotion();
  const firedRef = useRef(false);

  useEffect(() => {
    if (!active || firedRef.current) return;
    firedRef.current = true;

    if (reduceMotion) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValue(target);
      return;
    }

    let start = 0;
    let raf: number;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(eased * target);
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration, reduceMotion]);

  return value;
}

type CountUpProps = {
  end: number;
  decimals?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  /** Pass an external trigger (e.g. a parent's shared inView state) to sync several
   *  counters together instead of each one observing its own viewport entry. */
  active?: boolean;
};

export default function CountUp({ end, decimals = 0, duration = 2000, prefix = "", suffix = "", className, active }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const selfInView = useInView(ref, { once: true, margin: "-15% 0px -15% 0px" });
  const isActive = active ?? selfInView;
  const value = useCountUp(end, isActive, duration);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}
