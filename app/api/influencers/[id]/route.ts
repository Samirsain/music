import { prisma } from "@/lib/db";
import { ApiError, handle } from "@/lib/api";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return handle(async () => {
    const { id } = await params;
    const influencer = await prisma.influencer.findUnique({
      where: { id },
      include: {
        services: { orderBy: { price: "asc" } },
        _count: { select: { bookings: true } },
      },
    });
    if (!influencer || !influencer.active) throw new ApiError("Influencer not found", 404);
    return { ...influencer, platforms: influencer.platforms.split(",") };
  });
}
