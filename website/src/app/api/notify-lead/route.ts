import { NextRequest, NextResponse } from "next/server";
import { sendNotificationEmail, escapeHtml } from "@/lib/mailer";
import { allowedOrigin, cleanText, clientIp, isEmail, rateLimited } from "@/lib/api-guard";

const SOURCE_LABELS: Record<string, string> = {
  contact_form: "Contact Form",
  waitlist: "Product Waitlist",
  newsletter: "Newsletter Signup",
  "yucampus-pilot": "YuCampus Pilot Request",
};

// Emails the team about a new lead. The lead itself is already saved to Firestore by
// the browser; this only notifies — so it is strictly validated and rate limited to
// stop anyone using it to flood the inbox.
export async function POST(req: NextRequest) {
  if (allowedOrigin(req) === null) return NextResponse.json({ error: "Origin not allowed" }, { status: 403 });
  if (rateLimited(`lead:${clientIp(req)}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = cleanText(body.name, 120);
  const email = cleanText(body.email, 254);
  const source = cleanText(body.source, 40);
  if (!name || !isEmail(email) || !SOURCE_LABELS[source]) {
    return NextResponse.json({ error: "Missing or invalid name, email or source" }, { status: 400 });
  }

  const rows: [string, string][] = [
    ["Name", name],
    ["Email", email],
    ["Phone", cleanText(body.phone, 20)],
    ["Company", cleanText(body.company, 160)],
    ["Service Interest", cleanText(body.service_interest, 120)],
    ["Budget", cleanText(body.budget, 60)],
    ["Message", cleanText(body.message, 5000)],
    ["Outreach campaign", cleanText(body.campaign, 80)],
  ];

  const html = `
    <h2>New lead from yubhiantechnologies.in</h2>
    <p><strong>Source:</strong> ${escapeHtml(SOURCE_LABELS[source])}</p>
    <table cellpadding="6" style="border-collapse:collapse">
      ${rows
        .filter(([, v]) => v)
        .map(([label, v]) => `<tr><td style="color:#666"><strong>${escapeHtml(label)}</strong></td><td>${escapeHtml(v)}</td></tr>`)
        .join("")}
    </table>
  `;

  const result = await sendNotificationEmail(`New Lead: ${name} (${SOURCE_LABELS[source]})`, html);
  return NextResponse.json(result);
}
