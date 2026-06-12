import { cn, gradientFor, initials } from "@/lib/utils";

export function GradientAvatar({
  name,
  imageUrl,
  className,
  textClassName,
}: {
  name: string;
  imageUrl?: string | null;
  className?: string;
  textClassName?: string;
}) {
  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt={name}
        className={cn("size-12 shrink-0 rounded-full object-cover", className)}
      />
    );
  }
  return (
    <div
      className={cn(
        "flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-white",
        gradientFor(name),
        className
      )}
    >
      <span className={cn("text-sm font-semibold", textClassName)}>{initials(name)}</span>
    </div>
  );
}
