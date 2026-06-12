import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

type SeedService = {
  title: string;
  description: string;
  platform: "INSTAGRAM" | "YOUTUBE" | "SPOTIFY";
  price: number;
  deliveryDays: number;
};

type SeedInfluencer = {
  name: string;
  handle: string;
  bio: string;
  category: string;
  platforms: string[];
  followers: number;
  engagementRate: number;
  location: string;
  featured?: boolean;
  services: SeedService[];
};

const influencers: SeedInfluencer[] = [
  {
    name: "Riya Malhotra",
    handle: "@riyabeats",
    bio: "Bollywood music curator & reel creator. My audience lives for fresh Hindi tracks — 200+ song promotions delivered with chart-topping results.",
    category: "Bollywood",
    platforms: ["INSTAGRAM", "YOUTUBE"],
    followers: 1250000,
    engagementRate: 4.8,
    location: "Mumbai",
    featured: true,
    services: [
      { title: "Instagram Reel with your song", description: "A trending-style reel using your track as audio, posted on my feed + story for 24h.", platform: "INSTAGRAM", price: 25000, deliveryDays: 4 },
      { title: "Story shoutout (3 frames)", description: "Three story frames with link sticker to your Spotify/YouTube.", platform: "INSTAGRAM", price: 8000, deliveryDays: 2 },
      { title: "YouTube Short feature", description: "60-second short featuring your song with call-to-action.", platform: "YOUTUBE", price: 18000, deliveryDays: 5 },
    ],
  },
  {
    name: "Gurpreet Sandhu",
    handle: "@gurisandhuofficial",
    bio: "Punjabi music promoter from Chandigarh. Bhangra, trap-Punjabi and folk fusion — if it slaps, my 900K family hears it first.",
    category: "Punjabi",
    platforms: ["INSTAGRAM", "YOUTUBE"],
    followers: 920000,
    engagementRate: 5.6,
    location: "Chandigarh",
    featured: true,
    services: [
      { title: "Reel + dance hook challenge", description: "I create a hook-step challenge reel on your track to spark UGC.", platform: "INSTAGRAM", price: 30000, deliveryDays: 5 },
      { title: "Story shoutout", description: "Swipe-up story with your cover art and streaming link.", platform: "INSTAGRAM", price: 6000, deliveryDays: 1 },
      { title: "Full song reaction video", description: "Dedicated YouTube reaction/review video (8-12 min).", platform: "YOUTUBE", price: 22000, deliveryDays: 7 },
    ],
  },
  {
    name: "Aditya Verma",
    handle: "@adivermaraps",
    bio: "Desi hip-hop head. Bars, breakdowns and blow-ups — I've broken 40+ underground artists to the mainstream gully scene.",
    category: "Hip-Hop",
    platforms: ["INSTAGRAM", "YOUTUBE", "SPOTIFY"],
    followers: 640000,
    engagementRate: 6.2,
    location: "Delhi",
    featured: true,
    services: [
      { title: "Track breakdown reel", description: "I break down your bars/production in a 90-second reel.", platform: "INSTAGRAM", price: 15000, deliveryDays: 3 },
      { title: "Desi HH playlist placement (30 days)", description: "Placement on my 'New Desi Heat' Spotify playlist — 85K followers.", platform: "SPOTIFY", price: 12000, deliveryDays: 2 },
      { title: "YouTube cypher feature", description: "Your track featured in my monthly cypher round-up video.", platform: "YOUTUBE", price: 20000, deliveryDays: 10 },
    ],
  },
  {
    name: "Meera Iyer",
    handle: "@meera.acoustics",
    bio: "Indie & singer-songwriter spotlight. Intimate covers, honest reviews, and a fiercely loyal listener base that actually streams.",
    category: "Indie",
    platforms: ["INSTAGRAM", "SPOTIFY"],
    followers: 310000,
    engagementRate: 7.4,
    location: "Bengaluru",
    services: [
      { title: "Acoustic cover of your song", description: "I record a stripped-down cover and tag your original everywhere.", platform: "INSTAGRAM", price: 18000, deliveryDays: 7 },
      { title: "Indie India playlist placement (30 days)", description: "Slot on my 'Indie India' playlist — 40K followers, high save-rate.", platform: "SPOTIFY", price: 8000, deliveryDays: 2 },
      { title: "Story review + link", description: "Honest 2-frame story review with streaming link.", platform: "INSTAGRAM", price: 4000, deliveryDays: 2 },
    ],
  },
  {
    name: "DJ Kabir",
    handle: "@djkabirlive",
    bio: "EDM producer & club DJ. Festival mainstages se Goa sunsets tak — your drop gets played, filmed and posted to 500K ravers.",
    category: "EDM",
    platforms: ["INSTAGRAM", "YOUTUBE"],
    followers: 540000,
    engagementRate: 4.1,
    location: "Goa",
    services: [
      { title: "Club set live-play reel", description: "Your track dropped in my live set, crowd reaction reel posted.", platform: "INSTAGRAM", price: 28000, deliveryDays: 10 },
      { title: "Mix inclusion + tag", description: "Track included in my monthly YouTube mix with timestamped credit.", platform: "YOUTUBE", price: 14000, deliveryDays: 14 },
    ],
  },
  {
    name: "Sana Qureshi",
    handle: "@sanalofi",
    bio: "Lo-fi & chill curator. Study-beats community of night owls; your mellow track becomes their 3am anthem.",
    category: "Lo-fi",
    platforms: ["SPOTIFY", "YOUTUBE", "INSTAGRAM"],
    followers: 280000,
    engagementRate: 5.9,
    location: "Pune",
    services: [
      { title: "Lo-fi Nights playlist placement (30 days)", description: "Placement on 'Lo-fi Nights India' — 60K followers.", platform: "SPOTIFY", price: 7000, deliveryDays: 2 },
      { title: "24/7 radio stream feature", description: "Your track added to my YouTube lo-fi radio rotation for a month.", platform: "YOUTUBE", price: 10000, deliveryDays: 5 },
      { title: "Aesthetic reel with your track", description: "Cozy aesthetic reel using your song as background score.", platform: "INSTAGRAM", price: 6000, deliveryDays: 4 },
    ],
  },
  {
    name: "Pandit Raghav Joshi",
    handle: "@raghav.bhajans",
    bio: "Devotional music channel reaching crores of households. Bhajans, aartis and spiritual fusion — deeply engaged family audience.",
    category: "Devotional",
    platforms: ["YOUTUBE", "INSTAGRAM"],
    followers: 1800000,
    engagementRate: 3.2,
    location: "Varanasi",
    services: [
      { title: "Dedicated YouTube feature", description: "Your devotional track presented to my subscribers with blessing intro.", platform: "YOUTUBE", price: 35000, deliveryDays: 7 },
      { title: "Morning darshan story", description: "Story share during my high-traffic morning slot.", platform: "INSTAGRAM", price: 9000, deliveryDays: 2 },
    ],
  },
  {
    name: "Ankit Chaudhary",
    handle: "@ankit.haryanvi",
    bio: "Haryanvi & desi pop tastemaker. Tractor se Thar tak — my reels make songs village-viral overnight.",
    category: "Regional",
    platforms: ["INSTAGRAM", "YOUTUBE"],
    followers: 760000,
    engagementRate: 6.8,
    location: "Gurugram",
    services: [
      { title: "Desi swag reel", description: "High-energy reel on your track with my signature desi edit.", platform: "INSTAGRAM", price: 16000, deliveryDays: 4 },
      { title: "YouTube community post + short", description: "Short plus community-post poll to drive streams.", platform: "YOUTUBE", price: 9000, deliveryDays: 3 },
    ],
  },
  {
    name: "Lakshmi Subramaniam",
    handle: "@lakshmi.melodies",
    bio: "South Indian music curator — Tamil, Telugu, Malayalam & Kannada releases. Carnatic-trained ears, Gen-Z reach.",
    category: "Regional",
    platforms: ["INSTAGRAM", "SPOTIFY", "YOUTUBE"],
    followers: 480000,
    engagementRate: 5.1,
    location: "Chennai",
    services: [
      { title: "Reel + review (Tamil/Telugu)", description: "Regional-language reel review reaching core South audience.", platform: "INSTAGRAM", price: 13000, deliveryDays: 4 },
      { title: "South Sounds playlist (30 days)", description: "Placement on my 'South Sounds' Spotify playlist — 35K followers.", platform: "SPOTIFY", price: 7500, deliveryDays: 2 },
    ],
  },
  {
    name: "The Playlist Bhai",
    handle: "@playlistbhai",
    bio: "India's playlist plug. 22 genre playlists, 400K combined followers, transparent stats shared after every placement.",
    category: "Playlist Curator",
    platforms: ["SPOTIFY"],
    followers: 400000,
    engagementRate: 2.8,
    location: "Mumbai",
    featured: true,
    services: [
      { title: "Flagship 'Fresh Finds India' (30 days)", description: "120K-follower flagship playlist, average 25K streams per placement.", platform: "SPOTIFY", price: 15000, deliveryDays: 3 },
      { title: "Genre playlist placement (30 days)", description: "Placement on the genre playlist that fits your track best.", platform: "SPOTIFY", price: 6000, deliveryDays: 3 },
      { title: "Playlist bundle — 3 lists (30 days)", description: "Placement across three complementary playlists for maximum streams.", platform: "SPOTIFY", price: 14000, deliveryDays: 3 },
    ],
  },
  {
    name: "Zoya Khan",
    handle: "@zoyareviews",
    bio: "Music reviewer with zero filter. Honest first-listen reactions that fans trust — a feature here moves the needle.",
    category: "Music Reviewer",
    platforms: ["YOUTUBE", "INSTAGRAM"],
    followers: 350000,
    engagementRate: 6.5,
    location: "Hyderabad",
    services: [
      { title: "First-listen reaction video", description: "Unfiltered 10-minute reaction on YouTube with honest review.", platform: "YOUTUBE", price: 17000, deliveryDays: 6 },
      { title: "60-second verdict reel", description: "Quick verdict reel — my most shared format.", platform: "INSTAGRAM", price: 11000, deliveryDays: 3 },
    ],
  },
  {
    name: "Rohan & Beats Crew",
    handle: "@beatscrewindia",
    bio: "Dance crew of 6 choreographing reels for new releases. We made 12 songs trend on Instagram India in the last year.",
    category: "Pop",
    platforms: ["INSTAGRAM", "YOUTUBE"],
    followers: 1100000,
    engagementRate: 5.3,
    location: "Mumbai",
    featured: true,
    services: [
      { title: "Crew choreography reel", description: "Full-crew choreography on your track, shot in 4K studio.", platform: "INSTAGRAM", price: 45000, deliveryDays: 8 },
      { title: "Duo dance reel", description: "Two-member choreo reel — budget-friendly trend starter.", platform: "INSTAGRAM", price: 20000, deliveryDays: 5 },
      { title: "Dance tutorial video", description: "YouTube tutorial of the hook step to fuel the trend.", platform: "YOUTUBE", price: 25000, deliveryDays: 10 },
    ],
  },
];

