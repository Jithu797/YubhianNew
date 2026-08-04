// Named easing curves, matching the ones antigravity.google actually ships (extracted
// from their production CSS custom properties) rather than generic "easeOut"/"easeInOut"
// strings — these deliberate curves are a meaningful part of why motion on that site
// reads as premium rather than default.
export const EASE_OUT_QUART = [0.165, 0.84, 0.44, 1] as const;
export const EASE_OUT_EXPO = [0.19, 1, 0.22, 1] as const;
export const EASE_OUT_BACK = [0.34, 1.85, 0.64, 1] as const;
export const EASE_IN_OUT_QUART = [0.77, 0, 0.175, 1] as const;
