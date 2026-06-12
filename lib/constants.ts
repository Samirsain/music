export const APP_NAME = "AmpliTune";
export const SERVICE_FEE_RATE = 0.1; // 10% platform fee

export const GENRES = [
  "Bollywood",
  "Punjabi",
  "Hip-Hop / Rap",
  "Indie",
  "Pop",
  "EDM / Electronic",
  "Rock",
  "Lo-fi",
  "Classical",
  "Folk",
  "Devotional",
  "Ghazal",
  "Haryanvi",
  "Bhojpuri",
  "Tamil",
  "Telugu",
] as const;

export const GOALS = [
  {
    id: "YOUTUBE_VIEWS",
    label: "More YouTube views",
    description: "Push your music video to viewers who watch similar artists",
    platforms: ["GOOGLE"],
  },
  {
    id: "SPOTIFY_STREAMS",
    label: "More Spotify streams",
    description: "Drive listeners straight to your track on Spotify",
    platforms: ["META"],
  },
  {
    id: "INSTAGRAM_FOLLOWERS",
    label: "More Instagram followers",
    description: "Grow your artist profile with real, engaged fans",
    platforms: ["META"],
  },
  {
    id: "VIDEO_REACH",
    label: "Music video reach",
    description: "Maximum eyeballs on your video across YouTube, Instagram & Facebook",
    platforms: ["GOOGLE", "META"],
  },
  {
    id: "EVENT_PROMOTION",
    label: "Event promotion",
    description: "Fill seats for your concert, gig or music festival",
    platforms: ["GOOGLE", "META"],
  },
] as const;

export type GoalId = (typeof GOALS)[number]["id"];

export function goalLabel(id: string) {
  return GOALS.find((g) => g.id === id)?.label ?? id;
}

export const DURATIONS = [7, 14, 30] as const;

export const AGE_RANGES = ["18-24", "25-34", "35-44", "45+", "18-65 (All adults)"] as const;

export const INDIAN_STATES = [
  "Delhi NCR",
  "Maharashtra",
  "Punjab",
  "Uttar Pradesh",
  "Karnataka",
  "Tamil Nadu",
  "Telangana",
  "West Bengal",
  "Gujarat",
  "Rajasthan",
  "Haryana",
  "Kerala",
  "Madhya Pradesh",
  "Bihar",
  "Andhra Pradesh",
  "Assam",
  "Goa",
  "Himachal Pradesh",
  "Jharkhand",
  "Uttarakhand",
] as const;

export const INFLUENCER_CATEGORIES = [
  "Bollywood",
  "Punjabi",
  "Hip-Hop",
  "Indie",
  "EDM",
  "Lo-fi",
  "Devotional",
  "Regional",
  "Playlist Curator",
  "Music Reviewer",
] as const;

export const INFLUENCER_PLATFORMS = [
  { id: "INSTAGRAM", label: "Instagram" },
  { id: "YOUTUBE", label: "YouTube" },
  { id: "SPOTIFY", label: "Spotify" },
] as const;

export function platformLabel(id: string) {
  return INFLUENCER_PLATFORMS.find((p) => p.id === id)?.label ?? id;
}

export const CAMPAIGN_STATUSES = [
  "PENDING_PAYMENT",
  "IN_REVIEW",
  "LIVE",
  "PAUSED",
  "COMPLETED",
  "CANCELLED",
] as const;

export const STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: "Pending payment",
  IN_REVIEW: "In review",
  LIVE: "Live",
  PAUSED: "Paused",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  UNPAID: "Unpaid",
  PAID: "Paid",
  REFUNDED: "Refunded",
};

export function statusLabel(s: string) {
  return STATUS_LABELS[s] ?? s;
}
