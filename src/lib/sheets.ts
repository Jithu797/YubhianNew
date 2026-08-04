import { google } from "googleapis";

// Server-only module. Reads a dedicated Google service account (separate from the Firebase
// one) so a Sheets-only credential is never bundled into client JS or coupled to Firebase Admin.
function getSheetsClient() {
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!clientEmail || !privateKey || !spreadsheetId) return null;

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return { sheets: google.sheets({ version: "v4", auth }), spreadsheetId };
}

export async function appendCareerApplicationRow(row: {
  career_title: string;
  name: string;
  email: string;
  phone?: string;
  resume_url: string;
  message?: string;
}) {
  const client = getSheetsClient();
  if (!client) return { appended: false, reason: "Google Sheets not configured" };

  await client.sheets.spreadsheets.values.append({
    spreadsheetId: client.spreadsheetId,
    range: "Sheet1!A:G",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[
        new Date().toISOString(),
        row.career_title,
        row.name,
        row.email,
        row.phone ?? "",
        row.resume_url,
        row.message ?? "",
      ]],
    },
  });
  return { appended: true };
}
