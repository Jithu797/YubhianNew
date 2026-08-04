export type CareerApplicationInput = {
  career_slug: string;
  career_title: string;
  name: string;
  email: string;
  phone?: string;
  resume_url: string;
  message?: string;
};

/** Writes a new document to the career_applications collection, then triggers the
 *  server-side email notification and Google Sheet sync (best-effort — a failed/
 *  unconfigured mailer or Sheets sync should never block the applicant's confirmation). */
export async function createCareerApplication(data: CareerApplicationInput) {
  const { db } = await import("./firebase");
  const { addDoc, collection, serverTimestamp } = await import("firebase/firestore");
  await addDoc(collection(db, "career_applications"), {
    ...data,
    status: "new",
    created_at: serverTimestamp(),
  });

  fetch("/api/careers/apply", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).catch(() => {});
}
