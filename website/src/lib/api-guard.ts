import type { NextRequest } from "next/server";
import { SITE_URL } from "./site";

// Shared protections for the public API routes. They take anonymous input (contact,
// pilot and career forms, admin uploads), so every route validates and bounds what it
// accepts instead of trusting the request.

/** Browser origins allowed to call the API: this site, the admin portal, and local dev.
 *  Extra origins (e.g. a Vercel preview URL) can be added via ALLOWED_ORIGINS, comma-separated. */
const ALLOWED_ORIGINS = new Set(
  [
    SITE_URL,
    SITE_URL.replace("://www.", "://"),
    "https://admin.yubhiantechnologies.in",
    // Local development only — a deployed site has no reason to trust localhost pages.
    ...(process.env.NODE_ENV === "production" && process.env.VERCEL ? [] : ["http://localhost:3000", "http://localhost:5173"]),
    ...(process.env.ALLOWED_ORIGINS ?? "").split(","),
  ]
    .map((o) => o.trim().replace(/\/+$/, ""))
    .filter(Boolean),
);

/** The calling page's origin if it may use the API, otherwise null. The site's own pages
 *  are always allowed (origin host == the host serving this request), so forms keep
 *  working on preview deployments and any port; other sites must be on the allowlist
 *  (the admin portal). Requests without an Origin header return "" and fall through to
 *  the route's own validation. */
export function allowedOrigin(req: NextRequest): string | null {
  const origin = req.headers.get("origin");
  if (!origin) return "";
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  try {
    if (host && new URL(origin).host === host) return origin;
  } catch {
    return null;
  }
  return ALLOWED_ORIGINS.has(origin) ? origin : null;
}

export function corsHeaders(origin: string): Record<string, string> {
  if (!origin) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    Vary: "Origin",
  };
}

export function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

// Fixed-window rate limit held in memory. On serverless this is per instance, so it
// blunts bursts from one client rather than enforcing a global quota — enough to stop
// a single script from flooding the inbox or the upload bucket.
const hits = new Map<string, { count: number; reset: number }>();
export function rateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || entry.reset <= now) {
    hits.set(key, { count: 1, reset: now + windowMs });
    if (hits.size > 5000) for (const [k, v] of hits) if (v.reset <= now) hits.delete(k);
    return false;
  }
  entry.count += 1;
  return entry.count > limit;
}

/** True when the request declares a body larger than `maxBytes` (or none at all for a
 *  chunked upload larger than the cap) — checked before the body is read, so an oversized
 *  request is refused instead of being buffered into memory first. */
export function bodyTooLarge(req: NextRequest, maxBytes: number): boolean {
  const declared = Number(req.headers.get("content-length"));
  return Number.isFinite(declared) && declared > maxBytes;
}

/** Trimmed string capped at `max` characters, or "" for anything that isn't a string. */
export function cleanText(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function isEmail(value: string): boolean {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
