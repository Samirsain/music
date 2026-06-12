import { existsSync, copyFileSync, readFileSync } from "node:fs";
import { execSync } from "node:child_process";

// Idempotent local setup — safe to run on every `npm run dev`.
// Only touches SQLite dev databases; never auto-seeds a remote (Postgres) DB.

if (!existsSync(".env")) {
  copyFileSync(".env.example", ".env");
  console.log("[setup] Created .env from .env.example");
}

function readDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  try {
    const env = readFileSync(".env", "utf8");
    const match = env.match(/^DATABASE_URL\s*=\s*"?([^"\n]+)"?/m);
    return match ? match[1].trim() : "";
  } catch {
    return "";
  }
}

const dbUrl = readDatabaseUrl();
const isSqlite = dbUrl.startsWith("file:");

if (!isSqlite) {
  console.log("[setup] DATABASE_URL is not SQLite — skipping auto setup (run prisma db push/seed manually).");
  process.exit(0);
}

// DATABASE_URL is relative to prisma/ (e.g. file:./dev.db → prisma/dev.db)
const dbFile = `prisma/${dbUrl.replace("file:", "").replace(/^\.\//, "")}`;

if (existsSync(dbFile)) {
  process.exit(0); // already set up — keep `npm run dev` instant
}

console.log("[setup] No local database found — creating and seeding…");
execSync("npx prisma db push", { stdio: "inherit" });
execSync("npx prisma db seed", { stdio: "inherit" });
console.log("[setup] Done. Demo logins → demo@artist.com / Demo@123 · admin@amplitune.in / Admin@123");
