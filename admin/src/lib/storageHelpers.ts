/** Uploads a file to Cloudinary (under yubhian/{folder}) via the website's server-side
 *  /api/upload route — this admin SPA has no server of its own, so it can't hold the
 *  Cloudinary API secret directly and instead proxies through the one app that can. */
export async function uploadImage(folder: string, file: File): Promise<string> {
  const body = new FormData();
  body.append("file", file);
  body.append("folder", folder);
  const res = await fetch(`${import.meta.env.VITE_WEBSITE_API_URL}/api/upload`, { method: "POST", body });
  if (!res.ok) throw new Error("Upload failed");
  const data = await res.json();
  return data.url;
}
