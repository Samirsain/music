"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pause, Play, CreditCard, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn, formatINR } from "@/lib/utils";
import { api } from "@/lib/api-client";

export function PayCampaignButton({
  campaignId,
  amount,
}: {
  campaignId: string;
  amount: number;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [method, setMethod] = useState<"UPI" | "CARD" | "NETBANKING">("UPI");
  const [loading, setLoading] = useState(false);

  async function pay() {
    setLoading(true);
    try {
      await api(`/api/campaigns/${campaignId}/pay`, { method: "POST", json: { method } });
      toast.success("Payment successful! Campaign is now in review.");
      setOpen(false);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Payment failed");
      setLoading(false);
    }
  }

  return (
    <>
      <Button variant="gradient" onClick={() => setOpen(true)}>
        <CreditCard className="size-4" /> Pay {formatINR(amount)}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete payment</DialogTitle>
            <DialogDescription>
              Pay {formatINR(amount)} to send this campaign for review and launch.
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
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="gradient" onClick={pay} disabled={loading}>
              {loading && <Loader2 className="size-4 animate-spin" />}
              Pay {formatINR(amount)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function CampaignStatusActions({
  campaignId,
  status,
}: {
  campaignId: string;
  status: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function update(newStatus: string) {
    setLoading(true);
    try {
      await api(`/api/campaigns/${campaignId}`, { method: "PATCH", json: { status: newStatus } });
      toast.success(newStatus === "PAUSED" ? "Campaign paused" : "Campaign resumed");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update");
      setLoading(false);
    }
  }

  if (status === "LIVE") {
    return (
      <Button variant="outline" onClick={() => update("PAUSED")} disabled={loading}>
        {loading ? <Loader2 className="size-4 animate-spin" /> : <Pause className="size-4" />}
        Pause
      </Button>
    );
  }
  if (status === "PAUSED") {
    return (
      <Button variant="outline" onClick={() => update("LIVE")} disabled={loading}>
        {loading ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4" />}
        Resume
      </Button>
    );
  }
  return null;
}

export function RenewButton({ goal }: { goal?: string }) {
  void goal;
  const router = useRouter();
  return (
    <Button variant="gradient" onClick={() => router.push("/dashboard/campaigns/new")}>
      <RefreshCw className="size-4" /> Renew campaign
    </Button>
  );
}
