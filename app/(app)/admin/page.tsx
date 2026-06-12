import Link from "next/link";
import {
  IndianRupee,
  Megaphone,
  Users,
  Sparkles,
  TrendingUp,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatINR, formatDate } from "@/lib/utils";
import { goalLabel } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [
    revenueAgg,
    campaignCount,
    liveCount,
    reviewCount,
    clientCount,
    bookingCount,
    pendingBookings,
    recentCampaigns,
    recentPayments,
  ] = await Promise.all([
    prisma.payment.aggregate({ _sum: { amount: true }, where: { status: "SUCCESS" } }),
    prisma.campaign.count(),
    prisma.campaign.count({ where: { status: "LIVE" } }),
    prisma.campaign.count({ where: { status: "IN_REVIEW" } }),
    prisma.user.count({ where: { role: "ARTIST" } }),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.campaign.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { user: { select: { name: true, artistName: true } } },
    }),
    prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { user: { select: { name: true } } },
    }),
  ]);

  const revenue = revenueAgg._sum.amount ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Platform overview</h2>
        <p className="text-muted-foreground">Revenue, campaigns and activity across all clients.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total revenue" value={formatINR(revenue)} icon={IndianRupee} hint="All successful payments" />
        <StatCard label="Campaigns" value={campaignCount} icon={Megaphone} accent="text-cyan-400" hint={`${liveCount} live now`} />
        <StatCard label="Clients" value={clientCount} icon={Users} accent="text-emerald-400" />
        <StatCard label="Influencer hires" value={bookingCount} icon={Sparkles} accent="text-amber-400" hint={`${pendingBookings} pending`} />
      </div>

      {(reviewCount > 0 || pendingBookings > 0) && (
        <div className="grid gap-4 sm:grid-cols-2">
          {reviewCount > 0 && (
            <Card className="border-sky-500/30 bg-sky-500/5">
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <Clock className="size-5 text-sky-400" />
                  <p className="text-sm">
                    <span className="font-semibold">{reviewCount}</span> campaign(s) awaiting review
                  </p>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/admin/campaigns?filter=IN_REVIEW">Review</Link>
                </Button>
              </CardContent>
            </Card>
          )}
          {pendingBookings > 0 && (
            <Card className="border-amber-500/30 bg-amber-500/5">
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <Clock className="size-5 text-amber-400" />
                  <p className="text-sm">
                    <span className="font-semibold">{pendingBookings}</span> hire request(s) pending
                  </p>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/admin/bookings">Manage</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-white/10 lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Recent campaigns</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/campaigns">
                View all <ArrowUpRight className="size-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentCampaigns.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-background/40 p-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-medium">{c.songName}</p>
                      <StatusBadge status={c.status} />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {c.user.artistName || c.user.name} · {goalLabel(c.goal)} · {formatDate(c.createdAt)}
                    </p>
                  </div>
                  <span className="hidden font-medium sm:block">{formatINR(c.totalAmount)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-4 text-emerald-400" /> Recent payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentPayments.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{p.user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.method} · {formatDate(p.createdAt)}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-emerald-400">+{formatINR(p.amount)}</span>
                </div>
              ))}
              {recentPayments.length === 0 && (
                <p className="text-sm text-muted-foreground">No payments yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
