import { prisma } from "@/lib/db";
import { ApiError, handle, requireUser } from "@/lib/api";
import { bookingSchema } from "@/lib/validators";

export async function GET() {
  return handle(async () => {
    const user = await requireUser();
    return prisma.booking.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        influencer: { select: { id: true, name: true, handle: true, category: true, imageUrl: true } },
      },
    });
  });
}

export async function POST(req: Request) {
  return handle(async () => {
    const user = await requireUser();
    const body = bookingSchema.parse(await req.json());

    const service = await prisma.influencerService.findUnique({
      where: { id: body.serviceId },
      include: { influencer: true },
    });
    if (!service || service.influencerId !== body.influencerId || !service.influencer.active) {
      throw new ApiError("This service is no longer available", 404);
    }

    return prisma.booking.create({
      data: {
        userId: user.id,
        influencerId: service.influencerId,
        serviceId: service.id,
        serviceTitle: service.title,
        servicePlatform: service.platform,
        songName: body.songName,
        trackUrl: body.trackUrl || null,
        message: body.message || null,
        preferredDate: body.preferredDate ? new Date(body.preferredDate) : null,
        amount: service.price,
      },
      include: {
        influencer: { select: { id: true, name: true, handle: true } },
      },
    });
  });
}
