import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";
import type { User } from "@prisma/client";

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) throw new ApiError("You must be logged in", 401);
  return user;
}

export async function requireAdmin(): Promise<User> {
  const user = await requireUser();
  if (user.role !== "ADMIN") throw new ApiError("Admin access required", 403);
  return user;
}

/** Wraps a route handler body with consistent error handling. */
export async function handle<T>(fn: () => Promise<T>): Promise<NextResponse> {
  try {
    const data = await fn();
    return NextResponse.json(data as object);
  } catch (err) {
    if (err instanceof ApiError) return jsonError(err.message, err.status);
    if (err instanceof ZodError) {
      const first = err.issues[0];
      return jsonError(first ? first.message : "Invalid input", 422);
    }
    if (err instanceof Prisma.PrismaClientInitializationError) {
      console.error("[db] not reachable:", err.message);
      return jsonError(
        "Database is not connected. On Vercel: add a Postgres DATABASE_URL (Storage → Create Database → Neon), then redeploy. Check /api/health for status.",
        503
      );
    }
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      (err.code === "P2021" || err.code === "P2022")
    ) {
      console.error("[db] schema missing:", err.message);
      return jsonError(
        "Database tables are missing. Redeploy so the build can create them (prisma db push). Check /api/health for status.",
        503
      );
    }
    console.error(err);
    return jsonError("Something went wrong. Please try again.", 500);
  }
}

/** Mock payment gateway — simulates a successful Razorpay charge. */
export function mockGatewayReference() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let s = "";
  for (let i = 0; i < 14; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `pay_${s}`;
}
