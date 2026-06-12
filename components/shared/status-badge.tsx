import { Badge } from "@/components/ui/badge";
import { statusLabel } from "@/lib/constants";

const VARIANT_MAP: Record<
  string,
  "success" | "warning" | "info" | "violet" | "danger" | "muted"
> = {
  LIVE: "success",
  ACCEPTED: "success",
  PAID: "success",
  COMPLETED: "info",
  IN_REVIEW: "warning",
  PENDING: "warning",
  PENDING_PAYMENT: "warning",
  UNPAID: "warning",
  PAUSED: "violet",
  CANCELLED: "muted",
  REJECTED: "danger",
  REFUNDED: "muted",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={VARIANT_MAP[status] ?? "muted"}>
      {status === "LIVE" && (
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
        </span>
      )}
      {statusLabel(status)}
    </Badge>
  );
}
