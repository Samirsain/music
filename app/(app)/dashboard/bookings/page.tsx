import { Suspense } from "react";
import Link from "next/link";
import { Sparkles, Plus } from "lucide-react";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/dashboard/empty-state";
import { BookingsList } from "@/components/bookings/bookings-list";
import type { Booking } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function BookingsPage() {
  const user = (await getCurrentUser())!;
  const rows = await prisma.booking.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      influencer: { select: { id: true, name: true, handle: true, category: true, imageUrl: true } },
    },
  });

  const bookings = rows as unknown as Booking[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Influencer hires</h2>
          <p className="text-muted-foreground">Your collaborations with music influencers.</p>
        </div>
        <Button variant="gradient" asChild>
          <Link href="/influencers">
            <Plus className="size-4" /> Hire someone
          </Link>
        </Button>
      </div>

      {bookings.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No hires yet"
          description="Browse our marketplace and collaborate with India's top music influencers to amplify your reach."
          actionLabel="Browse influencers"
          actionHref="/influencers"
        />
      ) : (
        <Suspense fallback={null}>
          <BookingsList initial={bookings} />
        </Suspense>
      )}
    </div>
  );
}
