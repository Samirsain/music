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
import { GradientAvatar } from "@/components/shared/gradient-avatar";
import { Badge } from "@/components/ui/badge";
import { formatINR, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminClientsPage() {
  const clients = await prisma.user.findMany({
    where: { role: "ARTIST" },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { campaigns: true, bookings: true } },
      payments: { where: { status: "SUCCESS" }, select: { amount: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Clients</h2>
        <p className="text-muted-foreground">Every artist on the platform and their activity.</p>
      </div>

      <Card className="border-white/10 py-0">
        <CardContent className="px-0">
          {clients.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted-foreground">No clients yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Artist</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Genre</TableHead>
                  <TableHead>Campaigns</TableHead>
                  <TableHead>Hires</TableHead>
                  <TableHead>Total spent</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((c) => {
                  const spent = c.payments.reduce((sum, p) => sum + p.amount, 0);
                  return (
                    <TableRow key={c.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <GradientAvatar name={c.name} className="size-9" textClassName="text-xs" />
                          <div>
                            <p className="text-sm font-medium">{c.artistName || c.name}</p>
                            <p className="text-xs text-muted-foreground">{c.name}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{c.email}</p>
                        {c.phone && <p className="text-xs text-muted-foreground">{c.phone}</p>}
                      </TableCell>
                      <TableCell>
                        {c.genre ? <Badge variant="secondary">{c.genre}</Badge> : <span className="text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell className="font-medium">{c._count.campaigns}</TableCell>
                      <TableCell className="font-medium">{c._count.bookings}</TableCell>
                      <TableCell className="font-medium text-emerald-400">{formatINR(spent)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{formatDate(c.createdAt)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
