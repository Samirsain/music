import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * Neon's pooled connection strings (host contains "-pooler.") sit behind
 * PgBouncer in transaction mode — Prisma needs `pgbouncer=true` on the URL to
 * disable prepared statements. Append it automatically so the URL from the
 * Neon/Vercel dashboard works as-is.
 */
function databaseUrl(): string | undefined {
  const url = process.env.DATABASE_URL;
  if (!url) return undefined;
  if (url.includes("-pooler.") && !url.includes("pgbouncer=true")) {
    return url + (url.includes("?") ? "&" : "?") + "pgbouncer=true";
  }
  return url;
}

function createClient() {
  const url = databaseUrl();
  return url ? new PrismaClient({ datasources: { db: { url } } }) : new PrismaClient();
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
