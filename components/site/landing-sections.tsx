"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BarChart3,
  Bell,
  CheckCircle2,
  CreditCard,
  FileText,
  Globe2,
  Headphones,
  History,
  LayoutGrid,
  MousePointerClick,
  Rocket,
  Target,
  TrendingDown,
  UserPlus,
  Wallet,
  Languages,
  Users,
  Megaphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/shared/motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <FadeIn className="mx-auto mb-12 max-w-2xl text-center">
      <p className="text-sm font-medium uppercase tracking-wider text-primary">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-4 text-muted-foreground">{subtitle}</p>}
    </FadeIn>
  );
}

const problems = [
  {
    icon: TrendingDown,
    title: "Organic reach is dying",
    text: "Reach on Instagram, YouTube & Spotify drops every year. Posting and praying no longer works.",
  },
  {
    icon: Target,
    title: "Ads are too technical",
    text: "Google & Meta Ads need real expertise. Most artists waste money on poorly targeted campaigns.",
  },
  {
    icon: Globe2,
    title: "Foreign tools don't get India",
    text: "SubmitHub & Groover are English-only and blind to Indian genres, languages and audiences.",
  },
];

export function ProblemSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <SectionHeading
        eyebrow="The problem"
        title="Great music, nobody listening"
        subtitle="Independent artists are stuck between dying organic reach and ad platforms built for marketers, not musicians."
      />
      <div className="grid gap-6 md:grid-cols-3">
        {problems.map((p, i) => (
          <FadeIn key={p.title} delay={i * 0.1}>
            <div className="h-full rounded-2xl border border-border bg-card p-6">
              <div className="flex size-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <p.icon className="size-5" />
              </div>
              <h3 className="mt-4 font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.text}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

const steps = [
  { icon: UserPlus, title: "Create an account", text: "Sign up with your name, artist name and genre — your profile and dashboard are ready instantly." },
  { icon: LayoutGrid, title: "Connect your ad accounts", text: "Link Google Ads & Meta Business with one click. No accounts yet? We guide you through it." },
  { icon: Headphones, title: "Enter your song details", text: "Song name, release date, Spotify/YouTube link, cover art and a short clip — that's it." },
  { icon: Target, title: "Pick a goal", text: "More streams, more views, more followers or event reach. We map it to the right ad objective." },
  { icon: Wallet, title: "Set budget & duration", text: "Slide to your daily budget, choose 7 / 14 / 30 days. Total cost is shown upfront — no surprises." },
  { icon: Globe2, title: "Define your audience", text: "Choose states or all-India, age group and similar artists. We translate it to precise targeting." },
  { icon: CreditCard, title: "Review & pay", text: "A clear summary, then pay securely via UPI, credit or debit card through Razorpay." },
  { icon: Rocket, title: "Campaign goes live", text: "Once paid, your campaign launches on Google & Meta automatically. WhatsApp confirmation included." },
  { icon: BarChart3, title: "Track live results", text: "Impressions, clicks, listens and spend — in plain language with simple charts, anytime." },
  { icon: FileText, title: "Get your report + renew", text: "A PDF report lands on WhatsApp & email when the campaign ends. Renew or scale up in one click." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y border-border bg-muted/50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="How it works"
          title="From signup to streams in 10 simple steps"
          subtitle="No jargon, no agencies, no guesswork. Just fill a guided form — the platform does the heavy lifting."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="group relative rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
            >
              <span className="absolute right-5 top-5 text-3xl font-bold text-foreground/5 transition-colors group-hover:text-primary/15">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <s.icon className="size-5" />
              </div>
              <h3 className="mt-4 font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const clientFeatures = [
  { icon: MousePointerClick, title: "No-tech campaign builder", text: "A guided form anyone can use — zero advertising knowledge required." },
  { icon: LayoutGrid, title: "Google + Meta in one place", text: "Launch across YouTube, Instagram & Facebook from a single dashboard." },
  { icon: Target, title: "Goal-based setup", text: "Pick the outcome you want — we choose the correct ad objective for you." },
  { icon: BarChart3, title: "Live plain-language dashboard", text: "Impressions, clicks, reach & spend with simple charts — no jargon." },
  { icon: Bell, title: "WhatsApp & email alerts", text: "Milestone updates and confirmations land straight in your pocket." },
  { icon: FileText, title: "Automatic PDF reports", text: "A clean summary report generated and delivered when your campaign ends." },
  { icon: History, title: "Full campaign history", text: "Every past promotion in one place — compare and repeat what worked." },
  { icon: Headphones, title: "Support chat", text: "Real help whenever you have a question during a campaign." },
];

export function FeaturesSection() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <SectionHeading
        eyebrow="Features"
        title="Everything you need to grow your music"
        subtitle="Powerful enough for labels, simple enough for a first-time artist."
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {clientFeatures.map((f, i) => (
          <motion.div
            key={f.title}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: (i % 4) * 0.07 }}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <f.icon className="size-6 text-primary" />
            <h3 className="mt-3 text-sm font-semibold">{f.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{f.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function InfluencerCta() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <FadeIn>
        <div className="overflow-hidden rounded-2xl border border-border bg-violet-50/60 p-8 sm:p-12">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-3 py-1 text-xs font-medium text-violet-700">
                <Megaphone className="size-3.5" /> Influencer marketplace
              </div>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Book music influencers, with prices upfront
              </h2>
              <p className="mt-4 text-muted-foreground">
                Get your track on the right reels, playlists and reaction videos. Browse
                creators by genre — Bollywood to Lo-fi, Punjabi to Devotional — see exactly
                what each service costs, and book in a few clicks.
              </p>
              <div className="mt-6 flex flex-wrap gap-5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="size-4 text-violet-600" /> Curated, verified creators
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="size-4 text-emerald-600" /> Fixed per-service pricing
                </div>
              </div>
              <Button size="lg" className="mt-8" asChild>
                <Link href="/influencers">Explore the marketplace</Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { cat: "Bollywood reels", price: "₹8,000" },
                { cat: "Punjabi shoutouts", price: "₹6,000" },
                { cat: "Hip-Hop reviews", price: "₹11,000" },
                { cat: "Playlist placements", price: "₹6,000" },
              ].map((c, i) => (
                <motion.div
                  key={c.cat}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="rounded-xl border border-border bg-card p-5 shadow-xs"
                >
                  <div className="font-medium">{c.cat}</div>
                  <div className="mt-3 text-xs text-muted-foreground">from</div>
                  <div className="text-xl font-semibold text-primary">{c.price}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}

const phases = [
  {
    name: "Phase 1 — Core platform",
    weeks: "Weeks 1-4",
    items: ["Signup & login", "Guided campaign builder", "Razorpay payments", "Client dashboard", "Admin panel", "WhatsApp on payment"],
  },
  {
    name: "Phase 2 — Automation",
    weeks: "Weeks 5-10",
    items: ["Google Ads API auto-launch", "Meta Marketing API", "Live metrics sync", "Auto PDF reports", "One-click renewal"],
  },
  {
    name: "Phase 3 — Scale & AI",
    weeks: "Weeks 11-16",
    items: ["AI-generated ad copy", "Label multi-artist dashboard", "Campaign comparison", "Referral credits", "Hindi & regional UI"],
  },
];

export function RoadmapSection() {
  return (
    <section className="border-y border-border bg-muted/50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Roadmap"
          title="Built in three focused phases"
          subtitle="Ship value early, automate fast, then scale with intelligence."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {phases.map((p, i) => (
            <FadeIn key={p.name} delay={i * 0.1}>
              <div className="h-full rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                    {p.weeks}
                  </span>
                  {i === 0 && (
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
                      Live now
                    </span>
                  )}
                </div>
                <h3 className="mt-4 font-semibold">{p.name}</h3>
                <ul className="mt-4 space-y-2.5">
                  {p.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

const audience = [
  { icon: Headphones, label: "Independent artists", text: "Singles, albums & music videos" },
  { icon: Users, label: "Music labels", text: "Manage many artists centrally" },
  { icon: LayoutGrid, label: "Producers", text: "Promote beats & collabs" },
  { icon: Megaphone, label: "Event organizers", text: "Fill concerts & festivals" },
  { icon: Languages, label: "Podcasters", text: "Grow your listener base" },
];

export function AudienceSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <SectionHeading eyebrow="Who it's for" title="Made for every kind of music creator" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {audience.map((a, i) => (
          <motion.div
            key={a.label}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="rounded-2xl border border-border bg-card p-5 text-center"
          >
            <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <a.icon className="size-5" />
            </div>
            <h3 className="mt-3 text-sm font-semibold">{a.label}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{a.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
      <FadeIn>
        <div className="overflow-hidden rounded-2xl bg-zinc-900 px-8 py-16 text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Your next release deserves an audience
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-balance text-zinc-400">
            Create a free account, set up your first campaign in a few minutes, and track
            every rupee from your dashboard.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/signup">Create your free account</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-zinc-700 bg-transparent text-white hover:bg-zinc-800 hover:text-white"
              asChild
            >
              <Link href="/influencers">Browse influencers</Link>
            </Button>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
