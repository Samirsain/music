import Link from "next/link";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";

export function EqualizerIcon({ className, animate = true }: { className?: string; animate?: boolean }) {
  const bars = [
    { delay: "0s", height: "60%" },
    { delay: "0.2s", height: "100%" },
    { delay: "0.4s", height: "75%" },
    { delay: "0.1s", height: "90%" },
  ];
  return (
    <span
      className={cn(
        "inline-flex h-6 w-6 items-end justify-center gap-[2px] rounded-md bg-gradient-to-br from-violet-600 to-fuchsia-600 p-1",
        className
      )}
    >
      {bars.map((b, i) => (
        <span
          key={i}
          className={cn("w-[3px] rounded-full bg-white", animate && "eq-bar")}
          style={{ height: b.height, animationDelay: b.delay }}
        />
      ))}
    </span>
  );
}

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn("flex items-center gap-2 font-semibold tracking-tight", className)}>
      <EqualizerIcon />
      <span className="text-lg">
        Ampli<span className="text-gradient">Tune</span>
      </span>
      <span className="sr-only">{APP_NAME}</span>
    </Link>
  );
}
