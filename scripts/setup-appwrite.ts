/**
 * Appwrite Collections Setup Script
 * Run with: npx ts-node --esm scripts/setup-appwrite.ts
 *
 * Required env vars (create a scripts/.env file):
 *   APPWRITE_ENDPOINT=https://your-appwrite-instance/v1
 *   APPWRITE_PROJECT_ID=your-project-id
 *   APPWRITE_API_KEY=your-server-api-key
 */

import { Client, Databases, Storage, IndexType, Permission, Role, ID } from "node-appwrite";
import * as dotenv from "dotenv";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, ".env") });

const { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, APPWRITE_API_KEY } = process.env;

if (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT_ID || !APPWRITE_API_KEY) {
  console.error("❌  Missing required env vars. Create scripts/.env with APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, APPWRITE_API_KEY.");
  process.exit(1);
}

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY);

const databases = new Databases(client);
const storage = new Storage(client);

const DB_NAME = "yubhian_cms";
const DB_ID = "yubhian_cms";

const publicReadWrite = [
  Permission.read(Role.any()),
  Permission.write(Role.users()),
];

const publicRead = [
  Permission.read(Role.any()),
  Permission.write(Role.users()),
];

const usersOnly = [
  Permission.read(Role.users()),
  Permission.write(Role.users()),
];

const publicWrite = [
  Permission.read(Role.users()),
  Permission.write(Role.any()),
];

async function createDatabase() {
  console.log("📦  Creating database:", DB_NAME);
  try {
    const db = await databases.create(DB_ID, DB_NAME);
    console.log("✅  Database created:", db.$id);
    return db.$id;
  } catch (e: unknown) {
    const err = e as { code?: number; message?: string };
    if (err.code === 409) {
      console.log("ℹ️   Database already exists, continuing...");
      return DB_ID;
    }
    throw e;
  }
}

async function createCollection(
  dbId: string,
  colId: string,
  name: string,
  permissions: string[]
) {
  console.log(`\n📂  Creating collection: ${name}`);
  try {
    const col = await databases.createCollection(dbId, colId, name, permissions);
    console.log(`✅  Collection created: ${col.$id}`);
    return col.$id;
  } catch (e: unknown) {
    const err = e as { code?: number; message?: string };
    if (err.code === 409) {
      console.log(`ℹ️   Collection "${name}" already exists, skipping...`);
      return colId;
    }
    throw e;
  }
}

async function attr(
  fn: () => Promise<unknown>,
  label: string
) {
  try {
    await fn();
    console.log(`   ✓ ${label}`);
  } catch (e: unknown) {
    const err = e as { code?: number; message?: string };
    if (err.code === 409) {
      console.log(`   ⚠️  ${label} (already exists)`);
    } else {
      console.error(`   ✗ ${label}:`, err.message);
    }
  }
}

async function setupSiteSettings(dbId: string) {
  const id = "site_settings";
  await createCollection(dbId, id, "Site Settings", publicReadWrite);

  await attr(() => databases.createStringAttribute(dbId, id, "hero_title", 500, true), "hero_title");
  await attr(() => databases.createStringAttribute(dbId, id, "hero_subtitle", 1000, true), "hero_subtitle");
  await attr(() => databases.createStringAttribute(dbId, id, "hero_typewriter_words", 200, true, undefined, true), "hero_typewriter_words (array)");
  await attr(() => databases.createStringAttribute(dbId, id, "cta_primary_text", 100, false), "cta_primary_text");
  await attr(() => databases.createStringAttribute(dbId, id, "cta_secondary_text", 100, false), "cta_secondary_text");
  await attr(() => databases.createIntegerAttribute(dbId, id, "stat_projects", false), "stat_projects");
  await attr(() => databases.createIntegerAttribute(dbId, id, "stat_clients", false), "stat_clients");
  await attr(() => databases.createIntegerAttribute(dbId, id, "stat_team", false), "stat_team");
  await attr(() => databases.createIntegerAttribute(dbId, id, "stat_years", false), "stat_years");
  await attr(() => databases.createStringAttribute(dbId, id, "cta_banner_title", 300, false), "cta_banner_title");
  await attr(() => databases.createStringAttribute(dbId, id, "cta_banner_subtitle", 500, false), "cta_banner_subtitle");

  return id;
}

async function setupServices(dbId: string) {
  const id = "services";
  await createCollection(dbId, id, "Services", publicReadWrite);

  await attr(() => databases.createStringAttribute(dbId, id, "title", 200, true), "title");
  await attr(() => databases.createStringAttribute(dbId, id, "description", 1000, true), "description");
  await attr(() => databases.createStringAttribute(dbId, id, "icon", 100, false), "icon");
  await attr(() => databases.createStringAttribute(dbId, id, "tags", 100, false, undefined, true), "tags (array)");
  await attr(() => databases.createStringAttribute(dbId, id, "accent_color", 50, false), "accent_color");
  await attr(() => databases.createIntegerAttribute(dbId, id, "order", false), "order");
  await attr(() => databases.createBooleanAttribute(dbId, id, "is_active", false, true), "is_active");
  await attr(() => databases.createStringAttribute(dbId, id, "detail_page_content", 5000, false), "detail_page_content");

  // Wait for attributes to be ready before creating indexes
  await new Promise((r) => setTimeout(r, 2000));
  await attr(
    () => databases.createIndex(dbId, id, "idx_order_active", IndexType.Key, ["order", "is_active"], ["ASC", "ASC"]),
    "index: order + is_active"
  );

  return id;
}

