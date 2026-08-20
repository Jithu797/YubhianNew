"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import {
  CONSENT_STORAGE_KEY,
  CONSENT_VERSION,
  getVisitorId,
  readStoredConsent,
  type ConsentAction,
  type ConsentPrefs,
} from "@/lib/consent";

function savePrefs(prefs: ConsentPrefs) {
  localStorage.setItem(
    CONSENT_STORAGE_KEY,
    JSON.stringify({ ...prefs, version: CONSENT_VERSION, at: new Date().toISOString() })
  );
}

/** Fire-and-forget compliance record. The visitor's IP and geo are only knowable
 *  server-side, so this posts to an API route rather than writing to Firestore from
 *  the browser — and the optional context below is only attached when analytics was
 *  actually accepted, so a rejection stores strictly the minimum. */
function logConsent(action: ConsentAction, prefs: ConsentPrefs) {
  const payload: Record<string, unknown> = {
    action,
    analytics: prefs.analytics,
    marketing: prefs.marketing,
    visitor_id: getVisitorId(),
  };

  if (prefs.analytics) {
    payload.page = window.location.pathname;
    payload.referrer = document.referrer || null;
    payload.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    payload.screen = `${window.screen.width}x${window.screen.height}`;
  }

  fetch("/api/log-consent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {});
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(true);

  useEffect(() => {
    // Client-only: localStorage isn't available during SSR, so this must run post-mount.
    const stored = readStoredConsent();
    // Re-ask when there is no choice on record, or when the stored choice predates the
    // current policy version.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!stored || stored.version < CONSENT_VERSION) setVisible(true);

    function openSettings() {
      const current = readStoredConsent();
      if (current) {
        setAnalytics(current.analytics);
        setMarketing(current.marketing);
      }
      setVisible(true);
      setCustomizing(true);
    }
    window.addEventListener("open-cookie-settings", openSettings);
    return () => window.removeEventListener("open-cookie-settings", openSettings);
  }, []);

  function commit(action: ConsentAction, prefs: ConsentPrefs) {
    savePrefs(prefs);
    logConsent(action, prefs);
    setVisible(false);
    setCustomizing(false);
  }

  const acceptAll = () => commit("accept_all", { necessary: true, analytics: true, marketing: true });
  const rejectNonEssential = () => commit("reject_non_essential", { necessary: true, analytics: false, marketing: false });
  const savePreferences = () => commit("custom", { necessary: true, analytics, marketing });

  if (!visible) return null;

  return (
    <div
      className="fixed z-[150] bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:w-full sm:max-w-sm"
      role="dialog"
      aria-label="Cookie consent"
    >
      <div
        className="rounded-2xl p-6"
        style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 20px 60px rgba(15,23,42,0.18)" }}
      >
        {!customizing ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <span className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(37,99,235,0.12)" }}>
                <Cookie size={17} style={{ color: "var(--blue)" }} />
              </span>
              <div>
                <h2 className="text-sm font-bold mb-1.5" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>
                  We value your privacy
                </h2>
                <p className="text-xs leading-relaxed font-normal" style={{ color: "var(--gray)" }}>
                  We use cookies to keep our website secure, improve your experience, analyze traffic, and deliver
                  relevant content. You can accept all cookies, reject non-essential cookies, or customize your
                  preferences at any time. Your consent can be changed or withdrawn by accessing the Cookie Settings
                  link available on our website. For more information about how we use cookies and process your
                  personal data, please review our{" "}
                  <Link href="/cookie-policy" className="underline hover:text-[var(--white)] transition-colors">Cookie Policy</Link> and{" "}
                  <Link href="/privacy-policy" className="underline hover:text-[var(--white)] transition-colors">Privacy Policy</Link>.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 justify-end">
              <button
                onClick={() => setCustomizing(true)}
                className="px-4 py-2 rounded-full text-xs font-medium"
                style={{ background: "var(--navy2)", color: "var(--gray2)", border: "1px solid var(--border)" }}
              >
                Customize
              </button>
              <button
                onClick={rejectNonEssential}
                className="px-4 py-2 rounded-full text-xs font-medium"
                style={{ background: "var(--navy2)", color: "var(--gray2)", border: "1px solid var(--border)" }}
              >
                Reject Non-Essential
              </button>
              <button
                onClick={acceptAll}
                className="px-4 py-2 rounded-full text-xs font-medium text-white"
                style={{ background: "var(--grad)" }}
              >
                Accept All
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-bold" style={{ fontFamily: "var(--font-syne)", color: "var(--white)" }}>
              Cookie Preferences
            </h2>

            <div className="flex items-center justify-between gap-4 py-2" style={{ borderBottom: "1px solid var(--border)" }}>
              <div>
                <p className="text-xs font-medium" style={{ color: "var(--white)" }}>Necessary</p>
                <p className="text-xs" style={{ color: "var(--gray)" }}>Required for the site to function. Always on.</p>
              </div>
              <input type="checkbox" checked disabled className="accent-[var(--blue)] opacity-60" />
            </div>

            <div className="flex items-center justify-between gap-4 py-2" style={{ borderBottom: "1px solid var(--border)" }}>
              <div>
                <p className="text-xs font-medium" style={{ color: "var(--white)" }}>Analytics</p>
                <p className="text-xs" style={{ color: "var(--gray)" }}>Helps us understand how visitors use our site.</p>
              </div>
              <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} className="accent-[var(--blue)]" />
            </div>

            <div className="flex items-center justify-between gap-4 py-2">
              <div>
                <p className="text-xs font-medium" style={{ color: "var(--white)" }}>Marketing</p>
                <p className="text-xs" style={{ color: "var(--gray)" }}>Used to deliver relevant content and offers.</p>
              </div>
              <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="accent-[var(--blue)]" />
            </div>

            <div className="flex flex-wrap gap-3 justify-end">
              <button
                onClick={() => setCustomizing(false)}
                className="px-4 py-2 rounded-full text-xs font-medium"
                style={{ background: "var(--navy2)", color: "var(--gray2)", border: "1px solid var(--border)" }}
              >
                Back
              </button>
              <button
                onClick={savePreferences}
                className="px-4 py-2 rounded-full text-xs font-medium text-white"
                style={{ background: "var(--grad)" }}
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