async function main() {
  console.log("Seeding database…");

  // Clean slate (order matters for FK constraints)
  await prisma.payment.deleteMany();
  await prisma.campaignMetric.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.influencerService.deleteMany();
  await prisma.influencer.deleteMany();
  await prisma.user.deleteMany();

  const adminPass = await bcrypt.hash("Admin@123", 10);
  const demoPass = await bcrypt.hash("Demo@123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Platform Admin",
      email: "admin@amplitune.in",
      passwordHash: adminPass,
      role: "ADMIN",
      phone: "+91 98765 00000",
    },
  });

  const demo = await prisma.user.create({
    data: {
      name: "Arjun Mehta",
      artistName: "Arjun M",
      email: "demo@artist.com",
      passwordHash: demoPass,
      genre: "Indie",
      phone: "+91 98765 43210",
    },
  });

  // Influencers + services
  const createdInfluencers: { id: string; serviceIds: string[] }[] = [];
  for (const inf of influencers) {
    const created = await prisma.influencer.create({
      data: {
        name: inf.name,
        handle: inf.handle,
        bio: inf.bio,
        category: inf.category,
        platforms: inf.platforms.join(","),
        followers: inf.followers,
        engagementRate: inf.engagementRate,
        location: inf.location,
        featured: inf.featured ?? false,
        startingPrice: Math.min(...inf.services.map((s) => s.price)),
        services: { create: inf.services },
      },
      include: { services: true },
    });
    createdInfluencers.push({ id: created.id, serviceIds: created.services.map((s) => s.id) });
  }

  // Demo campaigns for the artist account
  const day = 86400000;
  const now = Date.now();

  const live = await prisma.campaign.create({
    data: {
      userId: demo.id,
      songName: "Raat Ki Baat",
      artistName: "Arjun M",
      genre: "Indie",
      trackUrl: "https://open.spotify.com/track/demo1",
      description: "Dreamy indie single about late-night conversations.",
      goal: "SPOTIFY_STREAMS",
      adPlatforms: "META",
      dailyBudget: 800,
      durationDays: 14,
      totalBudget: 11200,
      serviceFee: 1120,
      totalAmount: 12320,
      targetStates: "Maharashtra,Delhi NCR,Karnataka",
      ageRange: "18-24",
      similarArtists: "Prateek Kuhad, Anuv Jain",
      status: "LIVE",
      startedAt: new Date(now - 6 * day),
      endsAt: new Date(now + 8 * day),
    },
  });

  const completed = await prisma.campaign.create({
    data: {
      userId: demo.id,
      songName: "Monsoon Mashup",
      artistName: "Arjun M",
      genre: "Indie",
      trackUrl: "https://youtube.com/watch?v=demo2",
      goal: "YOUTUBE_VIEWS",
      adPlatforms: "GOOGLE",
      dailyBudget: 500,
      durationDays: 7,
      totalBudget: 3500,
      serviceFee: 350,
      totalAmount: 3850,
      targetStates: "ALL_INDIA",
      ageRange: "18-65 (All adults)",
      status: "COMPLETED",
      startedAt: new Date(now - 20 * day),
      endsAt: new Date(now - 13 * day),
    },
  });

  const inReview = await prisma.campaign.create({
    data: {
      userId: demo.id,
      songName: "City Lights (feat. Naina)",
      artistName: "Arjun M",
      genre: "Pop",
      trackUrl: "https://open.spotify.com/track/demo3",
      goal: "VIDEO_REACH",
      adPlatforms: "GOOGLE,META",
      dailyBudget: 1200,
      durationDays: 30,
      totalBudget: 36000,
      serviceFee: 3600,
      totalAmount: 39600,
      targetStates: "Maharashtra,Gujarat,Rajasthan",
      ageRange: "25-34",
      status: "IN_REVIEW",
    },
  });

  await prisma.payment.createMany({
    data: [
      { userId: demo.id, campaignId: live.id, amount: live.totalAmount, method: "UPI", reference: "pay_SEEDLIVE001AB", createdAt: new Date(now - 6 * day) },
      { userId: demo.id, campaignId: completed.id, amount: completed.totalAmount, method: "CARD", reference: "pay_SEEDDONE002CD", createdAt: new Date(now - 20 * day) },
      { userId: demo.id, campaignId: inReview.id, amount: inReview.totalAmount, method: "UPI", reference: "pay_SEEDREVW003EF", createdAt: new Date(now - 1 * day) },
    ],
  });

  // Demo bookings (hire requests) for the artist account
  const inf0 = createdInfluencers[0]; // Riya — Bollywood
  const inf3 = createdInfluencers[3]; // Meera — Indie
  const inf9 = createdInfluencers[9]; // Playlist Bhai

  const b1 = await prisma.booking.create({
    data: {
      userId: demo.id,
      influencerId: inf3.id,
      serviceId: inf3.serviceIds[1],
      serviceTitle: "Indie India playlist placement (30 days)",
      servicePlatform: "SPOTIFY",
      songName: "Raat Ki Baat",
      trackUrl: "https://open.spotify.com/track/demo1",
      message: "Would love a spot on Indie India — track is performing well organically.",
      amount: 8000,
      status: "ACCEPTED",
      paymentStatus: "PAID",
      createdAt: new Date(now - 4 * day),
    },
  });
  await prisma.payment.create({
    data: { userId: demo.id, bookingId: b1.id, amount: 8000, method: "UPI", reference: "pay_SEEDBOOK004GH", createdAt: new Date(now - 4 * day) },
  });

  await prisma.booking.create({
    data: {
      userId: demo.id,
      influencerId: inf9.id,
      serviceId: inf9.serviceIds[0],
      serviceTitle: "Flagship 'Fresh Finds India' (30 days)",
      servicePlatform: "SPOTIFY",
      songName: "City Lights (feat. Naina)",
      trackUrl: "https://open.spotify.com/track/demo3",
      message: "New pop single dropping next Friday — want playlist support at launch.",
      amount: 15000,
      status: "PENDING",
      paymentStatus: "UNPAID",
      createdAt: new Date(now - 1 * day),
    },
  });

  const b3 = await prisma.booking.create({
    data: {
      userId: demo.id,
      influencerId: inf0.id,
      serviceId: inf0.serviceIds[1],
      serviceTitle: "Story shoutout (3 frames)",
      servicePlatform: "INSTAGRAM",
      songName: "Monsoon Mashup",
      amount: 8000,
      status: "COMPLETED",
      paymentStatus: "PAID",
      createdAt: new Date(now - 15 * day),
    },
  });
  await prisma.payment.create({
    data: { userId: demo.id, bookingId: b3.id, amount: 8000, method: "CARD", reference: "pay_SEEDBOOK005IJ", createdAt: new Date(now - 15 * day) },
  });

  console.log(`Seeded: admin=${admin.email}, demo artist=${demo.email}, ${influencers.length} influencers`);
  console.log("Login → admin@amplitune.in / Admin@123  |  demo@artist.com / Demo@123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
