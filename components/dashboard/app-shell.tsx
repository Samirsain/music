"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  Sparkles,
  Star,
  UserCircle,
  Users,
  X,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { GradientAvatar } from "@/components/shared/gradient-avatar";
import { Button } from "@/components/ui/button";
import { SidebarNav, type NavItem } from "@/components/dashboard/sidebar-nav";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Nav configs live in this client module so the lucide icon *components* never
// cross the server→client boundary (Next 16 / React 19 forbids that).
const NAVS: Record<string, { items: NavItem[]; titles: Record<string, string>; defaultTitle: string }> = {
  dashboard: {
    items: [
      { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
      { href: "/dashboard/campaigns", label: "Campaigns", icon: Megaphone },
      { href: "/dashboard/bookings", label: "Influencer hires", icon: Sparkles },
      { href: "/dashboard/profile", label: "Profile", icon: UserCircle },
    ],
    titles: {
      "/dashboard": "Overview",
      "/dashboard/campaigns": "Campaigns",
      "/dashboard/campaigns/new": "New campaign",
      "/dashboard/bookings": "Influencer hires",
      "/dashboard/profile": "Profile",
    },
    defaultTitle: "Dashboard",
  },
  admin: {
    items: [
      { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
      { href: "/admin/campaigns", label: "Campaigns", icon: Megaphone },
      { href: "/admin/bookings", label: "Influencer hires", icon: Sparkles },
      { href: "/admin/influencers", label: "Manage influencers", icon: Star },
      { href: "/admin/clients", label: "Clients", icon: Users },
    ],
    titles: {
      "/admin": "Admin overview",
      "/admin/campaigns": "All campaigns",
      "/admin/bookings": "All hires",
      "/admin/influencers": "Manage influencers",
      "/admin/clients": "Clients",
    },
    defaultTitle: "Admin",
  },
};

export function AppShell({
  variant,
  user,
  children,
}: {
  variant: "dashboard" | "admin";
  user: { name: string; email: string; role: string };
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { items, titles, defaultTitle } = NAVS[variant];

  // Longest matching prefix wins so nested routes resolve their own title
  const title =
    Object.entries(titles)
      .filter(([href]) => (href === "/" ? pathname === href : pathname.startsWith(href)))
      .sort((a, b) => b[0].length - a[0].length)[0]?.[1] ?? defaultTitle;

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-white/5 bg-card/30 lg:flex">
        <div className="flex h-16 items-center border-b border-white/5 px-6">
          <Logo />
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <SidebarNav items={items} />
        </div>
        <div className="border-t border-white/5 p-4">
          <div className="flex items-center gap-3 rounded-lg p-2">
            <GradientAvatar name={user.name} className="size-9" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="mt-1 w-full justify-start" onClick={logout}>
            <LogOut className="size-4" /> Log out
          </Button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-72 flex-col border-r border-white/10 bg-card">
            <div className="flex h-16 items-center justify-between border-b border-white/5 px-5">
              <Logo />
              <button onClick={() => setMobileOpen(false)} className="text-muted-foreground">
                <X className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <SidebarNav items={items} onNavigate={() => setMobileOpen(false)} />
            </div>
            <div className="border-t border-white/5 p-4">
              <Button variant="ghost" size="sm" className="w-full justify-start" onClick={logout}>
                <LogOut className="size-4" /> Log out
              </Button>
            </div>
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/5 bg-background/80 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <button
              className="rounded-md p-2 text-muted-foreground hover:text-foreground lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="size-5" />
            </button>
            <h1 className="text-lg font-semibold">{title}</h1>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden">
              <GradientAvatar name={user.name} className="size-9" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="truncate">{user.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={logout}>
                <LogOut /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className={cn("flex-1 p-4 sm:p-6")}>{children}</main>
      </div>
    </div>
  );
}
