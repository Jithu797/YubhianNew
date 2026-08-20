/** Shared contract between the cookie banner and the server-side consent logger. */

export type ConsentPrefs = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

/** Bump when the cookie policy materially changes — stored on each record so it's
 *  provable which policy version a visitor agreed to, and so the banner can be
 *  re-shown to people who only consented under an older version. */
export const CONSENT_VERSION = 1;

export const CONSENT_STORAGE_KEY = "yubhian-cookie-consent";
export const VISITOR_STORAGE_KEY = "yubhian-visitor-id";

export const CONSENT_ACTIONS = ["accept_all", "reject_non_essential", "custom"] as const;
export type ConsentAction = (typeof CONSENT_ACTIONS)[number];

export type StoredConsent = ConsentPrefs & { version: number; at: string };

/** A first-party, random identifier used only to attribute consent records to a
 *  returning visitor on this site. It is not derived from any personal data and is
 *  never shared with third parties, so it can't be used for cross-site tracking. */
export function getVisitorId(): string {
  try {
    const existing = localStorage.getItem(VISITOR_STORAGE_KEY);
    if (existing) return existing;
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `v-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(VISITOR_STORAGE_KEY, id);
    return id;
  } catch {
    // Private-browsing modes can throw on localStorage access — consent still works,
    // the record just won't be linkable to a returning visitor.
    return "unavailable";
  }
}

export function readStoredConsent(): StoredConsent | null {
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredConsent>;
    if (typeof parsed.analytics !== "boolean" || typeof parsed.marketing !== "boolean") return null;
    return { necessary: true, analytics: parsed.analytics, marketing: parsed.marketing, version: parsed.version ?? 0, at: parsed.at ?? "" };
  } catch {
    return null;
  }
}
