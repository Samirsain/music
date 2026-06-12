"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, IndianRupee, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const highlights = [
  {
    icon: BarChart3,
    title: "Set up in minutes",
    text: "Pick a goal, set a budget — we handle targeting and ad setup.",
  },
  {
    icon: IndianRupee,
    title: "Start from ₹200/day",
    text: "Pay per campaign with UPI or card. No retainers, no lock-in.",
  },
  {
    icon: MessageCircle,
    title: "Reports on WhatsApp",
    text: "Plain-language results — impressions, clicks and streams.",
  },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="hero-glow absolute inset-0 -z-10" />

      <div className="mx-auto max-w-7xl px-4 pt-16 pb-14 sm:px-6 sm:pt-24 sm:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground shadow-xs">
            For independent artists, labels &amp; creators in India
          </p>

          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
            Get your music heard, <span className="text-primary">without learning ads</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-balance text-lg text-muted-foreground">
            Run YouTube, Instagram and Spotify promotions, and book music influencers for
            reels and playlists — all from one simple dashboard. You pick the goal; we do
            the targeting, setup and reporting.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/signup">
                Start a campaign <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/influencers">Browse influencers</Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mx-auto mt-14 grid max-w-4xl gap-4 sm:grid-cols-3"
        >
          {highlights.map((h) => (
            <div
              key={h.title}
              className="rounded-xl border border-border bg-card p-5 text-left shadow-xs"
            >
              <h.icon className="size-5 text-primary" />
              <div className="mt-3 font-medium">{h.title}</div>
              <p className="mt-1 text-sm text-muted-foreground">{h.text}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
