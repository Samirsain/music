"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api-client";

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    try {
      const user = await api<{ role: string }>("/api/auth/login", {
        method: "POST",
        json: {
          email: form.get("email"),
          password: form.get("password"),
        },
      });
      toast.success("Logged in successfully");
      router.push(user.role === "ADMIN" ? "/admin" : "/dashboard");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="you@example.com" required autoComplete="email" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" placeholder="••••••••" required autoComplete="current-password" />
      </div>
      <Button type="submit" variant="default" className="w-full" disabled={loading}>
        {loading && <Loader2 className="size-4 animate-spin" />}
        Log in
      </Button>

      <div className="rounded-lg border border-border bg-muted/50 p-3 text-xs text-muted-foreground">
        <p className="font-medium text-foreground">Demo accounts</p>
        <p className="mt-1">Artist — demo@artist.com / Demo@123</p>
        <p>Admin — admin@amplitune.in / Admin@123</p>
      </div>
    </form>
  );
}
