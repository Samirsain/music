"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Loader2,
  Music,
  Target,
  Users,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { cn, formatINR } from "@/lib/utils";
import {
  AGE_RANGES,
  DURATIONS,
  GENRES,
  GOALS,
  INDIAN_STATES,
  SERVICE_FEE_RATE,
} from "@/lib/constants";
import { api } from "@/lib/api-client";

type Step = 0 | 1 | 2 | 3 | 4;

const STEPS = [
  { title: "Song details", icon: Music },
  { title: "Goal", icon: Target },
  { title: "Budget", icon: Wallet },
  { title: "Audience", icon: Users },
  { title: "Review & pay", icon: CheckCircle2 },
];

export function CampaignWizard({ defaultArtist }: { defaultArtist: string }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(0);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [songName, setSongName] = useState("");
  const [artistName, setArtistName] = useState(defaultArtist);
  const [genre, setGenre] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [trackUrl, setTrackUrl] = useState("");
  const [description, setDescription] = useState("");

  const [goal, setGoal] = useState<string>("");

  const [dailyBudget, setDailyBudget] = useState(800);
  const [durationDays, setDurationDays] = useState<number>(14);

  const [allIndia, setAllIndia] = useState(true);
  const [states, setStates] = useState<string[]>([]);
  const [ageRange, setAgeRange] = useState("18-24");
  const [similarArtists, setSimilarArtists] = useState("");

  const [method, setMethod] = useState<"UPI" | "CARD" | "NETBANKING">("UPI");

  const totalBudget = dailyBudget * durationDays;
  const serviceFee = Math.round(totalBudget * SERVICE_FEE_RATE);
  const totalAmount = totalBudget + serviceFee;

  const selectedGoal = GOALS.find((g) => g.id === goal);

  const stepValid = useMemo(() => {
    switch (step) {
      case 0:
        return songName.trim() && artistName.trim() && genre;
      case 1:
        return !!goal;
      case 2:
        return dailyBudget >= 200 && DURATIONS.includes(durationDays as 7 | 14 | 30);
      case 3:
        return (allIndia || states.length > 0) && ageRange;
      default:
        return true;
    }
  }, [step, songName, artistName, genre, goal, dailyBudget, durationDays, allIndia, states, ageRange]);

  function toggleState(s: string) {
    setStates((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  }

  function next() {
    if (!stepValid) {
      toast.error("Please complete this step first");
      return;
    }
    setStep((s) => Math.min(4, s + 1) as Step);
  }
  function back() {
    setStep((s) => Math.max(0, s - 1) as Step);
  }

  async function submitAndPay() {
    setSubmitting(true);
    try {
      const targetStates = allIndia ? ["ALL_INDIA"] : states;
      const campaign = await api<{ id: string }>("/api/campaigns", {
        method: "POST",
        json: {
          songName,
          artistName,
          genre,
          releaseDate,
          trackUrl,
          description,
          goal,
          dailyBudget,
          durationDays,
          targetStates,
          ageRange,
          similarArtists,
        },
      });

      // Mock Razorpay charge
      await api(`/api/campaigns/${campaign.id}/pay`, {
        method: "POST",
        json: { method },
      });

      toast.success("Payment successful! Your campaign is now in review.");
      router.push(`/dashboard/campaigns/${campaign.id}`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Stepper */}
      <div className="mb-8 flex items-center justify-between">
        {STEPS.map((s, i) => (
          <div key={s.title} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex size-9 items-center justify-center rounded-full border text-sm font-medium transition-colors",
                  i < step && "border-primary bg-primary text-primary-foreground",
                  i === step && "border-primary bg-primary/5 text-primary",
                  i > step && "border-border text-muted-foreground"
                )}
              >
                {i < step ? <Check className="size-4" /> : <s.icon className="size-4" />}
              </div>
              <span className={cn("hidden text-xs sm:block", i === step ? "text-foreground" : "text-muted-foreground")}>
                {s.title}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn("mx-2 h-px flex-1 transition-colors", i < step ? "bg-primary" : "bg-border")} />
            )}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {step === 0 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-semibold">What are you promoting?</h2>
                  <p className="text-sm text-muted-foreground">Tell us about your song or project.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="songName">Song / project name *</Label>
                    <Input id="songName" value={songName} onChange={(e) => setSongName(e.target.value)} placeholder="Raat Ki Baat" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="artistName">Artist name *</Label>
                    <Input id="artistName" value={artistName} onChange={(e) => setArtistName(e.target.value)} placeholder="Arjun M" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="genre">Genre *</Label>
                    <Select value={genre} onValueChange={setGenre}>
                      <SelectTrigger id="genre" className="w-full">
                        <SelectValue placeholder="Select genre" />
                      </SelectTrigger>
                      <SelectContent>
                        {GENRES.map((g) => (
                          <SelectItem key={g} value={g}>
                            {g}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="releaseDate">Release date</Label>
                    <Input id="releaseDate" type="date" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trackUrl">Spotify / YouTube link</Label>
                  <Input id="trackUrl" type="url" value={trackUrl} onChange={(e) => setTrackUrl(e.target.value)} placeholder="https://open.spotify.com/track/…" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Short description</Label>
                  <Textarea id="description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A line or two about the vibe of your track…" />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-semibold">What&apos;s your goal?</h2>
                  <p className="text-sm text-muted-foreground">Pick the outcome — we&apos;ll set up the right ad objective.</p>
                </div>
                <div className="grid gap-3">
                  {GOALS.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGoal(g.id)}
                      className={cn(
                        "flex items-start gap-3 rounded-xl border p-4 text-left transition-colors",
                        goal === g.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                      )}
                    >
                      <div
                        className={cn(
                          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border",
                          goal === g.id ? "border-primary bg-primary" : "border-input"
                        )}
                      >
                        {goal === g.id && <Check className="size-3 text-white" />}
                      </div>
                      <div>
                        <p className="font-medium">{g.label}</p>
                        <p className="text-sm text-muted-foreground">{g.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold">Set your budget</h2>
                  <p className="text-sm text-muted-foreground">Choose a daily budget and how long to run.</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-end justify-between">
                    <Label>Daily budget</Label>
                    <span className="text-2xl font-semibold text-primary">{formatINR(dailyBudget)}</span>
                  </div>
                  <Slider
                    value={[dailyBudget]}
                    min={200}
                    max={10000}
                    step={100}
                    onValueChange={(v) => setDailyBudget(v[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>₹200</span>
                    <span>₹10,000</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Campaign duration</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {DURATIONS.map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDurationDays(d)}
                        className={cn(
                          "rounded-xl border p-4 text-center transition-colors",
                          durationDays === d ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                        )}
                      >
                        <div className="text-lg font-bold">{d}</div>
                        <div className="text-xs text-muted-foreground">days</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-muted/40 p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Ad budget ({durationDays} days)</span>
                    <span>{formatINR(totalBudget)}</span>
                  </div>
                  <div className="mt-2 flex justify-between text-sm">
                    <span className="text-muted-foreground">Platform fee (10%)</span>
                    <span>{formatINR(serviceFee)}</span>
                  </div>
                  <div className="mt-3 flex justify-between border-t border-border pt-3 font-semibold">
                    <span>Total</span>
                    <span className="text-primary">{formatINR(totalAmount)}</span>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold">Who should hear it?</h2>
                  <p className="text-sm text-muted-foreground">We&apos;ll translate this into precise ad targeting.</p>
                </div>

                <div className="space-y-3">
                  <Label>Location</Label>
                  <button
                    type="button"
                    onClick={() => setAllIndia(true)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors",
                      allIndia ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                    )}
                  >
                    <div className={cn("flex size-5 items-center justify-center rounded-full border", allIndia ? "border-primary bg-primary" : "border-input")}>
                      {allIndia && <Check className="size-3 text-white" />}
                    </div>
                    <span className="font-medium">All India</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAllIndia(false)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors",
                      !allIndia ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                    )}
                  >
                    <div className={cn("flex size-5 items-center justify-center rounded-full border", !allIndia ? "border-primary bg-primary" : "border-input")}>
                      {!allIndia && <Check className="size-3 text-white" />}
                    </div>
                    <span className="font-medium">Specific states</span>
                  </button>

                  {!allIndia && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {INDIAN_STATES.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleState(s)}
                          className={cn(
                            "rounded-full border px-3 py-1.5 text-sm transition-colors",
                            states.includes(s)
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border text-muted-foreground hover:border-primary/30"
                          )}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ageRange">Age group</Label>
                  <Select value={ageRange} onValueChange={setAgeRange}>
                    <SelectTrigger id="ageRange" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AGE_RANGES.map((a) => (
                        <SelectItem key={a} value={a}>
                          {a}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="similar">Similar artists or genres</Label>
                  <Input id="similar" value={similarArtists} onChange={(e) => setSimilarArtists(e.target.value)} placeholder="e.g. Prateek Kuhad, Anuv Jain" />
                  <p className="text-xs text-muted-foreground">Helps us find fans who love music like yours.</p>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold">Review &amp; pay</h2>
                  <p className="text-sm text-muted-foreground">One last look before your campaign goes live.</p>
                </div>

                <div className="space-y-3 rounded-xl border border-border bg-muted/40 p-4 text-sm">
                  <Row label="Song" value={songName} />
                  <Row label="Artist" value={artistName} />
                  <Row label="Genre" value={genre} />
                  <Row label="Goal" value={selectedGoal?.label ?? "—"} />
                  <Row label="Platforms" value={(selectedGoal?.platforms ?? []).map((p) => (p === "GOOGLE" ? "Google" : "Meta")).join(" & ")} />
                  <Row label="Duration" value={`${durationDays} days`} />
                  <Row label="Audience" value={allIndia ? "All India" : states.join(", ")} />
                  <Row label="Age group" value={ageRange} />
                </div>

                <div className="space-y-2">
                  <Label>Payment method</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["UPI", "CARD", "NETBANKING"] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMethod(m)}
                        className={cn(
                          "rounded-xl border p-3 text-center text-sm font-medium transition-colors",
                          method === m ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                        )}
                      >
                        {m === "NETBANKING" ? "Net Banking" : m === "CARD" ? "Card" : "UPI"}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Secured by Razorpay (demo mode — no real charge is made).
                  </p>
                </div>

                <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Ad budget</span>
                    <span>{formatINR(totalBudget)}</span>
                  </div>
                  <div className="mt-2 flex justify-between text-sm">
                    <span className="text-muted-foreground">Platform fee</span>
                    <span>{formatINR(serviceFee)}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                    <span className="font-semibold">Total payable</span>
                    <span className="text-xl font-semibold text-primary">{formatINR(totalAmount)}</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex items-center justify-between gap-3">
          <Button variant="ghost" onClick={back} disabled={step === 0 || submitting}>
            <ArrowLeft className="size-4" /> Back
          </Button>
          {step < 4 ? (
            <Button variant="default" onClick={next} disabled={!stepValid}>
              Continue <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button variant="default" onClick={submitAndPay} disabled={submitting}>
              {submitting && <Loader2 className="size-4 animate-spin" />}
              Pay {formatINR(totalAmount)}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
