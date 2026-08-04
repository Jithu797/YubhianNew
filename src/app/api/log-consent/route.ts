import { NextRequest, NextResponse } from "next/server";

function getClientIp(req: NextRequest): string {
  // The browser can't reliably know its own public IP — this only works because it's
  // read from request headers on the server, populated by the hosting platform's proxy.
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action, analytics, marketing } = body as { action: string; analytics: boolean; marketing: boolean };

  const record = {
    ip: getClientIp(req),
    user_agent: req.headers.get("user-agent") ?? "unknown",
    action,
    analytics: !!analytics,
    marketing: !!marketing,
  };

  try {
    const { db } = await import("@/lib/firebase");
    const { addDoc, collection, serverTimestamp } = await import("firebase/firestore");
    await addDoc(collection(db, "consent_logs"), { ...record, created_at: serverTimestamp() });
    return NextResponse.json({ logged: true });
  } catch {
    // Firestore not reachable — the consent choice still applies locally via
    // localStorage, this log is a compliance record, not a functional dependency.
    return NextResponse.json({ logged: false });
  }
}
