import Link from "next/link";
import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <AuthCard title="Welcome back" description="Log in to manage your music campaigns">
      <LoginForm />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to AmpliTune?{" "}
        <Link href="/signup" className="font-medium text-fuchsia-400 hover:underline">
          Create an account
        </Link>
      </p>
    </AuthCard>
  );
}
