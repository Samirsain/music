"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api-client";
import { GENRES } from "@/lib/constants";

export function SignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [genre, setGenre] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    try {
      await api("/api/auth/signup", {
        method: "POST",
        json: {
          name: form.get("name"),
          artistName: form.get("artistName"),
          email: form.get("email"),
          password: form.get("password"),
          phone: form.get("phone"),
          genre,
        },
      });
      toast.success("Account created! Welcome to AmpliTune 🎉");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Signup failed");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" placeholder="Arjun Mehta" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="artistName">Artist name</Label>
          <Input id="artistName" name="artistName" placeholder="Arjun M" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="you@example.com" required autoComplete="email" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone (WhatsApp)</Label>
          <Input id="phone" name="phone" placeholder="+91 98765 43210" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="genre">Primary genre</Label>
          <Select value={genre} onValueChange={setGenre}>
            <SelectTrigger id="genre" className="w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {GENRES.map((g) => (
                <SelectItem key={g} value={g}>
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" placeholder="At least 6 characters" required autoComplete="new-password" />
      </div>
      <Button type="submit" variant="gradient" className="w-full" disabled={loading}>
        {loading && <Loader2 className="size-4 animate-spin" />}
        Create account
      </Button>
    </form>
  );
}
