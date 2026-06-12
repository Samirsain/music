import { prisma } from "@/lib/db";
import { InfluencerManager } from "@/components/admin/influencer-manager";
import type { Influencer, InfluencerService } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminInfluencersPage() {
  const rows = await prisma.influencer.findMany({
    orderBy: [{ active: "desc" }, { featured: "desc" }, { followers: "desc" }],
    include: { services: { orderBy: { price: "asc" } } },
  });

  const influencers = rows.map((i) => ({
    ...i,
    platforms: i.platforms.split(","),
  })) as unknown as (Influencer & { services: InfluencerService[] })[];

  return <InfluencerManager initial={influencers} />;
}
