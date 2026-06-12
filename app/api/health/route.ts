import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Deployment diagnostic — open /api/health in the browser to see whether the
 * database is connected, migrated and seeded.
 */
export async function GET() {
  const hasDbUrl = !!process.env.DATABASE_URL;
  const dbKind = process.env.DATABASE_URL?.startsWith("postgres")
    ? "postgres"
    : process.env.DATABASE_URL?.startsWith("file:")
      ? "sqlite"
      : "unknown";

  try {
    const [users, influencers, campaigns] = await Promise.all([
      prisma.user.count(),
      prisma.influencer.count(),
      prisma.campaign.count(),
    ]);
    return NextResponse.json({
      ok: true,
      database: "connected",
      databaseKind: dbKind,
      seeded: users > 0,
      counts: { users, influencers, campaigns },
    });
  } catch (err) {
    let problem = "Unknown database error";
    let fix = "Check the server logs.";

    if (err instanceof Prisma.PrismaClientInitializationError) {
      problem = hasDbUrl
        ? "DATABASE_URL is set but the database is not reachable (or the URL/provider don't match)."
        : "DATABASE_URL environment variable is not set.";
      fix =
        "On Vercel: Storage → Create Database → Neon (Postgres) → connect to this project (adds DATABASE_URL automatically), also set AUTH_SECRET, then redeploy.";
    } else if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      (err.code === "P2021" || err.code === "P2022")
    ) {
      problem = "Connected, but the tables don't exist yet.";
      fix = "Redeploy — the build runs prisma db push + seed automatically when DATABASE_URL is Postgres.";
    }

    return NextResponse.json(
      {
        ok: false,
        database: "error",
        databaseKind: dbKind,
        hasDatabaseUrl: hasDbUrl,
        problem,
        fix,
      },
      { status: 503 }
    );
  }
}
