import { NextRequest, NextResponse } from "next/server";
import { CONSENT_ACTIONS, CONSENT_VERSION, type ConsentAction } from "@/lib/consent";

/** Caps every stored string so a malicious client can't write unbounded documents.
 *  This endpoint necessarily accepts anonymous input, so nothing from the request
 *  body is trusted or persisted without being validated and truncated first. */
function clean(value: unknown, max = 256): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : null;
}

/** The browser can't reliably know its own public IP — this only works because it is
 *  read from proxy-populated request headers on the server. */
function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim().slice(0, 64);
  return req.headers.get("x-real-ip")?.slice(0, 64) ?? "unknown";
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const action = clean(body.action, 32) as ConsentAction | null;
  if (!action || !CONSENT_ACTIONS.includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const analytics = body.analytics === true;
  const marketing = body.marketing === true;

  // Proof-of-consent fields. These are the lawful basis for the record itself, so they
  // are stored for every visitor regardless of their choices.
  const record: Record<string, unknown> = {
    visitor_id: clean(body.visitor_id, 64) ?? "unavailable",
    action,
    analytics,
    marketing,
    consent_version: CONSENT_VERSION,
    ip: getClientIp(req),
    user_agent: req.headers.get("user-agent")?.slice(0, 512) ?? "unknown",
    country: req.headers.get("x-vercel-ip-country") ?? null,
  };

  // Everything below is optional context, not required to evidence consent — so it is
  // only recorded when the visitor actually allowed analytics. Declining means we keep
  // strictly the minimum needed to prove the choice was made.
  if (analytics) {
    record.page = clean(body.page, 512);
    record.referrer = clean(body.referrer, 512);
    record.language = clean(req.headers.get("accept-language"), 64);
    record.region = req.headers.get("x-vercel-ip-country-region") ?? null;
    record.city = req.headers.get("x-vercel-ip-city") ?? null;
    record.timezone = clean(body.timezone, 64);
    record.screen = clean(body.screen, 32);
  }

  try {
    const { db } = await import("@/lib/firebase");
    const { addDoc, collection, serverTimestamp } = await import("firebase/firestore");
    await addDoc(collection(db, "consent_logs"), { ...record, created_at: serverTimestamp() });
    return NextResponse.json({ logged: true });
  } catch {
    // Firestore unreachable — the visitor's choice still applies locally via
    // localStorage. This log is a compliance record, not a functional dependency.
    return NextResponse.json({ logged: false });
  }
}
