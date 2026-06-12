import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { InfluencerBrowser } from "@/components/influencers/influencer-browser";
import type { Influencer } from "@/lib/types";

export const metadata: Metadata = {
  title: "Hire music influencers",
  description:
    "Browse and hire India's top music influencers by genre. Transparent pricing for reels, playlist placements, reviews and more.",
};

export const dynamic = "force-dynamic";

export default async function InfluencersPage() {
  const rows = await prisma.influencer.findMany({
    where: { active: true },
    orderBy: [{ featured: "desc" }, { followers: "desc" }],
    include: { _count: { select: { services: true, bookings: true } } },
  });

  const influencers: Influencer[] = rows.map((i) => ({
    ...i,
    platforms: i.platforms.split(","),
    serviceCount: i._count.services,
    hireCount: i._count.bookings,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Hire India&apos;s top <span className="text-primary">music influencers</span>
        </h1>
        <p className="mt-4 text-muted-foreground">
          Get your track on the right reels, playlists, and reaction videos. Browse by
          genre, compare transparent pricing, and book in minutes.
        </p>
      </div>

      <div className="mt-10">
        <InfluencerBrowser initial={influencers} />
      </div>
    </div>
  );
}
