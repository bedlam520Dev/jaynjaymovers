export const SITE = {
  name: "Summit Movers",
  url: "https://summitmovers.com",
  description:
    "Professional moving services for residential and commercial clients. Local and long distance. Licensed, bonded, and insured.",
  tagline: "Moving made simple, stress-free, and seamless.",
  phone: "(217) 555-0199",
  email: "hello@summitmovers.com",
  address: "Springfield, IL — Serving the Midwest",
  license: "IL MC# 892341",
  social: {
    facebook: "https://facebook.com/summitmovers",
    instagram: "https://instagram.com/summitmovers",
    twitter: "https://twitter.com/summitmovers",
  },
} as const;

export const SERVICE_LABELS: Record<string, string> = {
  residential: "Residential Move",
  commercial: "Commercial Move",
  long_distance: "Long Distance Move",
  packing: "Packing Service",
  storage: "Storage Solutions",
  specialty: "Specialty Items",
};

export const HOME_SIZE_LABELS: Record<string, string> = {
  studio: "Studio / Apartment",
  "1br": "1 Bedroom",
  "2br": "2 Bedroom",
  "3br": "3 Bedroom",
  "4br_plus": "4+ Bedroom / House",
  office: "Office Space",
  custom: "Custom / Other",
};

export const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
  new: "New",
  responded: "Responded",
  converted: "Converted",
  archived: "Archived",
};

export const STATUS_VARIANTS: Record<
  string,
  "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "accent"
> = {
  pending: "warning",
  confirmed: "success",
  in_progress: "default",
  completed: "secondary",
  cancelled: "destructive",
  new: "accent",
  responded: "default",
  converted: "success",
  archived: "secondary",
};

export const REVIEW_SOURCE_LABELS: Record<string, string> = {
  google: "Google",
  yelp: "Yelp",
  trustadvisor: "Trust Advisor",
  internal: "On Our Site",
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  stripe: "Credit Card (Stripe)",
  paypal: "PayPal / Venmo",
  cashapp: "Cash App Pay",
  googlepay: "Google Pay",
  applepay: "Apple Pay",
  zelle: "Zelle",
  crypto: "Crypto (via Stripe)",
  cash: "Cash",
  check: "Check",
};

export const PRICING = {
  baseHourly: 145,
  truckFee: 200,
  longDistancePerMile: 2.5,
  packingPerRoom: 120,
  storagePerMonth: 250,
  specialtyItemFee: 150,
  sizeMultipliers: {
    studio: 0.5,
    "1br": 0.75,
    "2br": 1,
    "3br": 1.5,
    "4br_plus": 2,
    office: 1.75,
    custom: 1,
  },
  crewSizes: {
    studio: 2,
    "1br": 2,
    "2br": 3,
    "3br": 3,
    "4br_plus": 4,
    office: 4,
    custom: 3,
  },
} as const;

export const NAV_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Get a Quote", href: "/quote" },
  { label: "Schedule", href: "/schedule" },
  { label: "Reviews", href: "/reviews" },
  { label: "About", href: "/about" },
] as const;
