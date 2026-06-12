"use client";

import { useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api-client";
import { INFLUENCER_CATEGORIES, INFLUENCER_PLATFORMS } from "@/lib/constants";
import type { Influencer, InfluencerService } from "@/lib/types";

type ServiceDraft = {
  id?: string;
  title: string;
  description: string;
  platform: string;
  price: string;
  deliveryDays: string;
};

function blankService(): ServiceDraft {
  return { title: "", description: "", platform: "INSTAGRAM", price: "", deliveryDays: "5" };
}

export function InfluencerForm({
  open,
  onOpenChange,
  influencer,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  influencer: (Influencer & { services?: InfluencerService[] }) | null;
  onSaved: () => void;
}) {
  const editing = !!influencer;
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(influencer?.name ?? "");
  const [handle, setHandle] = useState(influencer?.handle ?? "");
  const [bio, setBio] = useState(influencer?.bio ?? "");
  const [category, setCategory] = useState(influencer?.category ?? INFLUENCER_CATEGORIES[0]);
  const [platforms, setPlatforms] = useState<string[]>(influencer?.platforms ?? ["INSTAGRAM"]);
  const [followers, setFollowers] = useState(String(influencer?.followers ?? ""));
  const [engagementRate, setEngagementRate] = useState(String(influencer?.engagementRate ?? ""));
  const [location, setLocation] = useState(influencer?.location ?? "");
  const [imageUrl, setImageUrl] = useState(influencer?.imageUrl ?? "");
  const [featured, setFeatured] = useState(influencer?.featured ?? false);
  const [active, setActive] = useState(influencer?.active ?? true);
  const [services, setServices] = useState<ServiceDraft[]>(
    influencer?.services?.length
      ? influencer.services.map((s) => ({
          id: s.id,
          title: s.title,
          description: s.description,
          platform: s.platform,
          price: String(s.price),
          deliveryDays: String(s.deliveryDays),
        }))
      : [blankService()]
  );

  function togglePlatform(p: string) {
    setPlatforms((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  }

  function updateService(i: number, patch: Partial<ServiceDraft>) {
    setServices((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  }

  function addService() {
    setServices((prev) => [...prev, blankService()]);
  }

  function removeService(i: number) {
    setServices((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev));
  }

  async function save() {
    if (!name.trim() || !handle.trim() || !bio.trim()) {
      toast.error("Name, handle and bio are required");
      return;
    }
    if (platforms.length === 0) {
      toast.error("Select at least one platform");
      return;
    }
    const parsedServices = services.map((s) => ({
      id: s.id,
      title: s.title.trim(),
      description: s.description.trim(),
      platform: s.platform,
      price: Number(s.price),
      deliveryDays: Number(s.deliveryDays),
    }));
    if (parsedServices.some((s) => !s.title || !s.price || s.price < 100)) {
      toast.error("Each service needs a title and a price of at least ₹100");
      return;
    }

    setLoading(true);
    const payload = {
      name: name.trim(),
      handle: handle.trim(),
      bio: bio.trim(),
      category,
      platforms,
      followers: Number(followers) || 0,
      engagementRate: Number(engagementRate) || 0,
      location: location.trim(),
      imageUrl: imageUrl.trim(),
      featured,
      active,
      services: parsedServices,
    };

    try {
      if (editing) {
        await api(`/api/admin/influencers/${influencer!.id}`, { method: "PATCH", json: payload });
        toast.success("Influencer updated");
      } else {
        await api("/api/admin/influencers", { method: "POST", json: payload });
        toast.success("Influencer added");
      }
      onSaved();
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit influencer" : "Add influencer"}</DialogTitle>
          <DialogDescription>
            Set their profile, category and the services (with charges) artists can book.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="inf-name">Name *</Label>
              <Input id="inf-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Riya Malhotra" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inf-handle">Handle *</Label>
              <Input id="inf-handle" value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="@riyabeats" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="inf-bio">Bio *</Label>
            <Textarea id="inf-bio" rows={2} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="What makes this creator great for music promo…" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INFLUENCER_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="inf-location">Location</Label>
              <Input id="inf-location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Mumbai" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Platforms *</Label>
            <div className="flex flex-wrap gap-2">
              {INFLUENCER_PLATFORMS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => togglePlatform(p.id)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-sm transition-colors",
                    platforms.includes(p.id)
                      ? "border-fuchsia-500 bg-fuchsia-500/15 text-fuchsia-200"
                      : "border-white/10 text-muted-foreground hover:border-white/20"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="inf-followers">Followers</Label>
              <Input id="inf-followers" type="number" value={followers} onChange={(e) => setFollowers(e.target.value)} placeholder="1250000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inf-eng">Engagement %</Label>
              <Input id="inf-eng" type="number" step="0.1" value={engagementRate} onChange={(e) => setEngagementRate(e.target.value)} placeholder="4.8" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inf-img">Image URL</Label>
              <Input id="inf-img" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://…" />
            </div>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={featured} onCheckedChange={setFeatured} /> Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={active} onCheckedChange={setActive} /> Active (visible)
            </label>
          </div>

          {/* Services */}
          <div className="space-y-3 rounded-xl border border-white/10 p-4">
            <div className="flex items-center justify-between">
              <Label className="text-base">Services &amp; charges</Label>
              <Button type="button" size="sm" variant="outline" onClick={addService}>
                <Plus className="size-3.5" /> Add service
              </Button>
            </div>
            {services.map((s, i) => (
              <div key={i} className="space-y-3 rounded-lg border border-white/5 bg-background/40 p-3">
                <div className="flex items-center justify-between gap-2">
                  <Input
                    value={s.title}
                    onChange={(e) => updateService(i, { title: e.target.value })}
                    placeholder="Service title (e.g. Instagram Reel)"
                  />
                  {services.length > 1 && (
                    <Button type="button" size="icon" variant="ghost" onClick={() => removeService(i)}>
                      <Trash2 className="size-4 text-rose-400" />
                    </Button>
                  )}
                </div>
                <Input
                  value={s.description}
                  onChange={(e) => updateService(i, { description: e.target.value })}
                  placeholder="Short description"
                />
                <div className="grid grid-cols-3 gap-2">
                  <Select value={s.platform} onValueChange={(v) => updateService(i, { platform: v })}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {INFLUENCER_PLATFORMS.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    value={s.price}
                    onChange={(e) => updateService(i, { price: e.target.value })}
                    placeholder="Price ₹"
                  />
                  <Input
                    type="number"
                    value={s.deliveryDays}
                    onChange={(e) => updateService(i, { deliveryDays: e.target.value })}
                    placeholder="Days"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="gradient" onClick={save} disabled={loading}>
            {loading && <Loader2 className="size-4 animate-spin" />}
            {editing ? "Save changes" : "Add influencer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
