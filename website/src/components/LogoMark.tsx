// The Yubhian logo as vector shapes, traced from public/logo.jpg (1563×1563 source
// space): the top chevron, the left "C", the small foot block and the grey "P". Kept as
// separate paths so each can be drawn, filled and animated on its own.
export const LOGO_VIEWBOX = "160 30 1230 1490";

export const LOGO_PARTS: { d: string; fill: string }[] = [
  { d: "M424 308 L803 47 L1140 298 L979 411 L791 283 L581 424 Z", fill: "#FFFFFF" },
  { d: "M180 489 L326 389 L662 637 L521 737 L355 620 L355 846 L625 1023 L475 1127 L180 938 Z", fill: "#FFFFFF" },
  { d: "M569 1212 L687 1130 L742 1185 L742 1500 L569 1387 Z", fill: "#FFFFFF" },
  { d: "M579 846 L1243 377 L1364 467 L1364 867 L1049 1088 L1049 1397 L875 1505 L875 997 L1191 773 L1191 628 L733 947 Z", fill: "#D9D9D9" },
];
