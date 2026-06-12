import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, BadgeCheck, MapPin, Activity, TrendingUp, Users2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { GradientAvatar } from "@/components/shared/gradient-avatar";
import { PlatformBadge } from "@/components/shared/platform-badge";
import { Badge } from "@/components/ui/badge";
import { ServiceList } from "@/components/influencers/service-list";
import { formatCompact, formatINR } from "@/lib/utils";
import type { InfluencerService } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const influencer = await prisma.influencer.findUnique({ where: { id } });
  if (!influencer) return { title: "Influencer not found" };
  return {
    title: `Hire ${influencer.name}`,
    description: influencer.bio,
  };
}

export default async function InfluencerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [influencer, session] = await Promise.all([
    prisma.influencer.findUnique({
      where: { id },
      include: {
        services: { orderBy: { price: "asc" } },
        _count: { select: { bookings: true } },
      },
    }),
    getSession(),
  ]);

  if (!influencer || !influencer.active) notFound();

  const platforms = influencer.platforms.split(",");
  const services: InfluencerService[] = influencer.services;

  const stats = [
    { label: "Followers", value: formatCompact(influencer.followers), icon: TrendingUp },
    { label: "Engagement", value: `${influencer.engagementRate.toFixed(1)}%`, icon: Activity },
    { label: "Collabs done", value: `${influencer._count.bookings}`, icon: Users2 },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link
        href="/influencers"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to all influencers
      </Link>

      <div className="mt-6 overflow-hidden rounded-3xl border border-border bg-card">
        <div className="relative h-32 bg-gradient-to-br from-violet-100 via-violet-50 to-sky-100 sm:h-40">
          {influencer.featured && (
            <Badge variant="violet" className="absolute right-4 top-4 gap-1">
              <BadgeCheck className="size-3" /> Featured creator
            </Badge>
          )}
        </div>
        <div className="px-6 pb-6">
          <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <GradientAvatar
                name={influencer.name}
                imageUrl={influencer.imageUrl}
                className="size-24 ring-4 ring-card"
                textClassName="text-2xl"
              />
              <div className="pb-1">
                <h1 className="text-2xl font-semibold">{influencer.name}</h1>
                <p className="text-muted-foreground">{influencer.handle}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{influencer.category}</Badge>
              {influencer.location && (
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="size-3.5" />
                  {influencer.location}
                </span>
              )}
            </div>
          </div>

          <p className="mt-5 max-w-2xl text-muted-foreground">{influencer.bio}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {platforms.map((p) => (
              <PlatformBadge key={p} platform={p} />
            ))}
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-border bg-muted/40 p-4 text-center">
                <s.icon className="mx-auto size-4 text-primary" />
                <div className="mt-2 text-lg font-bold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Services &amp; pricing</h2>
          <span className="text-sm text-muted-foreground">
            from <span className="font-semibold text-primary">{formatINR(influencer.startingPrice)}</span>
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick a package, share your track, and pay securely to confirm.
        </p>
        <div className="mt-5">
          <ServiceList
            influencerId={influencer.id}
            influencerName={influencer.name}
            services={services}
            isLoggedIn={!!session}
          />
        </div>
      </div>
    </div>
  );
}
