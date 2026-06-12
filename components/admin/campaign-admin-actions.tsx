"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Pause, Play, X, CheckCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-client";

export function CampaignAdminActions({
  campaignId,
  status,
}: {
  campaignId: string;
  status: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function update(newStatus: string, label: string) {
    setLoading(newStatus);
    try {
      await api(`/api/admin/campaigns/${campaignId}`, {
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

  return (
    <div className="flex flex-wrap justify-end gap-2">
      {status === "IN_REVIEW" && (
        <>
          <Button size="sm" variant="default" onClick={() => update("LIVE", "Campaign launched")} disabled={!!loading}>
            {busy("LIVE") ? <Loader2 className="size-3.5 animate-spin" /> : <Play className="size-3.5" />}
            Launch
          </Button>
          <Button size="sm" variant="ghost" onClick={() => update("CANCELLED", "Campaign cancelled")} disabled={!!loading}>
            {busy("CANCELLED") ? <Loader2 className="size-3.5 animate-spin" /> : <X className="size-3.5" />}
            Reject
          </Button>
        </>
      )}
      {status === "LIVE" && (
        <>
          <Button size="sm" variant="outline" onClick={() => update("PAUSED", "Campaign paused")} disabled={!!loading}>
            {busy("PAUSED") ? <Loader2 className="size-3.5 animate-spin" /> : <Pause className="size-3.5" />}
            Pause
          </Button>
          <Button size="sm" variant="ghost" onClick={() => update("COMPLETED", "Marked completed")} disabled={!!loading}>
            {busy("COMPLETED") ? <Loader2 className="size-3.5 animate-spin" /> : <CheckCheck className="size-3.5" />}
            Complete
          </Button>
        </>
      )}
      {status === "PAUSED" && (
        <>
          <Button size="sm" variant="default" onClick={() => update("LIVE", "Campaign resumed")} disabled={!!loading}>
            {busy("LIVE") ? <Loader2 className="size-3.5 animate-spin" /> : <Play className="size-3.5" />}
            Resume
          </Button>
          <Button size="sm" variant="ghost" onClick={() => update("COMPLETED", "Marked completed")} disabled={!!loading}>
            {busy("COMPLETED") ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
            Complete
          </Button>
        </>
      )}
    </div>
  );
}
