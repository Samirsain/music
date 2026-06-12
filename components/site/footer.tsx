import Link from "next/link";
import { Logo } from "@/components/shared/logo";

const COLUMNS = [
  {
    title: "Platform",
    links: [
      { label: "Hire influencers", href: "/influencers" },
      { label: "Start a campaign", href: "/dashboard/campaigns/new" },
      { label: "How it works", href: "/#how-it-works" },
      { label: "Features", href: "/#features" },
    ],
  },
  {
    title: "For artists",
    links: [
      { label: "Sign up free", href: "/signup" },
      { label: "Log in", href: "/login" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/50">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Professional music promotion for independent artists, labels and creators in
            India. Google Ads, Meta Ads and influencer collaborations — without the
            technical headache.
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            Payments via Razorpay · Campaign reports on WhatsApp and email
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold">{col.title}</h4>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border py-6">
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} AmpliTune. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
