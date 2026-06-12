import { execSync } from "node:child_process";

// Runs before `next build`. On Vercel (or any host) with a Postgres
// DATABASE_URL, it provisions the database automatically:
//   1. switches the Prisma provider to postgresql (build env only)
//   2. pushes the schema (idempotent)
//   3. seeds demo data — but only if the database is empty
// With a local SQLite URL (or none) it exits instantly, so `npm run build`
// behaves exactly as before on dev machines.

const url = process.env.DATABASE_URL ?? "";

if (!url.startsWith("postgres")) {
  console.log("[deploy-db] No Postgres DATABASE_URL — skipping (local build).");
  process.exit(0);
}

console.log("[deploy-db] Postgres detected — provisioning database…");
execSync("node scripts/db-provider.mjs postgresql", { stdio: "inherit" });

// Schema changes shouldn't go through PgBouncer — use Neon's direct endpoint
// (same host without "-pooler") for push/seed; runtime keeps the pooled URL.
const directUrl = url.replace("-pooler.", ".");
const env = { ...process.env, DATABASE_URL: directUrl };
execSync("npx prisma db push", { stdio: "inherit", env });

const { PrismaClient } = await import("@prisma/client");
const prisma = new PrismaClient({ datasources: { db: { url: directUrl } } });
try {
  const users = await prisma.user.count();
  if (users === 0) {
    console.log("[deploy-db] Empty database — seeding demo data…");
    execSync("npx prisma db seed", { stdio: "inherit", env });
  } else {
    console.log(`[deploy-db] Database already has ${users} user(s) — skipping seed.`);
  }
} finally {
  await prisma.$disconnect();
}
console.log("[deploy-db] Database ready.");
