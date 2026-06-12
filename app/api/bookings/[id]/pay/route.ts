import { prisma } from "@/lib/db";
import { ApiError, handle, mockGatewayReference, requireUser } from "@/lib/api";
import { paySchema } from "@/lib/validators";
import { sendWhatsApp } from "@/lib/notifications";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return handle(async () => {
    const user = await requireUser();
    const { id } = await params;
    const { method } = paySchema.parse(await req.json());

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { influencer: true },
    });
    if (!booking || booking.userId !== user.id) throw new ApiError("Booking not found", 404);
    if (booking.paymentStatus === "PAID") throw new ApiError("Already paid", 409);
    if (booking.status === "CANCELLED" || booking.status === "REJECTED") {
      throw new ApiError("This booking is no longer active", 409);
    }

    const payment = await prisma.payment.create({
      data: {
        userId: user.id,
        bookingId: booking.id,
        amount: booking.amount,
        method,
        reference: mockGatewayReference(),
      },
    });

    const updated = await prisma.booking.update({
      where: { id },
      data: { paymentStatus: "PAID" },
    });

    await sendWhatsApp(
      user.phone,
      `Payment of ₹${booking.amount.toLocaleString("en-IN")} received for your collab with ${booking.influencer.name} (${booking.serviceTitle}). We'll notify you once they accept. — AmpliTune`
    );

    return { booking: updated, payment };
  });
}
