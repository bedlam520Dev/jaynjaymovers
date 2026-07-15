import type { Booking, QuoteRequest, Payment, Review, TimeSlot, EstimateBreakdown, ServiceType, HomeSize } from "@/types";
import { PRICING } from "@/lib/constants";

export const USE_MOCK_DATA =
  process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

export const MOCK_REVIEWS: Review[] = [
  {
    id: "mock-rv-001",
    source: "google",
    author_name: "Sarah Mitchell",
    author_avatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop",
    rating: 5,
    text: "Summit Movers made our cross-country move stress-free. The crew was professional, careful with our furniture, and completed the job ahead of schedule. Highly recommend!",
    external_url: "https://google.com/maps",
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "mock-rv-002",
    source: "google",
    author_name: "James Chen",
    author_avatar:
      "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop",
    rating: 5,
    text: "Best moving experience I have ever had. Punctual, friendly, and they treated our belongings like their own. The scheduling process was seamless.",
    external_url: "https://google.com/maps",
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: "mock-rv-003",
    source: "yelp",
    author_name: "Maria Rodriguez",
    author_avatar:
      "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop",
    rating: 4,
    text: "Great service overall. The team was efficient and professional. They handled our piano with extra care. Only minor delay in arrival but they communicated well.",
    external_url: "https://yelp.com",
    created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
  {
    id: "mock-rv-004",
    source: "yelp",
    author_name: "David Thompson",
    author_avatar:
      "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop",
    rating: 5,
    text: "I have used Summit Movers twice now and both times were excellent. Fair pricing, no hidden fees, and the crew is always top-notch. Will use them again.",
    external_url: "https://yelp.com",
    created_at: new Date(Date.now() - 21 * 86400000).toISOString(),
  },
  {
    id: "mock-rv-005",
    source: "google",
    author_name: "Emily Watson",
    author_avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop",
    rating: 5,
    text: "From the quote to the final box placed in our new home, everything was perfect. The online scheduling tool made booking so easy. Five stars!",
    external_url: "https://google.com/maps",
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: "mock-rv-006",
    source: "trustadvisor",
    author_name: "Michael OBrien",
    author_avatar:
      "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop",
    rating: 5,
    text: "Moved our 4-bedroom house in under 8 hours. The crew of four was incredibly organized and worked non-stop. Worth every penny.",
    external_url: "https://trustadvisor.com",
    created_at: new Date(Date.now() - 35 * 86400000).toISOString(),
  },
  {
    id: "mock-rv-007",
    source: "internal",
    author_name: "Jennifer Park",
    author_avatar:
      "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop",
    rating: 5,
    text: "The whole process was transparent and easy. I loved being able to track my move and pay online. The team was courteous and fast.",
    external_url: null,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "mock-rv-008",
    source: "google",
    author_name: "Robert Lewis",
    author_avatar:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop",
    rating: 4,
    text: "Solid moving company. Good communication, careful with fragile items, and reasonable rates. Would recommend to friends and family.",
    external_url: "https://google.com/maps",
    created_at: new Date(Date.now() - 42 * 86400000).toISOString(),
  },
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: "mock-bk-001",
    user_id: null,
    service_type: "residential",
    home_size: "3br",
    moving_date: new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0],
    time_window: "08:00-12:00",
    origin_address: "123 Oak Street, Springfield, IL",
    destination_address: "456 Maple Ave, Springfield, IL",
    notes: "3rd floor apartment, needs elevator reservation",
    status: "confirmed",
    estimated_cost: 2400,
    crew_size: 3,
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: "mock-bk-002",
    user_id: null,
    service_type: "long_distance",
    home_size: "2br",
    moving_date: new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0],
    time_window: "08:00-12:00",
    origin_address: "789 Pine Rd, Chicago, IL",
    destination_address: "321 Cedar Ln, Milwaukee, WI",
    notes: "Long distance move, ~90 miles",
    status: "confirmed",
    estimated_cost: 3800,
    crew_size: 3,
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: "mock-bk-003",
    user_id: null,
    service_type: "commercial",
    home_size: "office",
    moving_date: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
    time_window: "12:00-16:00",
    origin_address: "500 Business Park Dr, Naperville, IL",
    destination_address: "200 Commerce Way, Aurora, IL",
    notes: "Office relocation - 15 workstations, conference furniture",
    status: "pending",
    estimated_cost: 5200,
    crew_size: 4,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "mock-bk-004",
    user_id: null,
    service_type: "residential",
    home_size: "1br",
    moving_date: new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0],
    time_window: "16:00-20:00",
    origin_address: "55 Elm St, Joliet, IL",
    destination_address: "88 Birch Blvd, Joliet, IL",
    notes: "Studio apartment, minimal furniture",
    status: "confirmed",
    estimated_cost: 900,
    crew_size: 2,
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "mock-bk-005",
    user_id: null,
    service_type: "packing",
    home_size: "2br",
    moving_date: new Date(Date.now() + 1 * 86400000).toISOString().split("T")[0],
    time_window: "08:00-12:00",
    origin_address: "300 Grove St, Springfield, IL",
    destination_address: "300 Grove St, Springfield, IL",
    notes: "Packing service only - full pack",
    status: "in_progress",
    estimated_cost: 650,
    crew_size: 2,
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: "mock-bk-006",
    user_id: null,
    service_type: "residential",
    home_size: "4br_plus",
    moving_date: new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0],
    time_window: "08:00-12:00",
    origin_address: "700 River Rd, Peoria, IL",
    destination_address: "900 Lake Dr, Bloomington, IL",
    notes: "Large family home, 4 bedrooms plus basement",
    status: "completed",
    estimated_cost: 4100,
    crew_size: 4,
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
];