async function setupTeam(dbId: string) {
  const id = "team";
  await createCollection(dbId, id, "Team", publicReadWrite);

  await attr(() => databases.createStringAttribute(dbId, id, "name", 200, true), "name");
  await attr(() => databases.createStringAttribute(dbId, id, "role", 200, true), "role");
  await attr(() => databases.createStringAttribute(dbId, id, "bio", 1000, false), "bio");
  await attr(() => databases.createStringAttribute(dbId, id, "photo_file_id", 500, false), "photo_file_id");
  await attr(() => databases.createStringAttribute(dbId, id, "linkedin_url", 500, false), "linkedin_url");
  await attr(() => databases.createStringAttribute(dbId, id, "twitter_url", 500, false), "twitter_url");
  await attr(() => databases.createStringAttribute(dbId, id, "email", 300, false), "email");
  await attr(() => databases.createBooleanAttribute(dbId, id, "is_director", false, false), "is_director");
  await attr(() => databases.createIntegerAttribute(dbId, id, "order", false), "order");
  await attr(() => databases.createBooleanAttribute(dbId, id, "is_active", false, true), "is_active");

  await new Promise((r) => setTimeout(r, 2000));
  await attr(
    () => databases.createIndex(dbId, id, "idx_order_active", IndexType.Key, ["order", "is_active"], ["ASC", "ASC"]),
    "index: order + is_active"
  );

  return id;
}

async function setupBlogs(dbId: string) {
  const id = "blogs";
  await createCollection(dbId, id, "Blogs", publicReadWrite);

  await attr(() => databases.createStringAttribute(dbId, id, "title", 500, true), "title");
  await attr(() => databases.createStringAttribute(dbId, id, "slug", 300, true), "slug");
  await attr(() => databases.createStringAttribute(dbId, id, "excerpt", 500, false), "excerpt");
  await attr(() => databases.createStringAttribute(dbId, id, "content", 50000, true), "content");
  await attr(() => databases.createStringAttribute(dbId, id, "cover_file_id", 500, false), "cover_file_id");
  await attr(() => databases.createStringAttribute(dbId, id, "category", 100, false), "category");
  await attr(() => databases.createStringAttribute(dbId, id, "tags", 100, false, undefined, true), "tags (array)");
  await attr(() => databases.createStringAttribute(dbId, id, "author_name", 200, false), "author_name");
  await attr(() => databases.createStringAttribute(dbId, id, "status", 50, false, "draft"), "status");
  await attr(() => databases.createDatetimeAttribute(dbId, id, "published_at", false), "published_at");
  await attr(() => databases.createIntegerAttribute(dbId, id, "read_time", false), "read_time");
  await attr(() => databases.createIntegerAttribute(dbId, id, "views", false, 0), "views");

  await new Promise((r) => setTimeout(r, 2000));
  await attr(
    () => databases.createIndex(dbId, id, "idx_slug", IndexType.Unique, ["slug"], ["ASC"]),
    "index: slug (unique)"
  );
  await attr(
    () => databases.createIndex(dbId, id, "idx_status", IndexType.Key, ["status"], ["ASC"]),
    "index: status"
  );
  await attr(
    () => databases.createIndex(dbId, id, "idx_published_at", IndexType.Key, ["published_at"], ["DESC"]),
    "index: published_at"
  );

  return id;
}

async function setupLeads(dbId: string) {
  const id = "leads";
  // leads: anyone can write (contact form), only users can read
  await createCollection(dbId, id, "Leads", publicWrite);

  await attr(() => databases.createStringAttribute(dbId, id, "name", 300, true), "name");
  await attr(() => databases.createStringAttribute(dbId, id, "email", 300, true), "email");
  await attr(() => databases.createStringAttribute(dbId, id, "phone", 50, false), "phone");
  await attr(() => databases.createStringAttribute(dbId, id, "company", 300, false), "company");
  await attr(() => databases.createStringAttribute(dbId, id, "message", 5000, true), "message");
  await attr(() => databases.createStringAttribute(dbId, id, "service_interest", 200, false), "service_interest");
  await attr(() => databases.createStringAttribute(dbId, id, "status", 50, false, "new"), "status");
  await attr(() => databases.createStringAttribute(dbId, id, "source", 100, false, "contact_form"), "source");
  await attr(() => databases.createDatetimeAttribute(dbId, id, "created_at", false), "created_at");
  await attr(() => databases.createStringAttribute(dbId, id, "budget", 100, false), "budget");
  await attr(() => databases.createStringAttribute(dbId, id, "how_heard", 200, false), "how_heard");

  await new Promise((r) => setTimeout(r, 2000));
  await attr(
    () => databases.createIndex(dbId, id, "idx_status", IndexType.Key, ["status"], ["ASC"]),
    "index: status"
  );
  await attr(
    () => databases.createIndex(dbId, id, "idx_created_at", IndexType.Key, ["created_at"], ["DESC"]),
    "index: created_at"
  );

  return id;
}

