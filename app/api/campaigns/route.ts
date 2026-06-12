import { prisma } from "@/lib/db";
import { handle, requireUser } from "@/lib/api";
import { campaignSchema } from "@/lib/validators";
import { GOALS, SERVICE_FEE_RATE } from "@/lib/constants";
import { ensureMetrics, campaignTotals } from "@/lib/metrics";

export async function GET() {
  return handle(async () => {
    const user = await requireUser();
    const campaigns = await prisma.campaign.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    const withTotals = await Promise.all(
      campaigns.map(async (c) => {
        const status = await ensureMetrics(c);
        const totals = await campaignTotals(c.id);
        return { ...c, status, totals };
      })
    );
    return withTotals;
  });
}

export async function POST(req: Request) {
  return handle(async () => {
    const user = await requireUser();
    const body = campaignSchema.parse(await req.json());

    const goal = GOALS.find((g) => g.id === body.goal)!;
    const totalBudget = body.dailyBudget * body.durationDays;
    const serviceFee = Math.round(totalBudget * SERVICE_FEE_RATE);

    const campaign = await prisma.campaign.create({
      data: {
        userId: user.id,
        songName: body.songName,
        artistName: body.artistName,
        genre: body.genre,
        releaseDate: body.releaseDate ? new Date(body.releaseDate) : null,
        trackUrl: body.trackUrl || null,
        coverArtUrl: body.coverArtUrl || null,
        description: body.description || null,
        goal: body.goal,
        adPlatforms: goal.platforms.join(","),
        dailyBudget: body.dailyBudget,
        durationDays: body.durationDays,
        totalBudget,
        serviceFee,
        totalAmount: totalBudget + serviceFee,
        targetStates: body.targetStates.join(","),
        ageRange: body.ageRange,
        similarArtists: body.similarArtists || null,
        status: "PENDING_PAYMENT",
      },
    });

    return campaign;
  });
}
