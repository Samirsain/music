import { prisma } from "@/lib/db";
import { ApiError, handle, requireUser } from "@/lib/api";
import { ensureMetrics, campaignTotals } from "@/lib/metrics";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return handle(async () => {
    const user = await requireUser();
    const { id } = await params;
    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: { payment: true },
    });
    if (!campaign || (campaign.userId !== user.id && user.role !== "ADMIN")) {
      throw new ApiError("Campaign not found", 404);
    }
    const status = await ensureMetrics(campaign);
    const metrics = await prisma.campaignMetric.findMany({
      where: { campaignId: id },
      orderBy: { date: "asc" },
    });
    const totals = await campaignTotals(id);
    return { ...campaign, status, metrics, totals };
  });
}

const USER_TRANSITIONS: Record<string, string[]> = {
  // current status → statuses the owner may move it to
  PENDING_PAYMENT: ["CANCELLED"],
  LIVE: ["PAUSED"],
  PAUSED: ["LIVE"],
};

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return handle(async () => {
    const user = await requireUser();
    const { id } = await params;
    const { status } = (await req.json()) as { status?: string };

    const campaign = await prisma.campaign.findUnique({ where: { id } });
    if (!campaign || campaign.userId !== user.id) throw new ApiError("Campaign not found", 404);

    if (!status || !USER_TRANSITIONS[campaign.status]?.includes(status)) {
      throw new ApiError(`Cannot change status from ${campaign.status}`, 422);
    }

    return prisma.campaign.update({ where: { id }, data: { status } });
  });
}
