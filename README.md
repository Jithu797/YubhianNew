# Yubhian Technologies — Website

Public marketing site for Yubhian Technologies LLP. Next.js 16 (App Router), deployed
on Vercel at `www.yubhiantechnologies.in`.

This app also hosts the **shared upload API** (`/api/upload`) used by both this site
and the separate admin portal — see [Companion apps](#companion-apps) below.

## Stack

- **Framework**: Next.js 16 (App Router, Turbopack, Route Handlers for API endpoints)
- **Data**: Firebase Firestore (content + form submissions), no server database of its own
- **File storage**: Cloudinary, proxied through `/api/upload` so the API secret never
  reaches the browser (see `src/lib/cloudinary.ts` and `src/app/api/upload/route.ts`)
- **Email**: Nodemailer over Gmail SMTP (App Password) — every lead/application sends a
  notification (`src/lib/mailer.ts`)
- **Spreadsheet sync**: career applications also append a row to a Google Sheet via a
  dedicated service account (`src/lib/sheets.ts`)
- **Animation**: Framer Motion, plus Lenis for smooth-scroll physics
- **Styling**: Tailwind CSS v4, CSS custom properties for the design system (see
  `src/app/globals.css`)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Copy `.env.local.example` (create one if it doesn't exist yet) or set these directly —
none of them should ever be committed:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_FIREBASE_*` (API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID, MEASUREMENT_ID) | Firebase client config — safe to expose, gated by Firestore security rules (`firestore.rules`) |
| `GMAIL_USER`, `GMAIL_APP_PASSWORD` | SMTP sender for lead/application notification emails |
| `LEAD_NOTIFICATION_EMAILS` | Comma-separated list of addresses that receive notifications |
| `GOOGLE_SHEETS_SPREADSHEET_ID`, `GOOGLE_SHEETS_CLIENT_EMAIL`, `GOOGLE_SHEETS_PRIVATE_KEY` | Service account used to append career applications to a tracking sheet |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Server-only — used by `/api/upload`, never sent to the browser |

Server-only variables (everything except `NEXT_PUBLIC_*`) must **not** get a
`NEXT_PUBLIC_` prefix, or they'd be bundled into client JS.

## Firestore setup

- `firestore.rules` — paste into Firebase Console → Firestore → Rules. Public content
  collections are read-open / admin-write; "inbox" collections (`leads`,
  `career_applications`, `consent_logs`) are the reverse (public create, admin-only read).
- `firestore.indexes.json` — composite indexes required by the `where` + `orderBy`
  queries this app runs (clients, careers, services, blogs, testimonials all filter on
  `is_active`/`status` and sort by `order`/`published_at`). Without these, the query
  fails silently and the section just doesn't render. Create them either by clicking
  through Firebase Console → Firestore → Indexes with the fields listed in this file,
  or via `firebase deploy --only firestore:indexes` if the Firebase CLI is set up.

## Companion apps

This repo is one of **two separate applications** that together make up
`yubhiantechnologies.in`:

- **This repo** — the public website (Next.js), meant to live at the root/`www` domain.
- **`yubhian-admin`** — a separate Vite + React SPA, the CMS used to manage content
  (services, team, blog, careers, clients, testimonials, site settings). It's a
  standalone client-side app with **no server of its own**, so it can't hold secrets —
  every privileged operation (file uploads) is proxied through this app's
  `/api/upload` route. The admin's `VITE_WEBSITE_API_URL` env var must point at
  wherever this app is actually deployed.

They are two separate git repos and need two separate deployments (see that repo's
README for its own setup). Recommended domain layout:

- `www.yubhiantechnologies.in` → this repo (Vercel project)
- `admin.yubhiantechnologies.in` → `yubhian-admin` (separate Vercel project)

## Deployment

Deployed on Vercel. As of this writing the project has **not** been connected to a
working GitHub remote — the `origin` currently configured in `.git` points at a repo
that doesn't resolve. Before the first deploy: fix or recreate the GitHub repo, push,
then import it into Vercel and set the environment variables above in the Vercel
project settings (not just locally).
