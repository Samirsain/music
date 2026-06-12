"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GradientAvatar } from "@/components/shared/gradient-avatar";
import { PlatformBadge } from "@/components/shared/platform-badge";
import { InfluencerForm } from "@/components/admin/influencer-form";
import { formatCompact, formatINR } from "@/lib/utils";
import { api } from "@/lib/api-client";
import type { Influencer, InfluencerService } from "@/lib/types";

type FullInfluencer = Influencer & { services?: InfluencerService[] };

export function InfluencerManager({ initial }: { initial: FullInfluencer[] }) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<FullInfluencer | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FullInfluencer | null>(null);
  const [deleting, setDeleting] = useState(false);

  function add() {
    setEditing(null);
    setFormOpen(true);
  }

  function edit(inf: FullInfluencer) {
    setEditing(inf);
    setFormOpen(true);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await api<{ deleted?: boolean; deactivated?: boolean }>(
        `/api/admin/influencers/${deleteTarget.id}`,
        { method: "DELETE" }
      );
      toast.success(res.deactivated ? "Influencer deactivated (had bookings)" : "Influencer removed");
      setDeleteTarget(null);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Manage influencers</h2>
          <p className="text-muted-foreground">Add creators, set their categories and charges.</p>
        </div>
        <Button variant="default" onClick={add}>
          <Plus className="size-4" /> Add influencer
        </Button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {initial.map((inf) => (
          <Card key={inf.id} className="gap-0 border-border p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex gap-3">
                <GradientAvatar name={inf.name} imageUrl={inf.imageUrl} className="size-12" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{inf.name}</h3>
                    {inf.featured && <BadgeCheck className="size-4 text-primary" />}
                    {!inf.active && <Badge variant="muted">Hidden</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{inf.handle}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="secondary">{inf.category}</Badge>
                    <span className="text-xs text-muted-foreground">{formatCompact(inf.followers)} followers</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" onClick={() => edit(inf)}>
                  <Pencil className="size-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => setDeleteTarget(inf)}>
                  <Trash2 className="size-4 text-rose-600" />
                </Button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {inf.platforms.map((p) => (
                <PlatformBadge key={p} platform={p} iconOnly />
              ))}
            </div>

            <div className="mt-4 space-y-1.5 border-t border-border pt-4">
              {(inf.services ?? []).map((s) => (
                <div key={s.id} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <PlatformBadge platform={s.platform} iconOnly />
                    {s.title}
                  </span>
                  <span className="font-medium">{formatINR(s.price)}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <InfluencerForm
        open={formOpen}
        onOpenChange={setFormOpen}
        influencer={editing}
        onSaved={() => router.refresh()}
      />

      <Dialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove {deleteTarget?.name}?</DialogTitle>
            <DialogDescription>
              This hides the influencer from the marketplace. If they have past bookings, their
              record is kept but deactivated.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
              {deleting && <Loader2 className="size-4 animate-spin" />}
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
