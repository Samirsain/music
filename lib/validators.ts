import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(80),
  artistName: z.string().max(80).optional().or(z.literal("")),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters").max(100),
  genre: z.string().max(40).optional().or(z.literal("")),
  phone: z.string().max(15).optional().or(z.literal("")),
});

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const profileSchema = z.object({
  name: z.string().min(2).max(80),
  artistName: z.string().max(80).optional().or(z.literal("")),
  genre: z.string().max(40).optional().or(z.literal("")),
  phone: z.string().max(15).optional().or(z.literal("")),
});

export const campaignSchema = z.object({
  songName: z.string().min(1, "Song name is required").max(120),
  artistName: z.string().min(1, "Artist name is required").max(80),
  genre: z.string().min(1, "Pick a genre"),
  releaseDate: z.string().optional().or(z.literal("")),
  trackUrl: z.string().url("Enter a valid link").optional().or(z.literal("")),
  coverArtUrl: z.string().url().optional().or(z.literal("")),
  description: z.string().max(500).optional().or(z.literal("")),
  goal: z.enum([
    "YOUTUBE_VIEWS",
    "SPOTIFY_STREAMS",
    "INSTAGRAM_FOLLOWERS",
    "VIDEO_REACH",
    "EVENT_PROMOTION",
  ]),
  dailyBudget: z.number().int().min(200, "Minimum daily budget is ₹200").max(50000),
  durationDays: z.union([z.literal(7), z.literal(14), z.literal(30)]),
  targetStates: z.array(z.string()).min(1, "Pick at least one state or All India"),
  ageRange: z.string().min(1, "Pick an age range"),
  similarArtists: z.string().max(200).optional().or(z.literal("")),
});

export type CampaignInput = z.infer<typeof campaignSchema>;

export const bookingSchema = z.object({
  influencerId: z.string().min(1),
  serviceId: z.string().min(1),
  songName: z.string().min(1, "Song name is required").max(120),
  trackUrl: z.string().url("Enter a valid link").optional().or(z.literal("")),
  message: z.string().max(600).optional().or(z.literal("")),
  preferredDate: z.string().optional().or(z.literal("")),
});

const serviceSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, "Service title required").max(100),
  description: z.string().max(300).optional().or(z.literal("")),
  platform: z.enum(["INSTAGRAM", "YOUTUBE", "SPOTIFY"]),
  price: z.number().int().min(100, "Minimum price is ₹100").max(10000000),
  deliveryDays: z.number().int().min(1).max(60),
});

export const influencerSchema = z.object({
  name: z.string().min(2, "Name required").max(80),
  handle: z.string().min(1, "Handle required").max(60),
  bio: z.string().min(1, "Bio required").max(500),
  category: z.string().min(1, "Category required"),
  platforms: z.array(z.enum(["INSTAGRAM", "YOUTUBE", "SPOTIFY"])).min(1, "Pick at least one platform"),
  followers: z.number().int().min(0),
  engagementRate: z.number().min(0).max(100),
  location: z.string().max(80).optional().or(z.literal("")),
  imageUrl: z.string().url().optional().or(z.literal("")),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
  services: z.array(serviceSchema).min(1, "Add at least one service"),
});

export type InfluencerInput = z.infer<typeof influencerSchema>;

export const paySchema = z.object({
  method: z.enum(["UPI", "CARD", "NETBANKING"]),
});
