export type LeadInput = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service_interest?: string;
  budget?: string;
  message: string;
  source: string;
};

/** Writes a new document to the leads collection. Firestore has no server-generated
 *  "created at" field like Appwrite's $createdAt, so we set one explicitly via
 *  serverTimestamp(). Throws on failure — callers already wrap this in try/catch and
 *  fall back to a locally-confirmed UX when Firestore isn't reachable yet. */
export async function createLead(data: LeadInput) {
  const { db } = await import("./firebase");
  const { addDoc, collection, serverTimestamp } = await import("firebase/firestore");
  await addDoc(collection(db, "leads"), {
    ...data,
    status: "new",
    created_at: serverTimestamp(),
  });

  // Email notification is best-effort — a failed/unconfigured mailer should never
  // block the lead from being saved or the form's success UX from showing.
  fetch("/api/notify-lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).catch(() => {});
}
