"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, X, CheckCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-client";

export function BookingAdminActions({
  bookingId,
  status,
}: {
  bookingId: string;
  status: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function update(newStatus: string, label: string) {
    setLoading(newStatus);
    try {
      await api(`/api/admin/bookings/${bookingId}`, {
        method: "PATCH",
        json: { status: newStatus },
      });
      toast.success(label);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update");
    } finally {
      setLoading(null);
    }
  }

  const busy = (s: string) => loading === s;

  if (status === "PENDING") {
    return (
      <div className="flex flex-wrap justify-end gap-2">
        <Button size="sm" variant="default" onClick={() => update("ACCEPTED", "Request accepted")} disabled={!!loading}>
          {busy("ACCEPTED") ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
          Accept
        </Button>
        <Button size="sm" variant="ghost" onClick={() => update("REJECTED", "Request rejected")} disabled={!!loading}>
          {busy("REJECTED") ? <Loader2 className="size-3.5 animate-spin" /> : <X className="size-3.5" />}
          Reject
        </Button>
      </div>
    );
  }
  if (status === "ACCEPTED") {
    return (
      <div className="flex justify-end">
        <Button size="sm" variant="outline" onClick={() => update("COMPLETED", "Marked completed")} disabled={!!loading}>
          {busy("COMPLETED") ? <Loader2 className="size-3.5 animate-spin" /> : <CheckCheck className="size-3.5" />}
          Mark done
        </Button>
      </div>
    );
  }
  return null;
}
