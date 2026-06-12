import { NextResponse } from "next/server";
import { ZodError } from "zod";
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
