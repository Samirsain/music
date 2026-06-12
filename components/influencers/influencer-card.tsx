"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BadgeCheck, MapPin, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GradientAvatar } from "@/components/shared/gradient-avatar";
import { PlatformBadge } from "@/components/shared/platform-badge";
import { formatCompact, formatINR } from "@/lib/utils";
import type { Influencer } from "@/lib/types";

export function InfluencerCard({ influencer, index = 0 }: { influencer: Influencer; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.4) }}
    >
      <Link href={`/influencers/${influencer.id}`} className="group block h-full">
        <Card className="h-full gap-0 overflow-hidden border-border py-0 transition-all hover:border-primary/40 hover:shadow-md">
          <div className="relative h-20 bg-gradient-to-br from-violet-100 via-violet-50 to-sky-100">
            {influencer.featured && (
              <Badge variant="violet" className="absolute right-3 top-3 gap-1">
                <BadgeCheck className="size-3" /> Featured
              </Badge>
            )}
          </div>
          <div className="px-5 pb-5">
            <div className="-mt-8 flex items-end justify-between">
              <GradientAvatar
                name={influencer.name}
                imageUrl={influencer.imageUrl}
                className="size-16 ring-4 ring-card"
              />
              <Badge variant="secondary">{influencer.category}</Badge>
            </div>

            <div className="mt-3">
              <h3 className="font-semibold leading-tight">{influencer.name}</h3>
              <p className="text-sm text-muted-foreground">{influencer.handle}</p>
            </div>

            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{influencer.bio}</p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {influencer.platforms.map((p) => (
                <PlatformBadge key={p} platform={p} iconOnly />
              ))}
            </div>

            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <TrendingUp className="size-3.5 text-primary" />
                {formatCompact(influencer.followers)} followers
              </span>
              <span>{influencer.engagementRate.toFixed(1)}% eng.</span>
              {influencer.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5" />
                  {influencer.location}
                </span>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <div>
                <span className="text-xs text-muted-foreground">Starting at</span>
                <div className="font-semibold text-primary">{formatINR(influencer.startingPrice)}</div>
              </div>
              <span className="rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-primary transition-colors group-hover:bg-primary/10">
                View &amp; hire →
              </span>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
