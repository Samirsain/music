import { prisma } from "@/lib/db";
import { handle, requireAdmin } from "@/lib/api";
import { influencerSchema } from "@/lib/validators";

export async function POST(req: Request) {
  return handle(async () => {
    await requireAdmin();
    const body = influencerSchema.parse(await req.json());

    return prisma.influencer.create({
      data: {
        name: body.name,
        handle: body.handle.startsWith("@") ? body.handle : `@${body.handle}`,
        bio: body.bio,
        category: body.category,
        platforms: body.platforms.join(","),
        followers: body.followers,
        engagementRate: body.engagementRate,
        location: body.location || null,
        imageUrl: body.imageUrl || null,
        featured: body.featured ?? false,
        active: body.active ?? true,
        startingPrice: Math.min(...body.services.map((s) => s.price)),
        services: {
          create: body.services.map((s) => ({
            title: s.title,
            description: s.description || "",
            platform: s.platform,
            price: s.price,
            deliveryDays: s.deliveryDays,
          })),
        },
      },
      include: { services: true },
    });
  });
}
