import Link from "next/link";
import { Megaphone, Plus } from "lucide-react";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { ensureMetrics, campaignTotals } from "@/lib/metrics";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { PlatformBadge } from "@/components/shared/platform-badge";
import { formatCompact, formatINR, formatDate } from "@/lib/utils";
import { goalLabel } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function CampaignsPage() {
  const user = (await getCurrentUser())!;
  const rows = await prisma.campaign.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const campaigns = await Promise.all(
    rows.map(async (c) => {
      const status = await ensureMetrics(c);
      const totals = await campaignTotals(c.id);
      return { ...c, status, totals };
    })
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your campaigns</h2>
          <p className="text-muted-foreground">All your music promotions in one place.</p>
        </div>
        <Button variant="gradient" asChild>
          <Link href="/dashboard/campaigns/new">
            <Plus className="size-4" /> New campaign
          </Link>
        </Button>
      </div>

      {campaigns.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="No campaigns yet"
          description="Create your first campaign to start promoting your music across Google and Meta."
          actionLabel="Create a campaign"
          actionHref="/dashboard/campaigns/new"
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {campaigns.map((c) => {
            const pct =
              c.status === "PENDING_PAYMENT" || c.status === "IN_REVIEW"
                ? 0
                : Math.min(100, Math.round((c.totals.spend / c.totalBudget) * 100));
            return (
              <Link key={c.id} href={`/dashboard/campaigns/${c.id}`}>
                <Card className="h-full gap-0 border-white/10 p-5 transition-all hover:border-fuchsia-500/40 hover:shadow-lg hover:shadow-fuchsia-950/20">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold">{c.songName}</h3>
                      <p className="text-sm text-muted-foreground">{goalLabel(c.goal)}</p>
                    </div>
                    <StatusBadge status={c.status} />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {c.adPlatforms.split(",").map((p) => (
                      <PlatformBadge key={p} platform={p === "GOOGLE" ? "YOUTUBE" : "INSTAGRAM"} />
                    ))}
                    <span className="rounded-md bg-white/5 px-1.5 py-0.5 text-xs text-muted-foreground">
                      {c.durationDays} days
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/5 pt-4 text-center">
                    <div>
                      <p className="text-sm font-semibold">{formatCompact(c.totals.impressions)}</p>
                      <p className="text-xs text-muted-foreground">Impressions</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{formatCompact(c.totals.clicks)}</p>
                      <p className="text-xs text-muted-foreground">Clicks</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{formatINR(c.totalAmount)}</p>
                      <p className="text-xs text-muted-foreground">Budget</p>
                    </div>
                  </div>

                  {(c.status === "LIVE" || c.status === "COMPLETED" || c.status === "PAUSED") && (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Spent {formatINR(c.totals.spend)}</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <p className="mt-4 text-xs text-muted-foreground">Created {formatDate(c.createdAt)}</p>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
