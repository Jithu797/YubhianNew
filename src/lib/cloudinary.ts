import { v2 as cloudinary } from "cloudinary";

// Server-only — never imported from a client component. Configured lazily so a missing
// env var fails at upload time with a clear error rather than at module load.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

// Every upload lives under this root, in a named subfolder per content type (never
// dumped flat into one folder) — e.g. "yubhian/team", "yubhian/clients", "yubhian/blogs".
export const CLOUDINARY_ROOT = "yubhian";
