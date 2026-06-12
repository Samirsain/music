import { prisma } from "@/lib/db";
import type { Campaign } from "@prisma/client";

// Deterministic pseudo-random generator so a campaign always shows the same
// numbers for a given day (simulates Google Ads / Meta reporting until the
// real ad APIs are connected in Phase 2).
function seeded(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

/**
 * Ensures simulated daily metric rows exist for every elapsed day of a LIVE /
 * PAUSED / COMPLETED campaign. Also auto-completes campaigns whose end date
 * has passed. Returns the campaign's current status.
 */
export async function ensureMetrics(campaign: Campaign): Promise<string> {
  if (!campaign.startedAt || campaign.status === "PENDING_PAYMENT" || campaign.status === "IN_REVIEW" || campaign.status === "CANCELLED") {
    return campaign.status;
  }

  const start = startOfDay(campaign.startedAt);
  const end = campaign.endsAt ? startOfDay(campaign.endsAt) : start;
  const today = startOfDay(new Date());
  const last = today < end ? today : end;

  const existing = await prisma.campaignMetric.findMany({
    where: { campaignId: campaign.id },
    select: { date: true },
  });
  const have = new Set(existing.map((m) => m.date.getTime()));

  const rows: { campaignId: string; date: Date; impressions: number; clicks: number; views: number; spend: number }[] = [];
  for (let d = new Date(start); d <= last; d.setDate(d.getDate() + 1)) {
    const day = new Date(d);
    if (have.has(day.getTime())) continue;
    const rand = seeded(`${campaign.id}-${day.toISOString().slice(0, 10)}`);
    // Ramp-up: campaigns warm up over the first 3 days
    const dayIndex = Math.round((day.getTime() - start.getTime()) / 86400000);
    const ramp = Math.min(1, 0.45 + dayIndex * 0.22);
    const impressions = Math.round(campaign.dailyBudget * (9 + rand() * 7) * ramp);
    const ctr = 0.025 + rand() * 0.03;
    const clicks = Math.round(impressions * ctr);
    const views = Math.round(clicks * (0.45 + rand() * 0.3));
    const spend = Math.round(campaign.dailyBudget * (0.88 + rand() * 0.12));
    rows.push({ campaignId: campaign.id, date: day, impressions, clicks, views, spend });
  }

  if (rows.length > 0) {
    await prisma.campaignMetric.createMany({ data: rows });
  }

  if (campaign.status === "LIVE" && campaign.endsAt && new Date() > campaign.endsAt) {
    await prisma.campaign.update({ where: { id: campaign.id }, data: { status: "COMPLETED" } });
    return "COMPLETED";
  }
  return campaign.status;
}

export async function campaignTotals(campaignId: string) {
  const agg = await prisma.campaignMetric.aggregate({
    where: { campaignId },
    _sum: { impressions: true, clicks: true, views: true, spend: true },
  });
  return {
    impressions: agg._sum.impressions ?? 0,
    clicks: agg._sum.clicks ?? 0,
    views: agg._sum.views ?? 0,
    spend: agg._sum.spend ?? 0,
  };
}
