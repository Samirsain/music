import { readFileSync, writeFileSync } from "node:fs";

// Flips the Prisma datasource provider between sqlite (local dev) and
// postgresql (Vercel/Supabase deploys). Usage:
//   npm run use:postgres
//   npm run use:sqlite

const target = process.argv[2];
if (target !== "sqlite" && target !== "postgresql") {
  console.error("Usage: node scripts/db-provider.mjs <sqlite|postgresql>");
  process.exit(1);
}

const path = "prisma/schema.prisma";
const schema = readFileSync(path, "utf8");
const updated = schema.replace(
  /provider = "(sqlite|postgresql)"/,
  `provider = "${target}"`
);
writeFileSync(path, updated);
console.log(`[db] Prisma datasource provider set to "${target}".`);
if (target === "postgresql") {
  console.log('[db] Set DATABASE_URL to your Postgres connection string, then run: npx prisma db push && npx prisma db seed');
} else {
  console.log("[db] Local SQLite restored — `npm run dev` will auto-create and seed it.");
}
