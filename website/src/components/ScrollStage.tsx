"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { CHAPTER_WORLDS, WORLD_BY_ID, artSources } from "@/lib/chapters";
import DreamWorld from "./DreamWorld";

// Which video encode fits this screen, in real pixels: 960 for phones, 1920 for
// standard screens, "full" (native resolution) for scaled and high-density displays.
type VideoSize = "960" | "1920" | "full";
const SIZE_QUERIES = ["(max-width: 960px)", "(min-resolution: 1.34dppx), (min-width: 1921px)"];
function subscribeSize(onChange: () => void) {
  const mqs = SIZE_QUERIES.map((q) => window.matchMedia(q));
  mqs.forEach((mq) => mq.addEventListener("change", onChange));
  return () => mqs.forEach((mq) => mq.removeEventListener("change", onChange));
}
function getSize(): VideoSize {
  if (window.matchMedia(SIZE_QUERIES[0]).matches) return "960";
  return window.matchMedia(SIZE_QUERIES[1]).matches ? "full" : "1920";
}

/**
 * Fixed full-screen stage behind the homepage. Whichever `[data-chapter]` section
 * crosses the middle of the viewport owns the stage: its world is loaded into the back
 * slot and crossfaded to the front, and its video's currentTime follows the reader's
 * progress through that section (scroll-scrubbing), with a slow push-in zoom.
 * Chapter sections are transparent so the stage shows through; ordinary sections are
 * opaque and simply cover it.
 */
