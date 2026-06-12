import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { CampaignWizard } from "@/components/campaigns/campaign-wizard";

export const dynamic = "force-dynamic";

export default async function NewCampaignPage() {
  const user = (await getCurrentUser())!;

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/campaigns"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to campaigns
      </Link>
      <CampaignWizard defaultArtist={user.artistName || user.name} />
    </div>
  );
}
