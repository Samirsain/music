import { prisma } from "@/lib/db";
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
import { PlatformBadge } from "@/components/shared/platform-badge";
import { BookingAdminActions } from "@/components/admin/booking-admin-actions";
import { GradientAvatar } from "@/components/shared/gradient-avatar";
import { formatINR, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: [{ createdAt: "desc" }],
    include: {
      user: { select: { name: true, email: true } },
      influencer: { select: { name: true, handle: true, imageUrl: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Influencer hires</h2>
        <p className="text-muted-foreground">Accept or reject collaboration requests on behalf of influencers.</p>
      </div>

      <Card className="border-white/10 py-0">
        <CardContent className="px-0">
          {bookings.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted-foreground">No hire requests yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Influencer</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <GradientAvatar name={b.influencer.name} imageUrl={b.influencer.imageUrl} className="size-8" textClassName="text-xs" />
                        <div>
                          <p className="text-sm font-medium">{b.influencer.name}</p>
                          <p className="text-xs text-muted-foreground">{b.influencer.handle}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <PlatformBadge platform={b.servicePlatform} iconOnly />
                        <span className="text-sm">{b.serviceTitle}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{b.songName} · {formatDate(b.createdAt)}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{b.user.name}</p>
                      <p className="text-xs text-muted-foreground">{b.user.email}</p>
                    </TableCell>
                    <TableCell className="font-medium">{formatINR(b.amount)}</TableCell>
                    <TableCell>
                      <StatusBadge status={b.status} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={b.paymentStatus} />
                    </TableCell>
                    <TableCell>
                      <BookingAdminActions bookingId={b.id} status={b.status} />
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
