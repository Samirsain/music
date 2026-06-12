import Link from "next/link";
import { prisma } from "@/lib/db";
import { ensureMetrics } from "@/lib/metrics";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { CampaignAdminActions } from "@/components/admin/campaign-admin-actions";
import { formatINR, formatDate } from "@/lib/utils";
import { goalLabel, CAMPAIGN_STATUSES, statusLabel } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminCampaignsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  const activeFilter = filter && CAMPAIGN_STATUSES.includes(filter as never) ? filter : null;

  const rows = await prisma.campaign.findMany({
    where: activeFilter ? { status: activeFilter } : undefined,
    orderBy: [{ createdAt: "desc" }],
    include: { user: { select: { name: true, artistName: true, email: true } } },
  });

  // Keep simulated metrics / auto-complete fresh
  await Promise.all(rows.map((c) => ensureMetrics(c)));
  const campaigns = await prisma.campaign.findMany({
    where: activeFilter ? { status: activeFilter } : undefined,
    orderBy: [{ createdAt: "desc" }],
    include: { user: { select: { name: true, artistName: true, email: true } } },
  });

  const filters = [
    { key: null, label: "All" },
    { key: "IN_REVIEW", label: "In review" },
    { key: "LIVE", label: "Live" },
    { key: "COMPLETED", label: "Completed" },
    { key: "PENDING_PAYMENT", label: "Unpaid" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">All campaigns</h2>
        <p className="text-muted-foreground">Review, launch and manage every client campaign.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const isActive = f.key === activeFilter;
          return (
            <Link
              key={f.label}
              href={f.key ? `/admin/campaigns?filter=${f.key}` : "/admin/campaigns"}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm transition-colors",
                isActive
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/30"
              )}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      <Card className="border-border py-0">
        <CardContent className="px-0">
          {campaigns.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted-foreground">
              No campaigns{activeFilter ? ` with status “${statusLabel(activeFilter)}”` : ""}.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Goal</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <Link href={`/dashboard/campaigns/${c.id}`} className="font-medium hover:text-primary">
                        {c.songName}
                      </Link>
                      <p className="text-xs text-muted-foreground">{formatDate(c.createdAt)}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{c.user.artistName || c.user.name}</p>
                      <p className="text-xs text-muted-foreground">{c.user.email}</p>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{goalLabel(c.goal)}</TableCell>
                    <TableCell className="font-medium">{formatINR(c.totalAmount)}</TableCell>
                    <TableCell>
                      <StatusBadge status={c.status} />
                    </TableCell>
                    <TableCell>
                      <CampaignAdminActions campaignId={c.id} status={c.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
