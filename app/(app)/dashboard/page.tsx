import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  Eye,
  MousePointerClick,
  Megaphone,
  Plus,
  Sparkles,
  Wallet,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { ensureMetrics, campaignTotals } from "@/lib/metrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/stat-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { PlatformBadge } from "@/components/shared/platform-badge";
import { formatCompact, formatINR, formatDate } from "@/lib/utils";
import { goalLabel } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = (await getCurrentUser())!;

  const campaigns = await prisma.campaign.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  // Refresh simulated metrics, then aggregate
  const enriched = await Promise.all(
    campaigns.map(async (c) => {
      const status = await ensureMetrics(c);
      const totals = await campaignTotals(c.id);
      return { ...c, status, totals };
    })
  );

  const impressions = enriched.reduce((s, c) => s + c.totals.impressions, 0);
  const clicks = enriched.reduce((s, c) => s + c.totals.clicks, 0);
  const views = enriched.reduce((s, c) => s + c.totals.views, 0);
  const spend = enriched.reduce((s, c) => s + c.totals.spend, 0);
  const liveCount = enriched.filter((c) => c.status === "LIVE").length;

  const bookingsCount = await prisma.booking.count({
    where: { userId: user.id, status: { notIn: ["CANCELLED", "REJECTED"] } },
  });

  const recent = enriched.slice(0, 4);
  const firstName = user.name.split(" ")[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Welcome back, {firstName} 👋</h2>
          <p className="text-muted-foreground">Here&apos;s how your music is performing.</p>
        </div>
        <Button variant="gradient" asChild>
          <Link href="/dashboard/campaigns/new">
            <Plus className="size-4" /> New campaign
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total impressions" value={formatCompact(impressions)} icon={Eye} hint={`${liveCount} campaign(s) live`} />
        <StatCard label="Total clicks" value={formatCompact(clicks)} icon={MousePointerClick} accent="text-cyan-400" />
        <StatCard label="Streams / views" value={formatCompact(views)} icon={Activity} accent="text-emerald-400" />
        <StatCard label="Total ad spend" value={formatINR(spend)} icon={Wallet} accent="text-amber-400" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-white/10 lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Recent campaigns</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/campaigns">
                View all <ArrowUpRight className="size-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recent.length === 0 ? (
              <EmptyState
                icon={Megaphone}
                title="No campaigns yet"
                description="Launch your first promotion and start reaching new listeners across Google & Meta."
                actionLabel="Create a campaign"
                actionHref="/dashboard/campaigns/new"
              />
            ) : (
              <div className="space-y-3">
                {recent.map((c) => (
                  <Link
                    key={c.id}
                    href={`/dashboard/campaigns/${c.id}`}
                    className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-background/40 p-4 transition-colors hover:border-fuchsia-500/30"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-medium">{c.songName}</p>
                        <StatusBadge status={c.status} />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {goalLabel(c.goal)} · {formatDate(c.createdAt)}
                      </p>
                    </div>
                    <div className="hidden text-right sm:block">
                      <p className="text-sm font-medium">{formatCompact(c.totals.impressions)}</p>
                      <p className="text-xs text-muted-foreground">impressions</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-white/10">
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/dashboard/campaigns/new"
              className="flex items-center gap-3 rounded-xl border border-white/5 bg-background/40 p-4 transition-colors hover:border-fuchsia-500/30"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-fuchsia-500/15 text-fuchsia-400">
                <Megaphone className="size-5" />
              </div>
              <div>
                <p className="text-sm font-medium">Promote a song</p>
                <p className="text-xs text-muted-foreground">Google &amp; Meta ads</p>
              </div>
            </Link>
            <Link
              href="/influencers"
              className="flex items-center gap-3 rounded-xl border border-white/5 bg-background/40 p-4 transition-colors hover:border-fuchsia-500/30"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-violet-500/15 text-violet-400">
                <Sparkles className="size-5" />
              </div>
              <div>
                <p className="text-sm font-medium">Hire an influencer</p>
                <p className="text-xs text-muted-foreground">{bookingsCount} active hire(s)</p>
              </div>
            </Link>
            <div className="rounded-xl border border-white/5 bg-background/40 p-4">
              <p className="text-xs text-muted-foreground">Connected ad platforms</p>
              <div className="mt-2 flex gap-2">
                <PlatformBadge platform="YOUTUBE" />
                <PlatformBadge platform="INSTAGRAM" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
