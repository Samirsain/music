"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, LogOut, Menu, ShieldCheck, X } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GradientAvatar } from "@/components/shared/gradient-avatar";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/influencers", label: "Influencers" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#features", label: "Features" },
];

export function Navbar({
  session,
}: {
  session: { name: string; role: string } | null;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground",
                pathname === l.href && "text-foreground"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer">
                <GradientAvatar name={session.name} className="size-9" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="truncate">{session.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                  <LayoutDashboard /> Dashboard
                </DropdownMenuItem>
                {session.role === "ADMIN" && (
                  <DropdownMenuItem onClick={() => router.push("/admin")}>
                    <ShieldCheck /> Admin panel
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={logout}>
                  <LogOut /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button variant="default" asChild>
                <Link href="/signup">Start promoting</Link>
              </Button>
            </>
          )}
        </div>

        <button
          className="rounded-md p-2 text-muted-foreground hover:text-foreground md:hidden cursor-pointer"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-border md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  {l.label}
                </Link>
              ))}
              <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
                {session ? (
                  <>
                    <Button variant="secondary" asChild>
                      <Link href="/dashboard" onClick={() => setOpen(false)}>
                        Dashboard
                      </Link>
                    </Button>
                    {session.role === "ADMIN" && (
                      <Button variant="secondary" asChild>
                        <Link href="/admin" onClick={() => setOpen(false)}>
                          Admin panel
                        </Link>
                      </Button>
                    )}
                    <Button variant="ghost" onClick={logout}>
                      Log out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="secondary" asChild>
                      <Link href="/login" onClick={() => setOpen(false)}>
                        Log in
                      </Link>
                    </Button>
                    <Button variant="default" asChild>
                      <Link href="/signup" onClick={() => setOpen(false)}>
                        Start promoting
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
