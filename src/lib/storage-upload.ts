/** Uploads a file to Cloudinary (under yubhian/{folder}) via the server-side /api/upload
 *  route — the API secret needed to authorize the upload never reaches the browser.
 *  Used client-side for the career application resume upload. */
export async function uploadFile(folder: string, file: File): Promise<string> {
  const body = new FormData();
  body.append("file", file);
  body.append("folder", folder);
  const res = await fetch("/api/upload", { method: "POST", body });
  if (!res.ok) throw new Error("Upload failed");
  const data = await res.json();
  return data.url;
}
