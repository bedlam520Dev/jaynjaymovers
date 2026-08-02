export type ServiceType =
  | 'residential'
  | 'commercial'
  | 'long_distance'
  | 'packing'
  | 'storage'
  | 'specialty';

export type HomeSize =
  | 'studio'
  | '1br'
  | '2br'
  | '3br'
  | '4br_plus'
  | 'office'
  | 'custom';

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type QuoteStatus = 'new' | 'responded' | 'converted' | 'archived';

export type Availability = 'open' | 'partial' | 'full' | 'none';

export type PaymentMethod =
  | 'credit_card'
  | 'crypto'
  | 'google_pay'
  | 'apple_pay'
  | 'paypal'
  | 'cashapp'
  | 'zelle';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export type ReviewSource = 'google' | 'yelp' | 'trustadvisor' | 'internal';

export type TimeWindow = '08:00-12:00' | '12:00-16:00' | '16:00-20:00' | '20:00-24:00';

export type AuthProvider = 'email' | 'google' | 'apple';

export interface Profile {
  id: string;
  full_name: string;
  phone: string;
  is_admin: boolean;
  avatar_url: string;
  created_at: string;
}

export interface Booking {
  id: string;
  user_id: string | null;
  service_type: ServiceType;
  home_size: HomeSize;
  moving_date: string;
  time_window: TimeWindow;
  origin_address: string;
  destination_address: string;
  notes: string;
  status: BookingStatus;
  estimated_cost: number;
  crew_size: number;
  created_at: string;
}

export interface QuoteRequest {
  id: string;
  user_id: string | null;
  service_type: ServiceType;
  home_size: HomeSize;
  moving_date: string;
  origin_address: string;
  destination_address: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  notes: string;
  status: QuoteStatus;
  created_at: string;
}

export interface Payment {
  id: string;
  user_id: string | null;
  booking_id: string | null;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  provider_payment_id: string;
  created_at: string;
}

export interface Review {
  id: string;
  source: ReviewSource;
  author_name: string;
  author_avatar: string;
  rating: number;
  text: string;
  external_url: string | null;
  created_at: string;
}

export interface TimeSlot {
  id: string;
  date: string;
  time_window: TimeWindow;
  max_bookings: number;
  current_bookings: number;
  is_available: boolean;
}

export interface ServiceInfo {
  key: ServiceType;
  label: string;
  description: string;
  features: string[];
  basePrice: number;
  icon: string;
}

export interface EstimateBreakdown {
  serviceType: ServiceType;
  homeSize: HomeSize;
  estimatedHours: number;
  crewSize: number;
  laborCost: number;
  truckFee: number;
  additionalFees: number;
  total: number;
  lineItems: { label: string; amount: number }[];
}

export interface FloatingBackgroundAsset {
  src: string;
  alt: string;
  height: number;
  width: number;
  className: string;
  loading: string;
}

export interface FormState {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export type ServiceCard = {
  key: string;
  label: string;
  icon: React.ElementType;
  description: string;
  features: string[];
  priceFrom: number;
  priceLabel: string;
};

export type Stat = {
  value: string;
  label: string;
  icon: React.ElementType;
};

export type Value = {
  title: string;
  description: string;
  icon: React.ElementType;
};

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  image: string;
};
