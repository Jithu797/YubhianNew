import nodemailer from "nodemailer";

// Server-only module — never imported from a client component. Reads the Gmail App
// Password from a non-NEXT_PUBLIC_ env var so it's never bundled into browser JS.
function getTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return null;
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
