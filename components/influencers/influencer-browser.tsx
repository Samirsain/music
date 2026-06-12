"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, Users2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { InfluencerCard } from "@/components/influencers/influencer-card";
import { INFLUENCER_CATEGORIES, INFLUENCER_PLATFORMS } from "@/lib/constants";
import { api } from "@/lib/api-client";
import type { Influencer } from "@/lib/types";

export function InfluencerBrowser({ initial }: { initial: Influencer[] }) {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const [platform, setPlatform] = useState("all");
  const [sort, setSort] = useState("popular");
  // Latest fetched result tagged with the query it belongs to
  const [result, setResult] = useState<{ query: string; data: Influencer[] } | null>(null);

  // Debounced search term
  const [debouncedQ, setDebouncedQ] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (debouncedQ) params.set("q", debouncedQ);
    if (category !== "all") params.set("category", category);
    if (platform !== "all") params.set("platform", platform);
    if (sort) params.set("sort", sort);
    return params.toString();
  }, [debouncedQ, category, platform, sort]);

  const isDefault = query === "sort=popular" || query === "";

  useEffect(() => {
    if (isDefault) return;
    let active = true;
    api<Influencer[]>(`/api/influencers?${query}`).then((data) => {
      if (active) setResult({ query, data });
    });
    return () => {
      active = false;
    };
  }, [query, isDefault]);

  // Derive list + loading state — no synchronous setState needed
  const loading = !isDefault && result?.query !== query;
  const influencers = isDefault ? initial : result?.query === query ? result.data : [];

  return (
    <div>
      <div className="sticky top-16 z-30 -mx-4 mb-8 border-b border-border bg-background/90 px-4 py-4 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:border-border sm:bg-card sm:px-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search influencers…"
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[150px]">
                <SlidersHorizontal className="size-3.5" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {INFLUENCER_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All platforms</SelectItem>
                {INFLUENCER_PLATFORMS.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most followers</SelectItem>
                <SelectItem value="engagement">Top engagement</SelectItem>
                <SelectItem value="price_asc">Price: low to high</SelectItem>
                <SelectItem value="price_desc">Price: high to low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-72 rounded-xl" />
          ))}
        </div>
      ) : influencers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
          <Users2 className="size-10 text-muted-foreground" />
          <p className="mt-4 font-medium">No influencers match your filters</p>
          <p className="mt-1 text-sm text-muted-foreground">Try a different category or clear your search.</p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-muted-foreground">
            {influencers.length} influencer{influencers.length !== 1 ? "s" : ""} available
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {influencers.map((inf, i) => (
              <InfluencerCard key={inf.id} influencer={inf} index={i} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
