import { NextRequest, NextResponse } from "next/server";
import cloudinary, { CLOUDINARY_ROOT } from "@/lib/cloudinary";

// Explicit allow-list — the folder name comes from request input, so this prevents
// path-traversal-style folder names and keeps uploads confined to known subfolders
// (never dumped flat into a single root folder).
const ALLOWED_FOLDERS = ["team", "clients", "blogs", "career-applications"];

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const folder = formData.get("folder");

    if (!(file instanceof File) || typeof folder !== "string" || !ALLOWED_FOLDERS.includes(folder)) {
      return NextResponse.json(
        { error: "Missing file, or folder must be one of: " + ALLOWED_FOLDERS.join(", ") },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: `${CLOUDINARY_ROOT}/${folder}`,
      resource_type: "auto",
      use_filename: true,
      unique_filename: true,
    });

    return NextResponse.json({ url: result.secure_url }, { headers: CORS_HEADERS });
  } catch (err) {
    console.error("Cloudinary upload failed:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500, headers: CORS_HEADERS });
  }
}
