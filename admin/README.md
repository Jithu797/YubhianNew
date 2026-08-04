# Yubhian Technologies — Admin

CMS/admin portal for the Yubhian Technologies website. Vite + React SPA — **this app has
no server of its own**, so anything requiring a secret (file uploads) is proxied through
the companion website's API instead of being handled here.

## Stack

- **Framework**: Vite + React 19 + TypeScript
- **Data**: Firebase Firestore (client SDK) — same Firebase project as the public website
- **Auth**: Firebase Auth, with a fixed-credential fallback bridge for the founders'
  login until real Firebase Auth accounts exist (see `src/context/AuthContext.tsx` for
  exactly how and why — it explains the security implication of the fallback path and
  how to retire it by creating the account in Firebase Console → Authentication)
- **File uploads**: proxied to the website's `/api/upload` route (see
  `src/lib/storageHelpers.ts`) — this app cannot hold the Cloudinary API secret itself

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) (or whatever port Vite prints).

## Environment variables

| Variable | Purpose |
|---|---|
| `VITE_FIREBASE_*` (API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID, MEASUREMENT_ID) | Same Firebase project as the website |
| `VITE_WEBSITE_API_URL` | Base URL of the **website** app — its `/api/upload` route is what actually performs uploads. Must point at wherever that app is currently reachable. |

Vite loads env files by mode:
- `.env` — base values (used as the fallback for `vite build`, i.e. production)
- `.env.development` — overrides for `vite` (dev mode) — currently points
  `VITE_WEBSITE_API_URL` at `http://localhost:3000` so local dev talks to a locally
  running website instead of the live domain

**Restart the dev server after changing any `.env*` file** — Vite does not hot-reload them.

## Companion app

This is one of **two separate git repos** that make up `yubhiantechnologies.in`:

- **This repo** — the admin CMS, meant to live on its own subdomain, not the root domain.
- **`yubhian-website`** — the public Next.js site, which also hosts the shared
  `/api/upload` proxy this app depends on for every file upload.

Recommended domain layout:

- `www.yubhiantechnologies.in` → `yubhian-website` (separate Vercel project)
- `admin.yubhiantechnologies.in` → this repo (separate Vercel project)

Whichever URL the website ends up deployed at, `VITE_WEBSITE_API_URL` in this app's
production environment (set in Vercel project settings, not just `.env`) must match it
exactly, or uploads will fail.

## Deployment

Deploy as a static Vite build (`npm run build` → `dist/`) on Vercel, or any static host.
Set `VITE_WEBSITE_API_URL` and the Firebase variables above as environment variables in
that host's project settings — a `.env` file is not read at build/deploy time on Vercel
unless you're building locally and uploading the output.
