// The homepage's cinematic "worlds" — one per chapter. ScrollStage paints the active
// chapter's world behind the page, scrubbing its video with scroll. Drop a file at
// `video` (and optionally `poster`) in /public/chapters to replace the painted
// placeholder; see public/chapters/README.md for the generation prompts and encoding.

export type WorldPalette = {
  /** Sky gradient, top → bottom */
  sky: [string, string];
  /** Soft cloud/light blobs drifting across the world */
  blobs: string[];
  /** Twinkling sparkle colour, or null for none */
  sparkle: string | null;
};

export type ChapterWorld = {
  id: string;
  /** Optional clip: base name of public/chapters/opt/<name>-1920.mp4 (and -960.mp4 for
   *  phones), encoded as described in public/chapters/README.md. */
  video?: string;
  /** "loop" plays continuously as an ambient scene; "scrub" follows the scroll position */
  videoMode?: "loop" | "scrub";
  /** Still artwork shown when there is no video (scroll-zoomed and panned instead of
   *  scrubbed): the base name of public/chapters/<name>.jpg, served from the WebP copies
   *  that scripts/optimize-images.mjs writes to public/chapters/opt. */
  image?: string;
  /** CSS object-position for the artwork, to keep its subject in frame on narrow screens */
  imagePosition?: string;
  /** Where the slow scroll-zoom pushes in towards (CSS transform-origin) */
  zoomOrigin: string;
  /** Text tone that reads on top of this world */
  tone: "light" | "dark";
  palette: WorldPalette;
};

export const CHAPTER_WORLDS: ChapterWorld[] = [
  {
    id: "hero",
    image: "hero",
    video: "hero",
    videoMode: "loop",
    imagePosition: "70% 50%",
    zoomOrigin: "74% 30%",
    tone: "light",
    palette: { sky: ["#0B201D", "#2A5650"], blobs: ["#F2C98A", "#3E6B73", "#F5DCCB"], sparkle: "#F6D58E" },
  },
  {
    id: "services",
    image: "service",
    video: "service",
    videoMode: "scrub",
    imagePosition: "50% 50%",
    zoomOrigin: "50% 60%",
    tone: "dark",
    palette: { sky: ["#BFDDE3", "#F5DCCB"], blobs: ["#FFF4E2", "#F7C9C9", "#E3F1D9", "#FBE7B5"], sparkle: null },
  },
  {
    id: "process",
    image: "process",
    video: "process",
    videoMode: "scrub",
    imagePosition: "62% 50%",
    zoomOrigin: "50% 70%",
    tone: "dark",
    palette: { sky: ["#DDF5FD", "#CFE3D6"], blobs: ["#FFFFFF", "#B9D9CF", "#F5DCCB"], sparkle: null },
  },
  {
    id: "numbers",
    image: "number",
    video: "number",
    videoMode: "scrub",
    imagePosition: "42% 60%",
    zoomOrigin: "20% 80%",
    tone: "dark",
    palette: { sky: ["#C4B9C8", "#6C8584"], blobs: ["#F5DCCB", "#E8D9A8", "#9FB8B4"], sparkle: null },
  },
  {
    id: "why-us",
    image: "why-us",
    video: "why-us",
    videoMode: "scrub",
    imagePosition: "56% 50%",
    zoomOrigin: "50% 50%",
    tone: "dark",
    palette: { sky: ["#E9C9B5", "#4E7A3A"], blobs: ["#F5DCCB", "#B4FF6A", "#83A5A0"], sparkle: null },
  },
  {
    id: "cta",
    image: "cta",
    video: "cta",
    videoMode: "scrub",
    imagePosition: "50% 62%",
    zoomOrigin: "50% 65%",
    tone: "light",
    palette: { sky: ["#4E7FA6", "#E9B98F"], blobs: ["#FFF4E2", "#F7C9C9", "#F6D58E"], sparkle: null },
  },
];

export const WORLD_BY_ID = Object.fromEntries(CHAPTER_WORLDS.map((w) => [w.id, w])) as Record<string, ChapterWorld>;

/** src/srcSet for an optimized artwork (written by scripts/optimize-images.mjs), so the
 *  browser picks enough real pixels for the screen: 960 for phones, 1920 for standard
 *  laptops, 2560 for scaled and high-density displays. `folder` is "chapters" or "pages". */
export function artSources(name: string, folder: "chapters" | "pages" = "chapters") {
  const at = (w: number) => `/${folder}/opt/${name}-${w}.webp`;
  return { src: at(1920), srcSet: `${at(960)} 960w, ${at(1920)} 1920w, ${at(2560)} 2560w` };
}
