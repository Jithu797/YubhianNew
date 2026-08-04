import { NextRequest, NextResponse } from "next/server";
import { sendNotificationEmail, escapeHtml } from "@/lib/mailer";
import { appendCareerApplicationRow } from "@/lib/sheets";
import type { CareerApplicationInput } from "@/lib/career-applications";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as CareerApplicationInput;
  const { career_title, name, email, phone, resume_url, message } = body;

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