export const MOCK_QUOTE_REQUESTS: QuoteRequest[] = [
  {
    id: "mock-qr-001",
    user_id: null,
    service_type: "residential",
    home_size: "2br",
    moving_date: new Date(Date.now() + 10 * 86400000).toISOString().split("T")[0],
    origin_address: "123 Oak Street, Springfield, IL",
    destination_address: "456 Maple Ave, Springfield, IL",
    contact_name: "Sarah Mitchell",
    contact_phone: "217-555-0101",
    contact_email: "sarah.mitchell@email.com",
    notes: "Need help with heavy furniture",
    status: "new",
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: "mock-qr-002",
    user_id: null,
    service_type: "long_distance",
    home_size: "3br",
    moving_date: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
    origin_address: "789 Pine Rd, Chicago, IL",
    destination_address: "321 Cedar Ln, Milwaukee, WI",
    contact_name: "James Chen",
    contact_phone: "312-555-0102",
    contact_email: "jchen@email.com",
    notes: "Cross-state move, flexible on dates",
    status: "responded",
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "mock-qr-003",
    user_id: null,
    service_type: "commercial",
    home_size: "office",
    moving_date: new Date(Date.now() + 21 * 86400000).toISOString().split("T")[0],
    origin_address: "500 Business Park Dr, Naperville, IL",
    destination_address: "200 Commerce Way, Aurora, IL",
    contact_name: "Maria Rodriguez",
    contact_phone: "630-555-0103",
    contact_email: "mrodriguez@email.com",
    notes: "15 workstations, 2 conference rooms",
    status: "new",
    created_at: new Date(Date.now() - 12 * 3600000).toISOString(),
  },
  {
    id: "mock-qr-004",
    user_id: null,
    service_type: "residential",
    home_size: "studio",
    moving_date: new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0],
    origin_address: "55 Elm St, Joliet, IL",
    destination_address: "88 Birch Blvd, Joliet, IL",
    contact_name: "David Thompson",
    contact_phone: "815-555-0104",
    contact_email: "dthompson@email.com",
    notes: "Minimal items, just bed and desk",
    status: "converted",
    created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
  },
];

