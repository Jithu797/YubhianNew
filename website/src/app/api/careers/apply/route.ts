import { NextRequest, NextResponse } from "next/server";
import { sendNotificationEmail, escapeHtml } from "@/lib/mailer";
import { appendCareerApplicationRow } from "@/lib/sheets";
import { allowedOrigin, cleanText, clientIp, isEmail, rateLimited } from "@/lib/api-guard";

/** The résumé link must be a file this site uploaded to Cloudinary over HTTPS — never an
 *  arbitrary URL (e.g. javascript:) that would end up as a link in the team's inbox. */
function isOwnUpload(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "https:" && u.hostname === "res.cloudinary.com";
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (allowedOrigin(req) === null) return NextResponse.json({ error: "Origin not allowed" }, { status: 403 });
  if (rateLimited(`apply:${clientIp(req)}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const career_title = cleanText(body.career_title, 160);
  const name = cleanText(body.name, 120);
  const email = cleanText(body.email, 254);
  const phone = cleanText(body.phone, 20);
  const resume_url = cleanText(body.resume_url, 600);
  const message = cleanText(body.message, 5000);
  if (!career_title || !name || !isEmail(email) || !isOwnUpload(resume_url)) {
    return NextResponse.json({ error: "Missing or invalid application fields" }, { status: 400 });
  }

  const html = `
    <h2>New career application — ${escapeHtml(career_title)}</h2>
    <table cellpadding="6" style="border-collapse:collapse">
      <tr><td style="color:#666"><strong>Name</strong></td><td>${escapeHtml(name)}</td></tr>
      <tr><td style="color:#666"><strong>Email</strong></td><td>${escapeHtml(email)}</td></tr>
      ${phone ? `<tr><td style="color:#666"><strong>Phone</strong></td><td>${escapeHtml(phone)}</td></tr>` : ""}
      <tr><td style="color:#666"><strong>Resume</strong></td><td><a href="${escapeHtml(resume_url)}">${escapeHtml(resume_url)}</a></td></tr>
      ${message ? `<tr><td style="color:#666"><strong>Message</strong></td><td>${escapeHtml(message)}</td></tr>` : ""}
    </table>
  `;

  const [emailResult, sheetResult] = await Promise.all([
    sendNotificationEmail(`New Application: ${name} — ${career_title}`, html),
    appendCareerApplicationRow({ career_title, name, email, phone, resume_url, message }),
  ]);

  return NextResponse.json({ emailResult, sheetResult });
}
