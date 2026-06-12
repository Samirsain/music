import { prisma } from "@/lib/db";
import { handle } from "@/lib/api";
import type { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  return handle(async () => {
    const url = new URL(req.url);
    const q = url.searchParams.get("q")?.trim();
    const category = url.searchParams.get("category");
    const platform = url.searchParams.get("platform");
    const sort = url.searchParams.get("sort") ?? "popular";

    const where: Prisma.InfluencerWhereInput = { active: true };
    if (q) {
      where.OR = [{ name: { contains: q } }, { handle: { contains: q } }, { bio: { contains: q } }];
    }
    if (category && category !== "all") where.category = category;
    if (platform && platform !== "all") where.platforms = { contains: platform };

    const orderBy: Prisma.InfluencerOrderByWithRelationInput =
      sort === "price_asc"
        ? { startingPrice: "asc" }
        : sort === "price_desc"
          ? { startingPrice: "desc" }
          : sort === "engagement"
            ? { engagementRate: "desc" }
            : { followers: "desc" };

    const influencers = await prisma.influencer.findMany({
      where,
      orderBy: [{ featured: "desc" }, orderBy],
      include: { _count: { select: { services: true, bookings: true } } },
    });

    return influencers.map((i) => ({
      ...i,
      platforms: i.platforms.split(","),
      serviceCount: i._count.services,
      hireCount: i._count.bookings,
    }));
  });
}
