import type { NextRequest } from "next/server";

// Server-side check that a request comes from a signed-in Yubhian admin. The admin portal
// sends its Firebase ID token as "Authorization: Bearer <token>"; Firebase itself verifies
// the token (signature, expiry, project) through the Identity Toolkit lookup endpoint, and
// the account's UID must be on the admin list — the same list firestore.rules uses.

/** Admin UIDs, matching isAdmin() in firestore.rules. ADMIN_UIDS (comma-separated)
 *  overrides this when admins change, without a code change. */
const DEFAULT_ADMIN_UIDS = ["Ac85ltYltGWC4PnyXN0kgTe88DG2", "S07c0ibA8idD4l0MF8H9UoLeFd83"];

function adminUids(): Set<string> {
  const fromEnv = (process.env.ADMIN_UIDS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  return new Set(fromEnv.length ? fromEnv : DEFAULT_ADMIN_UIDS);
}

function lookupUrl(apiKey: string): string {
  // Local testing against the Firebase Auth emulator (never set in production).
  const emulator = process.env.FIREBASE_AUTH_EMULATOR_HOST;
  const base = emulator ? `http://${emulator}/identitytoolkit.googleapis.com` : "https://identitytoolkit.googleapis.com";
  return `${base}/v1/accounts:lookup?key=${encodeURIComponent(apiKey)}`;
}

export type AdminCheck = { ok: true; uid: string } | { ok: false; status: 401 | 403 | 503; error: string };

export async function verifyAdmin(req: NextRequest): Promise<AdminCheck> {
  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token || token.length > 4096) return { ok: false, status: 401, error: "Sign in to the admin portal to upload files." };

  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) return { ok: false, status: 503, error: "Sign-in verification isn't configured on the website." };

  let uid: string | undefined;
  let disabled = false;
  try {
    const res = await fetch(lookupUrl(apiKey), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: token }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return { ok: false, status: 401, error: "Your admin session has expired. Sign in again." };
    const data = (await res.json()) as { users?: { localId?: string; disabled?: boolean }[] };
    uid = data.users?.[0]?.localId;
    disabled = data.users?.[0]?.disabled === true;
  } catch {
    return { ok: false, status: 503, error: "Couldn't verify your sign-in. Try again in a moment." };
  }

  if (!uid || disabled) return { ok: false, status: 401, error: "Your admin session has expired. Sign in again." };
  if (!adminUids().has(uid)) return { ok: false, status: 403, error: "This account isn't an admin." };
  return { ok: true, uid };
}
