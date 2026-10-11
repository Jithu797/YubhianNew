import { NextRequest, NextResponse } from "next/server";
import cloudinary, { CLOUDINARY_ROOT } from "@/lib/cloudinary";
import { allowedOrigin, clientIp, corsHeaders, rateLimited } from "@/lib/api-guard";

// What each folder may receive. The folder name comes from request input, so this both
// confines uploads to known subfolders and fixes the file types and sizes per folder —
// previously any file of any size and type could be pushed to the Cloudinary account.
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const FOLDERS: Record<string, { types: string[]; maxBytes: number; resource: "image" | "raw" }> = {
  team: { types: IMAGE_TYPES, maxBytes: 8 * 1024 * 1024, resource: "image" },
  blogs: { types: IMAGE_TYPES, maxBytes: 8 * 1024 * 1024, resource: "image" },
  // Project screenshots for the Work page and product pages.
  projects: { types: IMAGE_TYPES, maxBytes: 8 * 1024 * 1024, resource: "image" },
  // Client logos are often SVG; Cloudinary serves them from its own domain, not ours.
  clients: { types: [...IMAGE_TYPES, "image/svg+xml"], maxBytes: 4 * 1024 * 1024, resource: "image" },
  "career-applications": {
    types: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    maxBytes: 10 * 1024 * 1024,
    resource: "raw",
  },
};

/** Checks the file's leading bytes, so a renamed executable can't pass as a PDF/Word file. */
function documentSignatureOk(type: string, head: Uint8Array): boolean {
  const starts = (...b: number[]) => b.every((v, i) => head[i] === v);
  if (type === "application/pdf") return starts(0x25, 0x50, 0x44, 0x46); // %PDF
  if (type === "application/msword") return starts(0xd0, 0xcf, 0x11, 0xe0); // OLE2
  return starts(0x50, 0x4b, 0x03, 0x04); // .docx is a ZIP container
}

export async function OPTIONS(req: NextRequest) {
  const origin = allowedOrigin(req);
  if (origin === null) return new NextResponse(null, { status: 403 });
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export async function POST(req: NextRequest) {
  const origin = allowedOrigin(req);
  if (origin === null) return NextResponse.json({ error: "Origin not allowed" }, { status: 403 });
  const headers = corsHeaders(origin);

  if (rateLimited(`upload:${clientIp(req)}`, 20, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many uploads — please try again in a few minutes." }, { status: 429, headers });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const folder = formData.get("folder");
    const rules = typeof folder === "string" ? FOLDERS[folder] : undefined;

    if (!(file instanceof File) || !rules) {
      return NextResponse.json(
        { error: "Missing file, or folder must be one of: " + Object.keys(FOLDERS).join(", ") },
        { status: 400, headers },
      );
    }
    if (!rules.types.includes(file.type)) {
      return NextResponse.json({ error: `That file type isn't accepted here (${file.type || "unknown"}).` }, { status: 415, headers });
    }
    if (file.size === 0 || file.size > rules.maxBytes) {
      return NextResponse.json({ error: `File must be under ${Math.round(rules.maxBytes / 1024 / 1024)} MB.` }, { status: 413, headers });
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    if (rules.resource === "raw" && !documentSignatureOk(file.type, bytes.subarray(0, 4))) {
      return NextResponse.json({ error: "That file doesn't look like a valid PDF or Word document." }, { status: 415, headers });
    }

    const dataUri = `data:${file.type};base64,${Buffer.from(bytes).toString("base64")}`;
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: `${CLOUDINARY_ROOT}/${folder}`,
      // "image" makes Cloudinary itself reject anything that isn't really an image.
      resource_type: rules.resource,
      use_filename: true,
      unique_filename: true,
    });

    return NextResponse.json({ url: result.secure_url }, { headers });
  } catch (err) {
    console.error("Cloudinary upload failed:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500, headers });
  }
}
