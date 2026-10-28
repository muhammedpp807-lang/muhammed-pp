# Muhammed PP Portfolio

A responsive Next.js portfolio for Muhammed PP. The public homepage opens without a sign-in. The separately protected admin area is at `/admin` and `/admin/login`.

## What’s included

- Premium dark portfolio with scroll-responsive, autoplaying electric-blue wireframe background.
- Profile, project, learning timeline, milestone, contact, and private admin inbox sections.
- PostgreSQL content storage through Drizzle ORM.
- Admin-only image uploads: local filesystem in development; Vercel Blob in Vercel deployments.
- Downloadable source archive at **`/api/download`** (also linked in the footer). It includes the source, setup files, and `.env.example`; it excludes secrets, runtime uploads, dependencies, and build output.

## Requirements

- Node.js 20.9 or newer
- npm
- PostgreSQL for the website and admin data

## Run locally

1. Download the source ZIP from the site footer or clone your GitHub repository.
2. Install packages:

   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env.local` and set `DATABASE_URL`. To enable admin sign-in from the first run, also set `ADMIN_PASSWORD` to a unique password at least 16 characters long. Do not commit `.env.local`.
4. Push the database schema:

   ```bash
   npx drizzle-kit push
   ```

   Drizzle reads `.env.local` and `.env`. The first homepage request seeds factual starter profile, project, and timeline records. The achievements list remains empty. Admin credentials are created only when a strong `ADMIN_PASSWORD` is configured.
5. Start the development server:

   ```bash
   npm run dev
   ```

   Open `http://localhost:3000`. Public visitors do not need to sign in. The admin area is at `http://localhost:3000/admin/login`.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes for runtime and schema setup | PostgreSQL connection string. Use a managed PostgreSQL service for Vercel. |
| `ADMIN_PASSWORD` | Only to provision the first admin or migrate a legacy admin hash | Unique secret of at least 16 characters. Set it in server-side environment settings only. |
| `BLOB_READ_WRITE_TOKEN` | Local Blob uploads only | Optional Vercel Blob token for local testing. Vercel deployments can use the linked Blob store’s OIDC credentials. |

There is **no published or built-in admin password**. Password hashes use a per-password random salt and PBKDF2. If an older database contains the starter’s legacy hash, set a new strong `ADMIN_PASSWORD` in the server environment; the next successful admin sign-in upgrades it.

## Publish to GitHub

This workspace is not connected to a GitHub repository. Create an empty repository in your own GitHub account, then from the downloaded project directory run:

```bash
git init
git add .
git status --short
```

Check that `.env`, `.env.local`, `node_modules`, `.next`, and `public/uploads` are not staged. The supplied `.gitignore` excludes them. Then commit and push:

```bash
git add .
git commit -m "Prepare Muhammed PP portfolio"
git branch -M main
git remote add origin https://github.com/YOUR_ACCOUNT/YOUR_REPOSITORY.git
git push -u origin main
```

Replace the remote URL with your repository’s actual URL. Never commit production database URLs, admin passwords, Blob tokens, or uploaded/private content.

## Deploy to Vercel

1. Import the GitHub repository into Vercel. Next.js is detected automatically; the build command is `npm run build`.
2. Create or select a managed PostgreSQL database (for example Neon or Supabase) and add its connection string as the Vercel `DATABASE_URL` environment variable for the environments you will deploy.
3. If you want admin access, set a unique 16+ character `ADMIN_PASSWORD` in Vercel’s encrypted environment settings **before the first admin sign-in**. Do not use a public/demo password.
4. Apply the schema from a trusted local machine. Put the production connection string in your ignored `.env.local` file, then run:

   ```bash
   npx drizzle-kit push
   ```

   Drizzle reads `.env.local`; keep the connection string out of Git and terminal history.
5. For persistent admin image uploads, create a **public Vercel Blob store** and connect it to this Vercel project. Vercel supplies OIDC credentials to the deployment. No Blob credential is required in client-side code. Without Blob, the deployment can serve the portfolio but persistent uploads are unavailable on Vercel’s ephemeral filesystem.
6. Deploy from Vercel. Verify `/api/health`, the public homepage, and `/admin/login` after deployment.

## Useful commands

```bash
npm run dev
npm run build
npm run start
npx drizzle-kit push
```

## Routes

- `/` — public portfolio; no startup login prompt.
- `/admin/login` — separate admin sign-in.
- `/admin` — admin dashboard.
- `/api/download` — downloadable ZIP of the allowlisted project source.
- `/api/health` — database-backed health check.

No GitHub push or Vercel deployment has been performed from this workspace. You’ll need to connect your own GitHub repository and Vercel/PostgreSQL resources using the steps above.