async function setupTestimonials(dbId: string) {
  const id = "testimonials";
  await createCollection(dbId, id, "Testimonials", publicReadWrite);

  await attr(() => databases.createStringAttribute(dbId, id, "client_name", 200, true), "client_name");
  await attr(() => databases.createStringAttribute(dbId, id, "client_role", 200, false), "client_role");
  await attr(() => databases.createStringAttribute(dbId, id, "company", 300, false), "company");
  await attr(() => databases.createStringAttribute(dbId, id, "quote", 2000, true), "quote");
  await attr(() => databases.createIntegerAttribute(dbId, id, "rating", false, 5), "rating");
  await attr(() => databases.createStringAttribute(dbId, id, "avatar_file_id", 500, false), "avatar_file_id");
  await attr(() => databases.createBooleanAttribute(dbId, id, "is_active", false, true), "is_active");
  await attr(() => databases.createIntegerAttribute(dbId, id, "order", false), "order");

  return id;
}

async function setupProduct(dbId: string) {
  const id = "product";
  await createCollection(dbId, id, "Product", publicReadWrite);

  await attr(() => databases.createStringAttribute(dbId, id, "name", 200, true), "name");
  await attr(() => databases.createStringAttribute(dbId, id, "tagline", 500, false), "tagline");
  await attr(() => databases.createStringAttribute(dbId, id, "description", 3000, false), "description");
  await attr(() => databases.createStringAttribute(dbId, id, "status", 100, false, "coming_soon"), "status");
  await attr(() => databases.createStringAttribute(dbId, id, "features", 500, false, undefined, true), "features (array)");
  await attr(() => databases.createStringAttribute(dbId, id, "cover_file_id", 500, false), "cover_file_id");
  await attr(() => databases.createStringAttribute(dbId, id, "demo_url", 500, false), "demo_url");
  await attr(() => databases.createIntegerAttribute(dbId, id, "waitlist_count", false, 0), "waitlist_count");

  return id;
}

async function setupStorageBucket() {
  console.log("\n🗄️   Creating storage bucket: yubhian_media");
  try {
    const bucket = await storage.createBucket(
      "yubhian_media",
      "Yubhian Media",
      [Permission.read(Role.any()), Permission.write(Role.users())],
      false,
      undefined,
      undefined,
      ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]
    );
    console.log("✅  Bucket created:", bucket.$id);
    return bucket.$id;
  } catch (e: unknown) {
    const err = e as { code?: number; message?: string };
    if (err.code === 409) {
      console.log("ℹ️   Bucket already exists, skipping...");
      return "yubhian_media";
    }
    throw e;
  }
}

async function main() {
  console.log("🚀  Yubhian Technologies — Appwrite Setup Script");
  console.log("=".repeat(50));

  const dbId = await createDatabase();

  const [
    siteSettingsId,
    servicesId,
    teamId,
    blogsId,
    leadsId,
    testimonialsId,
    productId,
  ] = await Promise.all([
    setupSiteSettings(dbId),
    setupServices(dbId),
    setupTeam(dbId),
    setupBlogs(dbId),
    setupLeads(dbId),
    setupTestimonials(dbId),
    setupProduct(dbId),
  ]);

  const bucketId = await setupStorageBucket();

  console.log("\n" + "=".repeat(50));
  console.log("🎉  Setup complete! Copy these IDs into your .env files:");
  console.log("=".repeat(50));
  console.log(`NEXT_PUBLIC_APPWRITE_DATABASE_ID=${dbId}`);
  console.log(`NEXT_PUBLIC_COLLECTION_SITE_SETTINGS=${siteSettingsId}`);
  console.log(`NEXT_PUBLIC_COLLECTION_SERVICES=${servicesId}`);
  console.log(`NEXT_PUBLIC_COLLECTION_TEAM=${teamId}`);
  console.log(`NEXT_PUBLIC_COLLECTION_BLOGS=${blogsId}`);
  console.log(`NEXT_PUBLIC_COLLECTION_LEADS=${leadsId}`);
  console.log(`NEXT_PUBLIC_COLLECTION_TESTIMONIALS=${testimonialsId}`);
  console.log(`NEXT_PUBLIC_COLLECTION_PRODUCT=${productId}`);
  console.log(`APPWRITE_STORAGE_BUCKET=${bucketId}`);
}

main().catch((err) => {
  console.error("❌  Fatal error:", err);
  process.exit(1);
});
