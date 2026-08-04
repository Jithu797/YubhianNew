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

## Local development

Each app runs independently:

```bash
cd website && npm install && npm run dev   # http://localhost:3000
cd admin    && npm install && npm run dev  # http://localhost:5173
```

`admin`'s `.env.development` points its uploads at `http://localhost:3000` so local
dev talks to a locally-running `website` instead of the live domain.
