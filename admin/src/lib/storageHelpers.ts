import toast from "react-hot-toast";
import { auth } from "./firebase";

/** Uploads a file to Cloudinary (under yubhian/{folder}) via the website's server-side
 *  /api/upload route — this admin SPA has no server of its own, so it can't hold the
 *  Cloudinary API secret directly and instead proxies through the one app that can.
 *  Failures are reported with their actual cause (previously always "Upload failed"). */
export async function uploadImage(folder: string, file: File): Promise<string> {
  const base = String(import.meta.env.VITE_WEBSITE_API_URL ?? "").replace(/\/+$/, "");
  const body = new FormData();
  body.append("file", file);
  body.append("folder", folder);

  // The website only accepts admin uploads with proof of an admin sign-in.
  const token = await auth.currentUser?.getIdToken().catch(() => undefined);
  if (!token) return fail("Your session has expired. Sign in again to upload files.");

  let res: Response;
  try {
    res = await fetch(`${base}/api/upload`, { method: "POST", body, headers: { Authorization: `Bearer ${token}` } });
  } catch {
    return fail(`Can't reach the website's upload service at ${base}. Check VITE_WEBSITE_API_URL and that the website is deployed and online.`);
  }

  let data: { url?: string; error?: string } = {};
  try {
    data = await res.json();
  } catch {
    // Non-JSON response — handled below by status.
  }
  if (res.ok && data.url) return data.url;

  if (res.status === 401) return fail(data.error ?? "Your session has expired. Sign in again to upload files.");
  if (res.status === 403 && data.error === "This account isn't an admin.") return fail("This account isn't on the website's admin list (ADMIN_UIDS in the website's Vercel settings).");
  if (res.status === 403) return fail(`The website refused this upload: this admin's address isn't allowed. Add ${window.location.origin} to ALLOWED_ORIGINS in the website's Vercel settings and redeploy it.`);
  if (res.status === 404 || res.status === 405) return fail(`${base} has no upload service (HTTP ${res.status}). VITE_WEBSITE_API_URL must point to the deployed Next.js website from this repository.`);
  if (res.status === 413 || res.status === 415 || res.status === 400 || res.status === 429) return fail(data.error ?? `Upload rejected (HTTP ${res.status}).`);
  if (res.status >= 500) return fail("The website's upload service failed — usually missing Cloudinary keys (CLOUDINARY_*) in the website's Vercel settings.");
  return fail(data.error ?? `Upload failed (HTTP ${res.status}).`);
}

function fail(message: string): never {
  toast.error(message, { id: message, duration: 9000 });
  throw new Error(message);
}
