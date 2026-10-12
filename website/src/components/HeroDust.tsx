"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "framer-motion";

type Mote = { x: number; y: number; r: number; speed: number; drift: number; phase: number; depth: number; warm: boolean };

/**
 * Golden dust drifting up through the hero, in front of the video: adds depth and life
 * to the night scene. Nearer motes are larger, faster and shift more with the pointer
 * (parallax). Runs on a single canvas and stops when the hero is off-screen or the tab
 * is hidden; not rendered at all for reduced-motion visitors (the parent decides).
 */
export default function HeroDust({ px, py }: { px: MotionValue<number>; py: MotionValue<number> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let w = 0;
    let h = 0;
    let motes: Mote[] = [];
    // Phones get a lighter canvas (fewer pixels, fewer motes); the dust is soft anyway.
    const small = window.matchMedia("(max-width: 767px)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2);

    // Each mote is a copy of one glow drawn once (warm and cool), instead of a new radial
    // gradient built per mote per frame.
    const sprite = (rgb: string) => {
      const c = document.createElement("canvas");
      c.width = c.height = 64;
      const g = c.getContext("2d")!;
      const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, `rgba(${rgb}, 0.9)`);
      grad.addColorStop(1, `rgba(${rgb}, 0)`);
      g.fillStyle = grad;
      g.fillRect(0, 0, 64, 64);
      return c;
    };
    const warmSprite = sprite("255, 214, 140");
    const coolSprite = sprite("170, 215, 255");

    const seed = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(small ? 28 : 90, (w * h) / 16000));
      motes = Array.from({ length: count }, () => {
        const depth = Math.random();
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.6 + depth * 1.9,
          speed: 6 + depth * 22,
          drift: (Math.random() - 0.5) * 10,
          phase: Math.random() * Math.PI * 2,
          depth,
          warm: Math.random() > 0.3,
        };
      });
    };
    seed();

    let raf = 0;
    let last = performance.now();
    let visible = true;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!visible) return;
      ctx.clearRect(0, 0, w, h);
      const ox = px.get();
      const oy = py.get();
      for (const m of motes) {
        m.y -= m.speed * dt;
        m.x += m.drift * dt;
        if (m.y < -10) {
          m.y = h + 10;
          m.x = Math.random() * w;
        }
        const twinkle = 0.45 + 0.55 * Math.sin(now / 700 + m.phase);
        const x = m.x + ox * 24 * m.depth;
        const y = m.y + oy * 16 * m.depth;
        const size = m.r * 8;
        ctx.globalAlpha = twinkle;
        ctx.drawImage(m.warm ? warmSprite : coolSprite, x - size / 2, y - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
    };
    raf = requestAnimationFrame(tick);

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting && document.visibilityState === "visible"));
    io.observe(canvas);
    const onVisibility = () => (visible = document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    const onResize = () => seed();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
    };
  }, [px, py]);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 w-full h-full" />;
}
