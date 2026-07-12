export type Review = {
  id: string;
  reviewer: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
  source: "google";
  status: "pending" | "approved" | "posted";
  generatedReply?: string;
  business: string;
  category: string;
};

export const MOCK_REVIEWS: Review[] = [
  {
    id: "r1",
    reviewer: "James Liu",
    avatar: "JL",
    rating: 4,
    text: "Food was absolutely incredible — the pasta melted in my mouth. Service was a bit slow on a Friday night but totally understandable given how busy it was. Will definitely be back for date night!",
    date: "2 hours ago",
    source: "google",
    status: "pending",
    business: "Bella Cucina Restaurant",
    category: "restaurant",
  },
  {
    id: "r2",
    reviewer: "Sarah K.",
    avatar: "SK",
    rating: 5,
    text: "Best dental experience I've ever had! Dr. Marcus and the entire team made me feel so comfortable. The waiting room is clean, modern, and they were on time. My teeth have never looked better.",
    date: "5 hours ago",
    source: "google",
    status: "pending",
    business: "Bright Smile Dental",
    category: "dental",
  },
  {
    id: "r3",
    reviewer: "Mike R.",
    avatar: "MR",
    rating: 2,
    text: "Disappointed with my visit. Waited 45 minutes past my appointment time with no explanation. The actual haircut was fine but the lack of communication and respect for my time was frustrating.",
    date: "1 day ago",
    source: "google",
    status: "pending",
    business: "Luxe Salon",
    category: "salon",
  },
  {
    id: "r4",
    reviewer: "Priya M.",
    avatar: "PM",
    rating: 5,
    text: "Absolutely amazing place! I've been coming here for 3 years and the quality never drops. The new seasonal menu is incredible — the truffle risotto is a must-try. Staff always remember my name.",
    date: "2 days ago",
    source: "google",
    status: "pending",
    business: "Bella Cucina Restaurant",
    category: "restaurant",
  },
  {
    id: "r5",
    reviewer: "Tom W.",
    avatar: "TW",
    rating: 3,
    text: "Good salon overall. The haircut was decent but not exactly what I asked for. Price is a bit high for the area. Might try somewhere else next time unless things improve.",
    date: "3 days ago",
    source: "google",
    status: "pending",
    business: "Luxe Salon",
    category: "salon",
  },
  {
    id: "r6",
    reviewer: "Aisha N.",
    avatar: "AN",
    rating: 5,
    text: "Dr. Marcus fixed a dental emergency for me on short notice. I was in severe pain and they fit me in same day. Professional, gentle, and affordable. I can't recommend this place enough!",
    date: "4 days ago",
    source: "google",
    status: "approved",
    generatedReply:
      "Hi Aisha, thank you so much for sharing your experience! Dental emergencies are stressful and we're so glad we could get you in quickly and provide relief. Your kind words mean everything to our team. We look forward to seeing you for your regular care!",
    business: "Bright Smile Dental",
    category: "dental",
  },
];

export const BUSINESSES = [
  { id: "b1", name: "Bella Cucina Restaurant", category: "restaurant", pendingCount: 2, totalReviews: 142, avgRating: 4.6 },
  { id: "b2", name: "Bright Smile Dental", category: "dental", pendingCount: 1, totalReviews: 89, avgRating: 4.9 },
  { id: "b3", name: "Luxe Salon", category: "salon", pendingCount: 2, totalReviews: 203, avgRating: 4.1 },
];
