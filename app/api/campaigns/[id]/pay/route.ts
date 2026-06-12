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

    const campaign = await prisma.campaign.findUnique({ where: { id } });
    if (!campaign || campaign.userId !== user.id) throw new ApiError("Campaign not found", 404);
    if (campaign.status !== "PENDING_PAYMENT") {
      throw new ApiError("This campaign has already been paid for", 409);
    }

    // Mock gateway — in production this verifies a Razorpay order signature
    const payment = await prisma.payment.create({
      data: {
        userId: user.id,
        campaignId: campaign.id,
        amount: campaign.totalAmount,
        method,
        reference: mockGatewayReference(),
      },
    });

    const updated = await prisma.campaign.update({
      where: { id },
      data: { status: "IN_REVIEW" },
    });

    await sendWhatsApp(
      user.phone,
      `Payment of ₹${campaign.totalAmount.toLocaleString("en-IN")} received for "${campaign.songName}". Your campaign is in review and will go live within 24 hours. — AmpliTune`
    );

    return { campaign: updated, payment };
  });
}
