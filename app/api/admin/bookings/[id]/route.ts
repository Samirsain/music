import { prisma } from "@/lib/db";
import { ApiError, handle, requireAdmin } from "@/lib/api";
import { sendWhatsApp } from "@/lib/notifications";

const ADMIN_TRANSITIONS: Record<string, string[]> = {
  PENDING: ["ACCEPTED", "REJECTED"],
  ACCEPTED: ["COMPLETED", "REJECTED"],
};

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return handle(async () => {
    await requireAdmin();
    const { id } = await params;
    const { status } = (await req.json()) as { status?: string };

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { user: true, influencer: true },
    });
    if (!booking) throw new ApiError("Booking not found", 404);

    if (!status || !ADMIN_TRANSITIONS[booking.status]?.includes(status)) {
      throw new ApiError(`Cannot move booking from ${booking.status} to ${status}`, 422);
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: {
        status,
        // Rejecting a paid booking triggers a refund in the real gateway
        paymentStatus:
          status === "REJECTED" && booking.paymentStatus === "PAID"
            ? "REFUNDED"
            : booking.paymentStatus,
      },
    });

    const messages: Record<string, string> = {
      ACCEPTED: `${booking.influencer.name} accepted your collab request for "${booking.songName}"! Delivery starts now. — AmpliTune`,
      REJECTED: `Unfortunately ${booking.influencer.name} couldn't take your request for "${booking.songName}". Any payment will be refunded in 3-5 days. — AmpliTune`,
      COMPLETED: `Your collab with ${booking.influencer.name} for "${booking.songName}" is complete. Check the post and share it! — AmpliTune`,
    };
    if (messages[status]) await sendWhatsApp(booking.user.phone, messages[status]);

    return updated;
  });
}
