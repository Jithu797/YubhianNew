import { NextRequest, NextResponse } from "next/server";
import { sendNotificationEmail, escapeHtml } from "@/lib/mailer";

const SOURCE_LABELS: Record<string, string> = {
  contact_form: "Contact Form",
  waitlist: "Product Waitlist",
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, phone, company, service_interest, budget, message, source } = body as Record<string, string>;

  const rows: [string, string | undefined][] = [
    ["Name", name],
    ["Email", email],
    ["Phone", phone],
    ["Company", company],
    ["Service Interest", service_interest],
    ["Budget", budget],
    ["Message", message],
  ];

  const html = `
    <h2>New lead from yubhiantechnologies.in</h2>
    <p><strong>Source:</strong> ${escapeHtml(SOURCE_LABELS[source] ?? source ?? "Unknown")}</p>
    <table cellpadding="6" style="border-collapse:collapse">
      ${rows
        .filter(([, v]) => v)
        .map(([label, v]) => `<tr><td style="color:#666"><strong>${escapeHtml(label)}</strong></td><td>${escapeHtml(v!)}</td></tr>`)
        .join("")}
    </table>
  `;

  const result = await sendNotificationEmail(`New Lead: ${name || "Unknown"} (${SOURCE_LABELS[source] ?? source})`, html);
  return NextResponse.json(result);
}
