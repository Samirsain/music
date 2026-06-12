// Shared client/server view types

export type CampaignTotals = {
  impressions: number;
  clicks: number;
  views: number;
  spend: number;
};

export type Campaign = {
  id: string;
  songName: string;
  artistName: string;
  genre: string;
  releaseDate: string | null;
  trackUrl: string | null;
  coverArtUrl: string | null;
  description: string | null;
  goal: string;
  adPlatforms: string;
  dailyBudget: number;
  durationDays: number;
  totalBudget: number;
  serviceFee: number;
  totalAmount: number;
  targetStates: string;
  ageRange: string;
  similarArtists: string | null;
  status: string;
  startedAt: string | null;
  endsAt: string | null;
  createdAt: string;
  totals?: CampaignTotals;
};

export type CampaignMetric = {
  id: string;
  date: string;
  impressions: number;
  clicks: number;
  views: number;
  spend: number;
};

export type InfluencerService = {
  id: string;
  title: string;
  description: string;
  platform: string;
  price: number;
  deliveryDays: number;
};

export type Influencer = {
  id: string;
  name: string;
  handle: string;
  bio: string;
  category: string;
  platforms: string[];
  followers: number;
  engagementRate: number;
  location: string | null;
  imageUrl: string | null;
  featured: boolean;
  active: boolean;
  startingPrice: number;
  serviceCount?: number;
  hireCount?: number;
  services?: InfluencerService[];
};

export type Booking = {
  id: string;
  influencerId: string;
  serviceId: string | null;
  serviceTitle: string;
  servicePlatform: string;
  songName: string;
  trackUrl: string | null;
  message: string | null;
  preferredDate: string | null;
  amount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  influencer?: {
    id: string;
    name: string;
    handle: string;
    category?: string;
    imageUrl?: string | null;
  };
};
