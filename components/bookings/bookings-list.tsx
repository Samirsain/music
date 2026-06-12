"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Clock, X } from "lucide-react";
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
import { Card } from "@/components/ui/card";
import { GradientAvatar } from "@/components/shared/gradient-avatar";
import { PlatformBadge } from "@/components/shared/platform-badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { cn, formatINR, formatDate } from "@/lib/utils";
import { api } from "@/lib/api-client";
import type { Booking } from "@/lib/types";

export function BookingsList({ initial }: { initial: Booking[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const payId = searchParams.get("pay");
  const [bookings, setBookings] = useState(initial);
  // Open the pay dialog immediately if redirected from a fresh hire (?pay=<id>)
  const [payTarget, setPayTarget] = useState<Booking | null>(() => {
    if (!payId) return null;
    const target = initial.find((b) => b.id === payId && b.paymentStatus === "UNPAID");
    return target ?? null;
  });
  const [method, setMethod] = useState<"UPI" | "CARD" | "NETBANKING">("UPI");
  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState<string | null>(null);

  // Drop the ?pay= query param from the URL once consumed
  useEffect(() => {
    if (payId) router.replace("/dashboard/bookings");
  }, [payId, router]);

  async function pay() {
    if (!payTarget) return;
    setLoading(true);
    try {
      await api(`/api/bookings/${payTarget.id}/pay`, { method: "POST", json: { method } });
      toast.success("Payment successful! The influencer has been notified.");
      setBookings((prev) =>
        prev.map((b) => (b.id === payTarget.id ? { ...b, paymentStatus: "PAID" } : b))
      );
      setPayTarget(null);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setLoading(false);
    }
  }

  async function cancel(id: string) {
    setCancelling(id);
    try {
      await api(`/api/bookings/${id}`, { method: "PATCH", json: { status: "CANCELLED" } });
      toast.success("Request cancelled");
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "CANCELLED" } : b))
      );
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not cancel");
    } finally {
      setCancelling(null);
    }
  }

  return (
    <>
      <div className="space-y-4">
        {bookings.map((b) => (
          <Card key={b.id} className="gap-0 border-white/10 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex gap-4">
                <GradientAvatar
                  name={b.influencer?.name ?? "?"}
                  imageUrl={b.influencer?.imageUrl}
                  className="size-12"
                />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{b.influencer?.name}</h3>
                    <StatusBadge status={b.status} />
                    {b.paymentStatus === "PAID" && <StatusBadge status="PAID" />}
                    {b.paymentStatus === "REFUNDED" && <StatusBadge status="REFUNDED" />}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{b.influencer?.handle}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <PlatformBadge platform={b.servicePlatform} />
                    <span className="text-sm">{b.serviceTitle}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    For <span className="text-foreground">{b.songName}</span> · requested {formatDate(b.createdAt)}
                  </p>
                  {b.message && (
                    <p className="mt-2 rounded-lg bg-white/[0.03] p-2 text-xs text-muted-foreground">
                      “{b.message}”
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className="text-lg font-bold text-gradient">{formatINR(b.amount)}</span>
                <div className="flex gap-2">
                  {b.paymentStatus === "UNPAID" &&
                    b.status !== "CANCELLED" &&
                    b.status !== "REJECTED" && (
                      <Button size="sm" variant="gradient" onClick={() => setPayTarget(b)}>
                        Pay now
                      </Button>
                    )}
                  {b.status === "PENDING" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => cancel(b.id)}
                      disabled={cancelling === b.id}
                    >
                      {cancelling === b.id ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <X className="size-3.5" />
                      )}
                      Cancel
                    </Button>
                  )}
                </div>
                {b.paymentStatus === "UNPAID" &&
                  b.status !== "CANCELLED" &&
                  b.status !== "REJECTED" && (
                    <span className="flex items-center gap-1 text-xs text-amber-400">
                      <Clock className="size-3" /> Payment pending
                    </span>
                  )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={!!payTarget} onOpenChange={(v) => !v && setPayTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm &amp; pay</DialogTitle>
            <DialogDescription>
              Pay {payTarget && formatINR(payTarget.amount)} to confirm your collab with{" "}
              {payTarget?.influencer?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-2">
            {(["UPI", "CARD", "NETBANKING"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMethod(m)}
                className={cn(
                  "rounded-xl border p-3 text-center text-sm font-medium transition-colors",
                  method === m ? "border-fuchsia-500 bg-fuchsia-500/10" : "border-white/10 hover:border-white/20"
                )}
              >
                {m === "NETBANKING" ? "Net Banking" : m === "CARD" ? "Card" : "UPI"}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Secured by Razorpay (demo mode — no real charge is made).
          </p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setPayTarget(null)}>
              Cancel
            </Button>
            <Button variant="gradient" onClick={pay} disabled={loading}>
              {loading && <Loader2 className="size-4 animate-spin" />}
              Pay {payTarget && formatINR(payTarget.amount)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