export default function ScrollStage() {
  const reduceMotion = useReducedMotion();
  const [slots, setSlots] = useState<[string, string | null]>([CHAPTER_WORLDS[0].id, null]);
  const [front, setFront] = useState(0);
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const progress = useMotionValue(0);
  const scale = useTransform(progress, [0, 1], [1, reduceMotion ? 1 : 1.14]);
  const pan = useTransform(progress, [0, 1], ["0%", reduceMotion ? "0%" : "-2.5%"]);

  const videos = useRef<(HTMLVideoElement | null)[]>([null, null]);
  // Null on the server (it can't know the screen), so the video only mounts in the browser.
  const videoWidth = useSyncExternalStore<VideoSize | null>(subscribeSize, getSize, () => null);
  const eased = useRef(0);
  const state = useRef({ slots, front });
  useEffect(() => {
    state.current = { slots, front };
  }, [slots, front]);

  // Track the active chapter and the reader's progress through it.
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const vh = window.innerHeight;
      // The stage belongs to whichever chapter fills most of the screen. Opaque
      // sections don't count, so a chapter rising out of one takes the stage at once,
      // while two adjacent chapters hand over at the halfway point.
      let best: { id: string; r: DOMRect } | null = null;
      let bestVisible = 0;
      for (const world of CHAPTER_WORLDS) {
        const el = document.querySelector<HTMLElement>(`[data-chapter="${world.id}"]`);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        const visible = Math.min(r.bottom, vh) - Math.max(r.top, 0);
        if (visible > bestVisible) {
          bestVisible = visible;
          best = { id: world.id, r };
        }
      }
      if (best) {
        const { id, r } = best;
        // 0 when the chapter's top enters the screen (or at page top, for the hero),
        // 1 when its bottom leaves.
        const docTop = r.top + window.scrollY;
        const start = Math.max(0, docTop - vh);
        const end = docTop + r.height;
        progress.set(Math.min(1, Math.max(0, (window.scrollY - start) / (end - start))));
        const { slots: s, front: f } = state.current;
        if (s[f] !== id) {
          const back = 1 - f;
          const next: [string, string | null] = [...s];
          next[back] = id;
          setSlots(next);
          setFront(back);
        }
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [progress]);

  // Scrub the front video towards the scroll position, eased so wheel steps glide.
  useEffect(() => {
    if (reduceMotion) return;
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const { slots: s, front: f } = state.current;
      // Looping ambient clips play on their own; only "scrub" clips follow the scroll.
      if (WORLD_BY_ID[s[f] ?? ""]?.videoMode !== "scrub") return;
      const v = videos.current[f];
      if (!v || !v.duration || Number.isNaN(v.duration)) return;
      const target = progress.get() * (v.duration - 0.05);
      eased.current += (target - eased.current) * 0.12;
      if (Math.abs(v.currentTime - eased.current) > 1 / 30 && !v.seeking) v.currentTime = eased.current;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progress, reduceMotion]);

  // Warm the cache with every chapter's artwork once the page is idle, so a world is
  // already decoded when the reader scrolls into it instead of popping in late.
  useEffect(() => {
    const px = window.innerWidth * (window.devicePixelRatio || 1);
    const width = px <= 960 ? 960 : px <= 1920 ? 1920 : 2560;
    const load = () => {
      for (const w of CHAPTER_WORLDS) {
        if (!w.image) continue;
        const img = new Image();
        img.src = `/chapters/opt/${w.image}-${width}.webp`;
      }
    };
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(load, { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(load, 1200);
    return () => clearTimeout(t);
  }, []);

  // A newly fronted video starts its scrub from wherever the reader already is.
  useEffect(() => {
    const v = videos.current[front];
    eased.current = v?.duration ? progress.get() * v.duration : 0;
  }, [front, progress]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden>
      {slots.map((id, i) => {
        if (!id) return null;
        const world = WORLD_BY_ID[id];
        return (
          <motion.div
            key={i}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: i === front ? 1 : 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.9, ease: "easeInOut" }}
            style={{ scale: i === front ? scale : 1, transformOrigin: world.zoomOrigin, zIndex: i === front ? 2 : 1 }}
          >
            <DreamWorld palette={world.palette} progress={progress} />
            {world.image && (
              // Keyed per world so each newly loaded scene settles from a slight zoom
              // as it crossfades in, on top of the slot's scroll-linked push-in.
              <motion.div
                key={world.id}
                className="absolute inset-0"
                initial={reduceMotion ? false : { scale: 1.08 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.8, ease: [0.165, 0.84, 0.44, 1] }}
              >
                {/* Still artwork: a little taller than the screen so the scroll pan
                    never exposes an edge; the slot's zoom adds the push-in. */}
                <motion.img
                  {...artSources(world.image)}
                  sizes="100vw"
                  alt=""
                  fetchPriority={world.id === CHAPTER_WORLDS[0].id ? "high" : "auto"}
                  className="absolute left-0 w-full object-cover"
                  style={{ top: "-3%", height: "106%", objectPosition: world.imagePosition, y: pan }}
                />
                <DreamWorld palette={world.palette} progress={progress} sparklesOnly />
              </motion.div>
            )}
            {/* Reduced motion keeps the still picture. The clip fades in over the
                picture once it has data, so a slow connection still sees the art. */}
            {world.video && videoWidth && !reduceMotion && (
              <video
                key={`${world.id}-${videoWidth}`}
                ref={(el) => {
                  videos.current[i] = el;
                }}
                src={`/chapters/opt/${world.video}-${videoWidth}.mp4`}
                muted
                playsInline
                autoPlay={world.videoMode === "loop"}
                loop={world.videoMode === "loop"}
                preload="auto"
                disablePictureInPicture
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
                style={{ opacity: loaded[world.id] ? 1 : 0, objectPosition: world.imagePosition }}
                onLoadedMetadata={(e) => {
                  // iOS Safari only lets a video seek once it has been played; prime it.
                  if (world.videoMode !== "scrub") return;
                  const v = e.currentTarget;
                  v.play().then(() => v.pause()).catch(() => {});
                }}
                onLoadedData={() => setLoaded((m) => (m[world.id] ? m : { ...m, [world.id]: true }))}
                onError={() => setLoaded((m) => ({ ...m, [world.id]: false }))}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
