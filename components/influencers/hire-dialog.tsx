"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlatformBadge } from "@/components/shared/platform-badge";
import { api } from "@/lib/api-client";
import { formatINR } from "@/lib/utils";
import type { InfluencerService } from "@/lib/types";

export function HireDialog({
  open,
  onOpenChange,
  influencerId,
  influencerName,
  service,
  isLoggedIn,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  influencerId: string;
  influencerName: string;
  service: InfluencerService | null;
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!service) return null;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!service) return;
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    setLoading(true);
    const form = new FormData(e.currentTarget);
    try {
      const booking = await api<{ id: string }>("/api/bookings", {
        method: "POST",
        json: {
          influencerId,
          serviceId: service.id,
          songName: form.get("songName"),
          trackUrl: form.get("trackUrl"),
          message: form.get("message"),
          preferredDate: form.get("preferredDate"),
        },
      });
      toast.success("Request sent! Complete payment to confirm.");
      onOpenChange(false);
      router.push(`/dashboard/bookings?pay=${booking.id}`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create booking");
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hire {influencerName}</DialogTitle>
          <DialogDescription>
            Tell them about your track. You&apos;ll pay after submitting to confirm the request.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PlatformBadge platform={service.platform} />
              <span className="text-sm font-medium">{service.title}</span>
            </div>
            <span className="font-semibold text-gradient">{formatINR(service.price)}</span>
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Delivery in ~{service.deliveryDays} days
          </p>
        </div>

        {isLoggedIn ? (
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="songName">Song name</Label>
              <Input id="songName" name="songName" placeholder="Raat Ki Baat" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trackUrl">Track link (Spotify / YouTube)</Label>
              <Input id="trackUrl" name="trackUrl" type="url" placeholder="https://open.spotify.com/track/…" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferredDate">Preferred date (optional)</Label>
              <Input id="preferredDate" name="preferredDate" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message (optional)</Label>
              <Textarea id="message" name="message" rows={3} placeholder="Anything they should know about your release…" />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="gradient" disabled={loading}>
                {loading && <Loader2 className="size-4 animate-spin" />}
                Send request · {formatINR(service.price)}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You need an account to hire an influencer. It only takes a few seconds.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => router.push("/login")}>
                Log in
              </Button>
              <Button variant="gradient" onClick={() => router.push("/signup")}>
                Create account
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
