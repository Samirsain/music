import { prisma } from "@/lib/db";
import { ApiError, handle, requireAdmin } from "@/lib/api";
import { sendWhatsApp } from "@/lib/notifications";

const ADMIN_TRANSITIONS: Record<string, string[]> = {
  IN_REVIEW: ["LIVE", "CANCELLED"],
  LIVE: ["PAUSED", "COMPLETED", "CANCELLED"],
  PAUSED: ["LIVE", "COMPLETED", "CANCELLED"],
};

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return handle(async () => {
    await requireAdmin();
    const { id } = await params;
    const { status } = (await req.json()) as { status?: string };

    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!campaign) throw new ApiError("Campaign not found", 404);

    if (!status || !ADMIN_TRANSITIONS[campaign.status]?.includes(status)) {
      throw new ApiError(`Cannot move campaign from ${campaign.status} to ${status}`, 422);
    }

    const data: { status: string; startedAt?: Date; endsAt?: Date } = { status };
    // First launch — stamp the flight window
    if (status === "LIVE" && !campaign.startedAt) {
      const now = new Date();
      data.startedAt = now;
      data.endsAt = new Date(now.getTime() + campaign.durationDays * 86400000);
    }

    const updated = await prisma.campaign.update({ where: { id }, data });

    if (status === "LIVE") {
      await sendWhatsApp(
        campaign.user.phone,
        `Your campaign for "${campaign.songName}" is now LIVE on ${campaign.adPlatforms.replace(",", " & ")}! Track results on your AmpliTune dashboard.`
      );
    }

    return updated;
  });
}
