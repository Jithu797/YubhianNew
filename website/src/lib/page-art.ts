// Header artwork for inner pages — one picture per page, never reused elsewhere on the
// site. Add an entry once public/pages/<key>.jpg exists and
// `node scripts/optimize-images.mjs` has been run; pages without an entry show the
// branded navy backdrop instead. `position` is the CSS object-position that keeps the
// picture's subject in frame on narrow screens.
export const PAGE_ART: Record<string, { position?: string }> = {};
