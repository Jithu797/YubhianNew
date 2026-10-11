import { ImageResponse } from "next/og";
import { LOGO_PARTS, LOGO_VIEWBOX } from "@/components/LogoMark";

// Link-preview card (WhatsApp, LinkedIn, X, Slack…) for every page that doesn't set its
// own: the vector logo and name on the brand's navy, generated at build time — no
// photo, so no site artwork is reused here.
export const alt = "Yubhian Technologies — AI & software studio from Andhra Pradesh, India";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 64,
          padding: "0 96px",
          background: "linear-gradient(135deg, #050A2E 0%, #0A1550 55%, #0E3F8F 100%)",
          color: "#F6F7FB",
        }}
      >
        <svg width="220" height="268" viewBox={LOGO_VIEWBOX}>
          {LOGO_PARTS.map((p, i) => (
            <path key={i} d={p.d} fill={p.fill} />
          ))}
        </svg>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 30, letterSpacing: 6, textTransform: "uppercase", color: "#7CC4FF" }}>AI &amp; software studio</div>
          <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.05, marginTop: 14 }}>Yubhian</div>
          <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.05 }}>Technologies</div>
          <div style={{ fontSize: 30, marginTop: 26, color: "rgba(246,247,251,0.75)" }}>Built in Andhra Pradesh, for the world</div>
        </div>
      </div>
    ),
    size,
  );
}
