"use client";

import { useEffect, useRef } from "react";

type Node = { x: number; y: number; vx: number; vy: number; depth: number; r: number };

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "").trim();
  const bigint = parseInt(clean, 16);
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}

/** Canvas-based node network — a drifting graph of connected points that also responds
 *  to cursor position with a depth-based parallax (nodes assigned a random "depth" shift
 *  more/less than others, the classic parallax cue), evoking a neural network / live data
 *  graph rather than a generic decorative blob. Node count scales with viewport area
 *  (capped) to stay performant, and freezes on prefers-reduced-motion. */
export default function HeroNetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const styles = getComputedStyle(document.documentElement);
    const blueRgb = hexToRgb(styles.getPropertyValue("--blue") || "#2563EB");
    const cyanRgb = hexToRgb(styles.getPropertyValue("--cyan") || "#0891B2");

    let width = 0;
    let height = 0;
    let nodes: Node[] = [];
    let raf = 0;

    // Target parallax offset (from cursor) and the smoothed value that eases toward it —
    // easing avoids any jitter and makes the motion feel fluid rather than snappy.
    let targetPX = 0;
    let targetPY = 0;
    let parallaxX = 0;
    let parallaxY = 0;
    const MAX_PARALLAX = 36;

    function resize() {
      const rect = canvas!.parentElement!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = width + "px";
      canvas!.style.height = height + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function initNodes() {
      // Denser and larger-reaching than a purely decorative touch — this is meant to
      // read as a real, ambient data graph filling the section, not a small accent.
      const count = Math.min(90, Math.max(34, Math.floor((width * height) / 15000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        depth: 0.4 + Math.random() * 1.1,
        r: 1.3 + Math.random() * 2.2,
      }));
    }

    function onMouseMove(e: MouseEvent) {
      const rect = canvas!.parentElement!.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      targetPX = Math.max(-1, Math.min(1, nx)) * MAX_PARALLAX;
      targetPY = Math.max(-1, Math.min(1, ny)) * MAX_PARALLAX;
    }

    function onMouseLeave() {
      targetPX = 0;
      targetPY = 0;
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height);
      const maxDist = Math.min(width, height) * 0.22;

      // Render positions include the per-node depth-scaled parallax offset.
      const rendered = nodes.map((n) => ({
        x: n.x + parallaxX * n.depth,
        y: n.y + parallaxY * n.depth,
        depth: n.depth,
        r: n.r,
      }));

      for (let i = 0; i < rendered.length; i++) {
        for (let j = i + 1; j < rendered.length; j++) {
          const a = rendered[i];
          const b = rendered[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.22;
            ctx!.strokeStyle = `rgba(${blueRgb.r},${blueRgb.g},${blueRgb.b},${alpha})`;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }
      }

      for (const n of rendered) {
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${cyanRgb.r},${cyanRgb.g},${cyanRgb.b},${0.3 + n.depth * 0.25})`;
        ctx!.fill();
      }
    }

    function step() {
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      }
      // Ease the parallax toward its target — smooth, no snapping.
      parallaxX += (targetPX - parallaxX) * 0.06;
      parallaxY += (targetPY - parallaxY) * 0.06;

      draw();
      raf = requestAnimationFrame(step);
    }

    resize();
    initNodes();
    draw();

    if (!prefersReducedMotion) {
      raf = requestAnimationFrame(step);
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseleave", onMouseLeave);
    }

    const onResize = () => {
      resize();
      initNodes();
      draw();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 w-full h-full" aria-hidden="true" />;
}
