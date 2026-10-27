# Muhammed PP — Premium Personal Portfolio & Admin Suite

A production-ready, minimalist, typography-driven personal portfolio web application built for **Muhammed PP**, inspired by modern creative developer art direction.

- **Portfolio URL**: [https://muhammed-pp.vercel.app/](https://muhammed-pp.vercel.app/)
- **Identity**: Student at Darul Hasanath Islamic College (Kannadiparamba, Kannur, Kerala), Computer Technician, and DIGIHUB Computer-Lab Administrator.
- **Location**: Kolantha, Kerala, India.

---

## Key Features & Art Direction

### 1. Zero Visitor Startup Gate
Unlike early prototypes, public visitors **never** encounter a login modal or startup gate. The site opens directly into the portfolio.

### 2. High-Contrast Dark & Electric-Blue Palette
- Main Background: `#050608`
- Secondary Background: `#0A0D12`
- Card Background: `#10151D`
- Primary Text: `#F5F7FA`
- Secondary Text: `#929CAA`
- Electric Blue Accent: `#1685FF`
- Bright Blue Highlight: `#55B5FF`

### 3. Factual & Authentic Content Policy
- **No fake statistics, progress bars, or percentages.**
- Explicit distinction between demonstrated practical experience (lab operations, troubleshooting, live builds) and active learning.
- Authentic project case studies:
  - **Muhammed PP Portfolio** (Live Next.js/PostgreSQL web platform)
  - **DIGIHUB IT Administration** (Practical lab operations & networking support)
  - **Palabra / Sibaq Palabra** (Interactive Spanish vocabulary learning tool)
  - **Browser Football Game** (Experimental 3D simulation mechanics)
- Tasteful empty state for milestones (*"Every project is another step forward."*) until genuine certificates are added.

### 4. Portrait Frame with Real Photo Support
- Includes an art-directed tech placeholder with monogram `MPP`.
- Real photo can be uploaded in one click through the **Admin Panel** (`/admin`), or saved to `/public/images/muhammed-pp.jpg`.
- Preserves natural aspect ratio without altering identity or facial features.

### 5. Private Authenticated Admin Suite (`/admin`)
- Accessible via `/admin/login` or the unobtrusive shield icon in navigation/footer.
- **Overview**: Live database counts (published projects, total achievements, contact messages, unread count).
- **Projects Manager**: Create, edit, publish/unpublish, feature in spotlight, reorder, and delete projects.
- **Profile Manager**: Update name, headline, bio, location, education, contact email, and portrait photo.
- **Timeline Manager**: Add and manage milestones.
- **Achievements Manager**: Document verified certificates and college activities.
- **Contact Inbox**: Read incoming visitor messages, mark read/unread, delete spam.
- **Asset Uploader**: Directly upload images to `/public/uploads/` with instant URL generation.
- **Security**: Salted PBKDF2-SHA512 password verification and HttpOnly signed cookie sessions.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Authentication**: PBKDF2 + HMAC-SHA256 HttpOnly session cookies

---

## Getting Started

### 1. Environment Variables
Create a `.env` file in the project root:
```bash
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db
ADMIN_PASSWORD=mpp_admin_2026!
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Database Migrations & Seed
```bash
npx drizzle-kit push
```

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the public portfolio.  
Access the admin portal at [http://localhost:3000/admin](http://localhost:3000/admin).

---

## Default Admin Credentials

- **Route**: `/admin/login`
- **Default Password**: `mpp_admin_2026!`
- *Can be updated immediately in the Admin Dashboard under the "Security" tab or overridden via `ADMIN_PASSWORD` env variable.*

---

## Deployment to Vercel

1. Push code to your GitHub repository (`muhammedpp807-lang/muhammed-pp`).
2. Import project into [Vercel](https://vercel.com).
3. Connect a PostgreSQL database (e.g. Vercel Postgres, Neon, or Supabase).
4. Set the environment variables in Vercel project settings:
   - `DATABASE_URL`
   - `ADMIN_PASSWORD`
5. Deploy. Drizzle schema will be applied, and initial seeded data automatically synchronizes on first load.
