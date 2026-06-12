import { prisma } from "@/lib/db";
import { ApiError, handle, requireAdmin } from "@/lib/api";
import { influencerSchema } from "@/lib/validators";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return handle(async () => {
    await requireAdmin();
    const { id } = await params;
    const body = influencerSchema.parse(await req.json());

    const existing = await prisma.influencer.findUnique({
      where: { id },
      include: { services: true },
    });
    if (!existing) throw new ApiError("Influencer not found", 404);

    const keptIds = body.services.filter((s) => s.id).map((s) => s.id as string);
    const toDelete = existing.services.filter((s) => !keptIds.includes(s.id)).map((s) => s.id);

    const updated = await prisma.$transaction(async (tx) => {
      if (toDelete.length > 0) {
        await tx.influencerService.deleteMany({ where: { id: { in: toDelete }, influencerId: id } });
      }
      for (const s of body.services) {
        if (s.id) {
          await tx.influencerService.update({
            where: { id: s.id },
            data: {
              title: s.title,
              description: s.description || "",
              platform: s.platform,
              price: s.price,
              deliveryDays: s.deliveryDays,
            },
          });
        } else {
          await tx.influencerService.create({
            data: {
              influencerId: id,
              title: s.title,
              description: s.description || "",
              platform: s.platform,
              price: s.price,
              deliveryDays: s.deliveryDays,
            },
          });
        }
      }
      return tx.influencer.update({
        where: { id },
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
        },
        include: { services: true },
      });
    });

    return updated;
  });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return handle(async () => {
    await requireAdmin();
    const { id } = await params;

    const existing = await prisma.influencer.findUnique({
      where: { id },
      include: { _count: { select: { bookings: true } } },
    });
    if (!existing) throw new ApiError("Influencer not found", 404);

    // Keep booking history intact — deactivate instead of deleting
    if (existing._count.bookings > 0) {
      await prisma.influencer.update({ where: { id }, data: { active: false, featured: false } });
      return { deactivated: true };
    }

    await prisma.influencer.delete({ where: { id } });
    return { deleted: true };
  });
}
