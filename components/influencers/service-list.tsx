"use client";

import { useState } from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlatformBadge } from "@/components/shared/platform-badge";
import { HireDialog } from "@/components/influencers/hire-dialog";
import { formatINR } from "@/lib/utils";
import type { InfluencerService } from "@/lib/types";

export function ServiceList({
  influencerId,
  influencerName,
  services,
  isLoggedIn,
}: {
  influencerId: string;
  influencerName: string;
  services: InfluencerService[];
  isLoggedIn: boolean;
}) {
  const [selected, setSelected] = useState<InfluencerService | null>(null);
  const [open, setOpen] = useState(false);

  function hire(service: InfluencerService) {
    setSelected(service);
    setOpen(true);
  }

  return (
    <>
      <div className="space-y-3">
        {services.map((s) => (
          <div
            key={s.id}
            className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/30 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <PlatformBadge platform={s.platform} />
                <h3 className="font-semibold">{s.title}</h3>
              </div>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.description}</p>
              <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="size-3.5" /> Delivery in ~{s.deliveryDays} days
              </p>
            </div>
            <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
              <div className="text-right">
                <div className="text-lg font-semibold text-primary">{formatINR(s.price)}</div>
              </div>
              <Button variant="default" onClick={() => hire(s)}>
                Hire now
              </Button>
            </div>
          </div>
        ))}
      </div>

      <HireDialog
        open={open}
        onOpenChange={setOpen}
        influencerId={influencerId}
        influencerName={influencerName}
        service={selected}
        isLoggedIn={isLoggedIn}
      />
    </>
  );
}
