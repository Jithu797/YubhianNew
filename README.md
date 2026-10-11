# Yubhian Technologies — Monorepo

Two independent apps that together make up `yubhiantechnologies.in`:

- **[`website/`](./website)** — the public marketing site (Next.js 16, App Router).
  Also hosts the shared `/api/upload` route both apps depend on for file uploads.
- **[`admin/`](./admin)** — the CMS/admin portal (Vite + React SPA) used to manage the
  website's content. Has no server of its own — every privileged operation is proxied
  through `website`'s API.

See each folder's own README for its stack, environment variables, and setup.

## Deployment

These are two separate deployments from one repo, not one build:

- `www.yubhiantechnologies.in` → a Vercel project with **Root Directory** set to `website`
- `admin.yubhiantechnologies.in` → a separate Vercel project with **Root Directory** set to `admin`

Each project needs its own environment variables set in its Vercel project settings
(see the per-app READMEs for the full list). In particular, `admin`'s
`VITE_WEBSITE_API_URL` must point at wherever `website` actually ends up deployed —
currently `https://www.yubhiantechnologies.in`.

### Go-live checklist

1. **Website project (Vercel):** Root Directory = `website`, framework Next.js. The live
   domain must be attached to *this* project — a static/Vite build has no `/api/*`
   routes, so uploads, notification emails and career applications silently fail.
   Set all variables from `website/README.md`.
2. **Admin project (Vercel):** Root Directory = `admin`, framework Vite. Set the
   `VITE_FIREBASE_*` variables and `VITE_WEBSITE_API_URL=https://www.yubhiantechnologies.in`,
   then redeploy (Vite reads them at build time). Add the domain
   `admin.yubhiantechnologies.in` and create the CNAME Vercel shows at your registrar.
3. **Firebase:** create each admin in Authentication → Users; put their UIDs in
   `website/firestore.rules` and publish; create the indexes in
   `website/firestore.indexes.json`; add `admin.yubhiantechnologies.in` under
   Authentication → Settings → Authorised domains.
4. **Smoke test:** submit the contact form → the lead appears in the admin's Leads Inbox
   and a notification email arrives; upload an image in the admin (e.g. a client logo).

**Outreach tracking:** link to the site with `?ref=<campaign>` (e.g.
`https://www.yubhiantechnologies.in/products/yucampus?ref=cold-email-oct`). Leads from
that visitor carry the campaign in the Leads Inbox ("From outreach" tab), the CSV export
and the notification email.

## Local development

Each app runs independently:

```bash
cd website && npm install && npm run dev   # http://localhost:3000
cd admin    && npm install && npm run dev  # http://localhost:5173
```

`admin`'s `.env.development` points its uploads at `http://localhost:3000` so local
dev talks to a locally-running `website` instead of the live domain.
