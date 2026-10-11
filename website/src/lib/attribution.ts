// Outreach attribution. Links in cold emails / LinkedIn messages carry a tag, e.g.
//   https://www.yubhiantechnologies.in/products/yucampus?ref=cold-email-oct
// (utm_campaign / utm_source work too). The first tag a visitor arrives with is kept
// for 60 days and attached to any form they submit, so the admin's Leads Inbox shows
// which leads came from outreach — and which campaign.
const KEY = "yubhian-attribution";
const TTL_MS = 60 * 24 * 60 * 60 * 1000;

/** Normalises a tag to a short, safe label (letters, digits, - _ .), max 80 chars. */
function clean(value: string | null): string {
  return (value ?? "").trim().toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

/** Reads ?ref / utm_* from the current URL and stores it (first touch wins). */
export function captureAttribution() {
  try {
    const params = new URLSearchParams(window.location.search);
    const campaign = clean(params.get("ref") || params.get("utm_campaign") || params.get("utm_source"));
    if (!campaign) return;
    const existing = readStored();
    if (existing) return;
    localStorage.setItem(KEY, JSON.stringify({ campaign, at: Date.now() }));
  } catch {
    // Storage unavailable (private mode) — attribution is best-effort.
  }
}

function readStored(): string | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const { campaign, at } = JSON.parse(raw) as { campaign?: string; at?: number };
    if (!campaign || !at || Date.now() - at > TTL_MS) {
      localStorage.removeItem(KEY);
      return null;
    }
    return campaign;
  } catch {
    return null;
  }
}

/** The visitor's outreach campaign tag, if they arrived through one. */
export function getAttribution(): string | null {
  if (typeof window === "undefined") return null;
  return readStored();
}
