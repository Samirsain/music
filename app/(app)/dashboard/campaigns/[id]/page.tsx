import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Eye,
  MapPin,
  MousePointerClick,
  Activity,
  Wallet,
  ExternalLink,
  Clock,
  FileText,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { ensureMetrics, campaignTotals } from "@/lib/metrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { PlatformBadge } from "@/components/shared/platform-badge";
import { MetricsChart } from "@/components/dashboard/metrics-chart";
import {
  PayCampaignButton,
  CampaignStatusActions,
  RenewButton,
} from "@/components/campaigns/campaign-actions";
import { formatCompact, formatINR, formatDate } from "@/lib/utils";
import { goalLabel } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = (await getCurrentUser())!;

  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: { payment: true },
  });
  if (!campaign || campaign.userId !== user.id) notFound();

  const status = await ensureMetrics(campaign);
  const totals = await campaignTotals(id);
  const metrics = await prisma.campaignMetric.findMany({
    where: { campaignId: id },
    orderBy: { date: "asc" },
  });

  const ctr = totals.impressions > 0 ? ((totals.clicks / totals.impressions) * 100).toFixed(2) : "0.00";
  const targetStates = campaign.targetStates === "ALL_INDIA" ? "All India" : campaign.targetStates.split(",").join(", ");
  const platforms = campaign.adPlatforms.split(",");
  const spendPct = Math.min(100, Math.round((totals.spend / campaign.totalBudget) * 100));

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/campaigns"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to campaigns
      </Link>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold">{campaign.songName}</h2>
            <StatusBadge status={status} />
          </div>
          <p className="mt-1 text-muted-foreground">
            by {campaign.artistName} · {goalLabel(campaign.goal)}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {platforms.map((p) => (
              <PlatformBadge key={p} platform={p === "GOOGLE" ? "YOUTUBE" : "INSTAGRAM"} />
            ))}
            {campaign.trackUrl && (
              <a
                href={campaign.trackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <ExternalLink className="size-3" /> Track link
              </a>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {status === "PENDING_PAYMENT" && (
            <PayCampaignButton campaignId={campaign.id} amount={campaign.totalAmount} />
          )}
          <CampaignStatusActions campaignId={campaign.id} status={status} />
          {status === "COMPLETED" && <RenewButton />}
        </div>
      </div>

      {status === "PENDING_PAYMENT" && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="flex items-center gap-3 py-4">
            <Clock className="size-5 text-amber-600" />
            <p className="text-sm">
              This campaign is awaiting payment. Pay {formatINR(campaign.totalAmount)} to send it for review and launch.
            </p>
          </CardContent>
        </Card>
      )}

      {status === "IN_REVIEW" && (
        <Card className="border-sky-200 bg-sky-50">
          <CardContent className="flex items-center gap-3 py-4">
            <Clock className="size-5 text-sky-600" />
            <p className="text-sm">
              Payment received. Our team is reviewing your campaign — it&apos;ll go live within 24 hours.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Impressions" value={formatCompact(totals.impressions)} icon={Eye} />
        <StatCard label="Clicks" value={formatCompact(totals.clicks)} icon={MousePointerClick} accent="text-sky-600" hint={`${ctr}% CTR`} />
        <StatCard label="Streams / views" value={formatCompact(totals.views)} icon={Activity} accent="text-emerald-600" />
        <StatCard label="Spent" value={formatINR(totals.spend)} icon={Wallet} accent="text-amber-600" hint={`of ${formatINR(campaign.totalBudget)}`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border lg:col-span-2">
          <CardHeader>
            <CardTitle>Performance over time</CardTitle>
          </CardHeader>
          <CardContent>
            {metrics.length > 0 ? (
              <MetricsChart metrics={metrics} />
            ) : (
              <div className="flex h-[280px] flex-col items-center justify-center text-center">
                <Activity className="size-8 text-muted-foreground" />
                <p className="mt-3 text-sm text-muted-foreground">
                  Metrics will appear here once your campaign goes live.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Campaign details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Detail icon={MapPin} label="Audience" value={targetStates} />
              <Detail icon={CalendarDays} label="Age group" value={campaign.ageRange} />
              <Detail icon={Clock} label="Duration" value={`${campaign.durationDays} days`} />
              {campaign.startedAt && <Detail icon={CalendarDays} label="Started" value={formatDate(campaign.startedAt)} />}
              {campaign.endsAt && <Detail icon={CalendarDays} label="Ends" value={formatDate(campaign.endsAt)} />}
              {campaign.similarArtists && <Detail icon={Activity} label="Similar to" value={campaign.similarArtists} />}
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ad budget</span>
                <span>{formatINR(campaign.totalBudget)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Platform fee</span>
                <span>{formatINR(campaign.serviceFee)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 font-semibold">
                <span>Total</span>
                <span className="text-primary">{formatINR(campaign.totalAmount)}</span>
              </div>
              {campaign.payment && (
                <p className="flex items-center gap-1.5 pt-2 text-xs text-muted-foreground">
                  <FileText className="size-3.5" />
                  {campaign.payment.method} · {campaign.payment.reference}
                </p>
              )}
            </CardContent>
          </Card>

          {status === "LIVE" && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Budget pacing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{formatINR(totals.spend)} spent</span>
                  <span>{spendPct}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-primary" style={{ width: `${spendPct}%` }} />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div className="flex flex-1 justify-between gap-2">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-right font-medium">{value}</span>
      </div>
    </div>
  );
}
