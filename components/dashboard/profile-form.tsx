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

type Props = {
  user: {
    name: string;
    artistName: string | null;
    email: string;
    phone: string | null;
    genre: string | null;
  };
};

export function ProfileForm({ user }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [genre, setGenre] = useState(user.genre ?? "");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    try {
      await api("/api/auth/me", {
        method: "PATCH",
        json: {
          name: form.get("name"),
          artistName: form.get("artistName"),
          phone: form.get("phone"),
          genre,
        },
      });
      toast.success("Profile updated");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" defaultValue={user.name} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="artistName">Artist name</Label>
          <Input id="artistName" name="artistName" defaultValue={user.artistName ?? ""} placeholder="Your stage name" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={user.email} disabled />
          <p className="text-xs text-muted-foreground">Email can&apos;t be changed.</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone (WhatsApp)</Label>
          <Input id="phone" name="phone" defaultValue={user.phone ?? ""} placeholder="+91 98765 43210" />
        </div>
      </div>
      <div className="space-y-2 sm:max-w-[calc(50%-0.5rem)]">
        <Label htmlFor="genre">Primary genre</Label>
        <Select value={genre} onValueChange={setGenre}>
          <SelectTrigger id="genre" className="w-full">
            <SelectValue placeholder="Select genre" />
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
      <Button type="submit" variant="gradient" disabled={loading}>
        {loading && <Loader2 className="size-4 animate-spin" />}
        Save changes
      </Button>
    </form>
  );
}