export const MOCK_PAYMENTS: Payment[] = [
  {
    id: "mock-pay-001",
    user_id: null,
    booking_id: "mock-bk-006",
    amount: 4100,
    method: "stripe",
    status: "completed",
    provider_payment_id: "pi_mock_001",
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: "mock-pay-002",
    user_id: null,
    booking_id: "mock-bk-004",
    amount: 900,
    method: "paypal",
    status: "completed",
    provider_payment_id: "PAYID-MOCK002",
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "mock-pay-003",
    user_id: null,
    booking_id: "mock-bk-001",
    amount: 1200,
    method: "applepay",
    status: "pending",
    provider_payment_id: "ap_mock_004",
    created_at: new Date(Date.now() - 6 * 3600000).toISOString(),
  },
  {
    id: "mock-pay-004",
    user_id: null,
    booking_id: null,
    amount: 650,
    method: "cashapp",
    status: "completed",
    provider_payment_id: "CA-MOCK003",
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

export function generateMockTimeSlots(): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const windows: TimeSlot["time_window"][] = ["08:00-12:00", "12:00-16:00", "16:00-20:00"];
  for (let d = 0; d < 30; d++) {
    const date = new Date(Date.now() + d * 86400000).toISOString().split("T")[0];
    for (const w of windows) {
      slots.push({
        id: `mock-ts-${d}-${w}`,
        date,
        time_window: w,
        max_bookings: 2,
        current_bookings: Math.random() > 0.7 ? 1 : 0,
        is_available: true,
      });
    }
  }
  return slots;
}

export function calculateEstimate(
  serviceType: ServiceType,
  homeSize: HomeSize,
): EstimateBreakdown {
  const multiplier = PRICING.sizeMultipliers[homeSize] ?? 1;
  const crewSize = PRICING.crewSizes[homeSize] ?? 3;
  const estimatedHours = Math.round(4 * multiplier * 2) / 2;
  const laborCost = PRICING.baseHourly * estimatedHours;
  const truckFee = PRICING.truckFee;
  const lineItems: { label: string; amount: number }[] = [
    { label: `Crew labor (${crewSize} movers, ${estimatedHours}h)`, amount: laborCost },
    { label: "Truck & equipment", amount: truckFee },
  ];
  let additionalFees = 0;
  if (serviceType === "long_distance") {
    const mileage = 50;
    const mileageFee = PRICING.longDistancePerMile * mileage;
    additionalFees += mileageFee;
    lineItems.push({ label: `Long distance (${mileage} mi)`, amount: mileageFee });
  }
  if (serviceType === "packing") {
    const roomCount: Record<string, number> = {
      studio: 1, "1br": 1, "2br": 2, "3br": 3, "4br_plus": 4, office: 3, custom: 2,
    };
    const rooms = roomCount[homeSize] ?? 2;
    const packingFee = PRICING.packingPerRoom * rooms;
    additionalFees += packingFee;
    lineItems.push({ label: `Packing (${rooms} rooms)`, amount: packingFee });
  }
  if (serviceType === "storage") {
    additionalFees += PRICING.storagePerMonth;
    lineItems.push({ label: "Storage (1 month)", amount: PRICING.storagePerMonth });
  }
  if (serviceType === "specialty") {
    const itemCount: Record<string, number> = {
      studio: 1, "1br": 1, "2br": 2, "3br": 2, "4br_plus": 3, office: 2, custom: 2,
    };
    const items = itemCount[homeSize] ?? 2;
    const specialtyFee = PRICING.specialtyItemFee * items;
    additionalFees += specialtyFee;
    lineItems.push({ label: `Specialty items (${items})`, amount: specialtyFee });
  }
  const total = laborCost + truckFee + additionalFees;
  return {
    serviceType,
    homeSize,
    estimatedHours,
    crewSize,
    laborCost,
    truckFee,
    additionalFees,
    total,
    lineItems,
  };
}
