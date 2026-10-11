import nodemailer from "nodemailer";

// Server-only module — never imported from a client component. Reads the Gmail App
// Password from a non-NEXT_PUBLIC_ env var so it's never bundled into browser JS.
// Gmail by default. SMTP_HOST (with SMTP_PORT, and SMTP_SECURE=true for port 465) sends
// through another provider instead — e.g. a domain mailbox — using the same
// GMAIL_USER / GMAIL_APP_PASSWORD credentials as the login.
function getTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user) return null;
  const host = process.env.SMTP_HOST;
  if (host) {
    return nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      ...(pass ? { auth: { user, pass } } : {}),
    });
  }
  if (!pass) return null;
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

function getRecipients(): string[] {
  return (process.env.LEAD_NOTIFICATION_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
}

export async function sendNotificationEmail(subject: string, html: string) {
  const transporter = getTransporter();
  const recipients = getRecipients();
  if (!transporter || recipients.length === 0) {
    return { sent: false, reason: "Mailer not configured" };
  }
  await transporter.sendMail({
    from: `"Yubhian Technologies" <${process.env.GMAIL_USER}>`,
    to: recipients,
    subject,
    html,
  });
  return { sent: true };
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
