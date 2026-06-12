import { prisma } from "@/lib/db";
import { ApiError, handle, requireUser } from "@/lib/api";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return handle(async () => {
    const user = await requireUser();
    const { id } = await params;
    const { status } = (await req.json()) as { status?: string };

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking || booking.userId !== user.id) throw new ApiError("Booking not found", 404);

    // Users can only cancel their own pending requests
    if (status !== "CANCELLED" || booking.status !== "PENDING") {
      throw new ApiError("Only pending requests can be cancelled", 422);
    }

    return prisma.booking.update({
      where: { id },
      data: {
        status: "CANCELLED",
        paymentStatus: booking.paymentStatus === "PAID" ? "REFUNDED" : booking.paymentStatus,
      },
    });
  });
}
