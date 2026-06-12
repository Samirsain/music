# AmpliTune — Music Promotion Platform

A fully working music promotion platform built for independent Indian artists, labels and
creators. Artists run **Google Ads & Meta Ads** campaigns through a simple guided flow, and
hire **music influencers** (by category, with transparent per-service charges) to amplify
their releases — all from one dashboard.

Built from the *Music Promotion Platform Proposal* by Zenviq Digital.

> **Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
> shadcn/ui (Radix) · Framer Motion · Prisma + SQLite · JWT auth (jose) · Recharts

---

## ✨ What's included

### For artists (client-facing)
- **Landing page** — animated hero, problem/solution, 10-step "how it works", features,
  roadmap and influencer marketplace teaser (Framer Motion throughout).
- **Auth** — email/password signup & login with secure httpOnly JWT sessions.
- **Guided campaign builder** — a 5-step wizard (song details → goal → budget slider →
  audience targeting → review & pay). You pick an *outcome* (more streams, views, followers,
  reach, event promo); the platform maps it to the right Google/Meta objective.
- **Mock Razorpay checkout** — UPI / card / net-banking (demo mode, no real charge).
- **Live dashboard** — impressions, clicks, streams/views and spend with a Recharts area
  chart. Metrics are simulated deterministically per-day until the real ad APIs land (Phase 2).
- **Campaign controls** — pause / resume / renew, budget pacing, payment record.
- **Influencer marketplace** — browse/search/filter creators by category, platform and price;
  view profiles and **hire** a specific service.
- **Influencer hires** — track requests, pay to confirm, cancel pending ones.
- **Profile** settings.

### For the platform owner (admin)
- **Revenue & activity overview** — total revenue, campaigns, clients, pending queues.
- **Campaign management** — review & launch, pause/resume, complete, filter by status.
- **Influencer management** — **add / edit / remove influencers**, set their **category** and
  define **services with charges & delivery times**.
- **Hire management** — accept / reject / complete collaboration requests.
- **Clients** — every artist with their campaign count, hires and total spend.

### Notifications
WhatsApp / email sends are stubbed (`lib/notifications.ts`) and logged to the server console —
swap in Twilio / Interakt for production (Phase 2).

---

## 🚀 Getting started

```bash
npm install
npm run dev   # auto-creates .env + SQLite db + demo data on first run
```

Open <http://localhost:3000>. (You can also run `npm run setup` manually.)

### Demo accounts (created by the seed)

| Role   | Email                  | Password    |
| ------ | ---------------------- | ----------- |
| Artist | `demo@artist.com`      | `Demo@123`  |
| Admin  | `admin@amplitune.in`   | `Admin@123` |

The artist account comes preloaded with live / completed / in-review campaigns (with chart
data) and a few influencer hires so every screen has realistic content.

---

## ▲ Deploy to Vercel

SQLite doesn't work on Vercel (the serverless filesystem is read-only/ephemeral), so
production needs **Postgres**. The build is self-provisioning: when it sees a Postgres
`DATABASE_URL`, it automatically switches Prisma to Postgres, creates the tables, and seeds
demo data (only if the database is empty). You just supply two environment variables.

**1. Add a Postgres database**
   - Easiest: in your Vercel project → **Storage** tab → **Create Database** → *Neon
     (Postgres)* → connect it to the project. This adds `DATABASE_URL` automatically.
   - Or create a free [Supabase](https://supabase.com) / [Neon](https://neon.tech) project
     yourself and add its connection string as the `DATABASE_URL` env var
     (Project → Settings → Environment Variables).

**2. Add `AUTH_SECRET`** (same place) — a long random string, e.g. from `openssl rand -hex 32`.

**3. Redeploy.** The build runs `scripts/deploy-db.mjs` → schema pushed → demo data seeded →
every page works, with the same demo logins as local.

| Env var        | Value                                              |
| -------------- | -------------------------------------------------- |
| `DATABASE_URL` | Postgres connection string (Neon/Supabase)         |
| `AUTH_SECRET`  | Long random string (`openssl rand -hex 32`)        |

Local dev keeps using SQLite untouched. (`npm run use:postgres` / `use:sqlite` switch the
committed provider manually if you ever need to.)

---

## 📜 Scripts

| Script            | Purpose                                          |
| ----------------- | ------------------------------------------------ |
| `npm run dev`     | Start the dev server                             |
| `npm run build`   | Production build                                 |
| `npm run start`   | Run the production build                         |
| `npm run lint`    | ESLint                                           |
| `npm run setup`   | Create `.env`, push schema, seed (auto-runs before `dev`) |
| `npm run db:push` | Apply the Prisma schema to the database          |
| `npm run db:seed` | Re-seed demo data                                |
| `npm run use:postgres` | Switch Prisma provider to Postgres (for Vercel) |
| `npm run use:sqlite`   | Switch back to SQLite (local dev)               |

---

## 🗂 Project structure

```
app/
  (marketing)/        Landing page + influencer marketplace (public)
  (auth)/             Login & signup
  (app)/
    dashboard/        Artist dashboard, campaigns, wizard, hires, profile
    admin/            Admin panel (campaigns, hires, influencers, clients)
  api/                Route handlers (auth, campaigns, bookings, influencers, admin)
components/
  ui/                 shadcn/ui primitives (Radix-based)
  site/  shared/  dashboard/  campaigns/  influencers/  bookings/  admin/  auth/
lib/
  db.ts  auth.ts  validators.ts  metrics.ts  api.ts  constants.ts  utils.ts
prisma/
  schema.prisma  seed.ts
```

---

## 🔌 Mapping to the proposal's tech stack

The proposal targets Supabase / Razorpay / Google Ads API / Meta Marketing API. This build is
a **fully working Phase-1 platform** with those external services cleanly stubbed so it runs
anywhere with zero credentials:

| Proposal               | This build                              | Production swap                         |
| ---------------------- | --------------------------------------- | --------------------------------------- |
| Supabase (PostgreSQL)  | Prisma + SQLite                         | Point `datasource` at Postgres/Supabase |
| Supabase Auth          | JWT sessions (`jose`) + bcrypt          | Supabase Auth / OAuth                   |
| Razorpay               | Mock gateway (`mockGatewayReference`)   | Razorpay Orders + signature verify      |
| Google / Meta Ads APIs | Deterministic metric simulator         | Real campaign creation + metric pulls   |
| Twilio / Interakt      | Console-logged stubs                    | WhatsApp Business API                   |
| Cloudinary             | URL fields for cover art / images       | Cloudinary upload widget                |

Everything is structured so each stub is a single module to replace.
