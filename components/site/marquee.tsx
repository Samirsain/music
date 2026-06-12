import { INFLUENCER_CATEGORIES } from "@/lib/constants";

export function CategoryMarquee() {
  const items = [...INFLUENCER_CATEGORIES, ...INFLUENCER_CATEGORIES];
  return (
    <div className="relative overflow-hidden border-y border-border bg-muted/50 py-4">
      <div className="flex w-max animate-marquee gap-3">
        {items.map((c, i) => (
          <span
            key={i}
            className="rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground shadow-xs"
          >
            {c}
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}
