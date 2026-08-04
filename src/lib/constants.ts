import {
  FloatingBackgroundAsset,
  FormState,
  ServiceCard,
  TimeWindow,
  ServiceType,
  HomeSize,
  Stat,
  Value,
  TeamMember,
} from '@/types';
import {
  Home,
  Truck,
  Home as HomeIcon,
  Building,
  Package,
  Boxes,
  Warehouse,
  Star,
  Clock,
  Users,
  CheckCircle2,
  Quote,
  Calendar,
  ShieldCheck,
  Tag,
  Sun,
  Sunset,
  Moon,
  MoonStar,
  HeartHandshake,
  Building2,
  TrendingUp,
  MapPin,
  type LucideIcon,
} from 'lucide-react';

const getBaseUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_BASE_URL;

  if (!url) {
    const currentEnv = process.env.NODE_ENV || 'development';
    throw new Error(
      `⚠️ NEXT_PUBLIC_BASE_URL is missing in your .env.${currentEnv} configuration!`
    );
  }

  return url;
};

export const BASE_URL = getBaseUrl();

export const SITE = {
  name: 'Jay `N Jay Movers',
  short_name: 'Jay `N Jay Movers',
  url: BASE_URL,
  description:
    'Professional moving services for residential and commercial clients. Local and long distance. Licensed, bonded, and insured.',
  tagline: 'Moving made simple, stress-free, and seamless.',
  phone: '(971) 304-8913',
  email: 'info@jaynjaymovers.com',
  address: 'Salem, OR',
  license: 'OR MC# 000420',
  social: {
    facebook: 'https://facebook.com/jaynjaymovers',
    instagram: 'https://instagram.com/jaynjaymovers',
    twitter: 'https://twitter.com/jaynjaymovers',
    tiktok: 'https://tiktok.com/jaynjaymovers',
  },
  author: [{ name: 'BEDLAM520 Development', url: 'https://github.com/bedlam520Dev' }],
} as const;

export const LOGO = {
  alt: "Jay 'N Jay Movers Logo",
  src: '/img/logo.svg',
  height: 980,
  width: 985,
  loading: 'eager',
} as const;

export const BANNER_LIGHT = {
  alt: "Jay 'N Jay Movers",
  src: '/bg/navbar-l.svg',
  height: 400,
  width: 1920,
  loading: 'eager',
} as const;

export const BANNER_DARK = {
  alt: "Jay 'N Jay Movers",
  src: '/bg/navbar-d.svg',
  height: 400,
  width: 1920,
  loading: 'eager',
} as const;

export const HERO_IMAGE = {
  alt: 'Professional movers loading furniture into a moving truck',
  src: '/img/img1.png',
  height: 404,
  width: 303,
  loading: 'eager',
} as const;

export const SIGNUP_IMAGE = {
  alt: 'Movers carefully carrying furniture',
  src: '/img/img2.png',
  height: 414,
  width: 736,
  loading: 'eager',
} as const;

export const HERO_FLOATING_IMAGES: FloatingBackgroundAsset[] = [
  {
    src: '/bg/bg1.png',
    alt: 'Background Floating Image 1',
    height: 960,
    width: 540,
    className: 'h-64 w-64 blur-sm',
    loading: 'eager',
  },
  {
    src: '/bg/bg2.png',
    alt: 'Background Floating Image 2',
    height: 780,
    width: 520,
    className: 'h-64 w-64 blur-sm',
    loading: 'eager',
  },
  {
    src: '/bg/bg3.png',
    alt: 'Background Floating Image 3',
    height: 628,
    width: 941,
    className: 'h-64 w-64 blur-sm',
    loading: 'eager',
  },
  {
    src: '/bg/bg4.png',
    alt: 'Background Floating Image 4',
    height: 990,
    width: 660,
    className: 'h-64 w-64 blur-sm',
    loading: 'eager',
  },
  {
    src: '/bg/bg5.png',
    alt: 'Background Floating Image 5',
    height: 990,
    width: 660,
    className: 'h-64 w-64 blur-sm',
    loading: 'eager',
  },
  {
    src: '/bg/bg6.png',
    alt: 'Background Floating Image 6',
    height: 782,
    width: 521,
    className: 'h-64 w-64 blur-sm',
    loading: 'eager',
  },
  {
    src: '/bg/bg7.png',
    alt: 'Background Floating Image 7',
    height: 500,
    width: 749,
    className: 'h-64 w-64 blur-sm',
    loading: 'eager',
  },
  {
    src: '/bg/bg8.png',
    alt: 'Background Floating Image 8',
    height: 720,
    width: 480,
    className: 'h-64 w-64 blur-sm',
    loading: 'eager',
  },
  {
    src: '/bg/bg9.png',
    alt: 'Background Floating Image 9',
    height: 990,
    width: 660,
    className: 'h-64 w-64 blur-sm',
    loading: 'eager',
  },
];

export const SERVICE_LABELS: Record<string, string> = {
  residential: 'Residential Move',
  commercial: 'Commercial Move',
  long_distance: 'Long Distance Move',
  packing: 'Packing Service',
  storage: 'Storage Solutions',
  specialty: 'Specialty Items',
};

export const HOME_SIZE_LABELS: Record<string, string> = {
  studio: 'Studio / Apartment',
  '1br': '1 Bedroom',
  '2br': '2 Bedroom',
  '3br': '3 Bedroom',
  '4br_plus': '4+ Bedroom / House',
  office: 'Office Space',
  custom: 'Custom / Other',
};

export const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  new: 'New',
  responded: 'Responded',
  converted: 'Converted',
  archived: 'Archived',
};

export const STATUS_VARIANTS: Record<
  string,
  'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'accent'
> = {
  pending: 'warning',
  confirmed: 'success',
  in_progress: 'default',
  completed: 'secondary',
  cancelled: 'destructive',
  new: 'accent',
  responded: 'default',
  converted: 'success',
  archived: 'secondary',
};

export const REVIEW_SOURCE_LABELS: Record<string, string> = {
  google: 'Google',
  yelp: 'Yelp',
  trustadvisor: 'Trust Advisor',
  internal: 'On Our Site',
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  stripe: 'Credit Card (Stripe)',
  paypal: 'PayPal / Venmo',
  cashapp: 'Cash App Pay',
  googlepay: 'Google Pay',
  applepay: 'Apple Pay',
  zelle: 'Zelle',
  crypto: 'Crypto (via Stripe)',
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
    '1br': 0.75,
    '2br': 1,
    '3br': 1.5,
    '4br_plus': 2,
    office: 1.75,
    custom: 1,
  },
  crewSizes: {
    studio: 2,
    '1br': 2,
    '2br': 3,
    '3br': 3,
    '4br_plus': 4,
    office: 4,
    custom: 3,
  },
} as const;

export const NAV_LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'Get a Quote', href: '/quote' },
  { label: 'Schedule', href: '/schedule' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'About', href: '/about' },
] as const;

export const STATS = [
  { icon: Users, value: '2,500+', label: 'Happy Customers' },
  { icon: Truck, value: '15', label: 'Trucks in Fleet' },
  { icon: Star, value: '4.9/5', label: 'Average Rating' },
  { icon: Clock, value: '12 yrs', label: 'Experience' },
];

export const SERVICES = [
  {
    icon: HomeIcon,
    key: 'residential' as const,
    title: SERVICE_LABELS.residential,
    description:
      'Full-service residential moves for apartments, condos, and houses of any size. Careful, efficient, and friendly.',
    price: PRICING.baseHourly,
    features: [
      'Furniture disassembly & reassembly',
      'Free wardrobe boxes',
      'Floor & wall protection',
    ],
  },
  {
    icon: Building,
    key: 'commercial' as const,
    title: SERVICE_LABELS.commercial,
    description:
      'Minimize downtime with our office and commercial relocation services. We work nights and weekends to keep you running.',
    price: PRICING.baseHourly,
    features: [
      'After-hours availability',
      'IT equipment handling',
      'Workstation setup',
    ],
  },
  {
    icon: Truck,
    key: 'long_distance' as const,
    title: SERVICE_LABELS.long_distance,
    description:
      'Statewide and cross-country moves with GPS-tracked trucks and guaranteed delivery windows.',
    price: PRICING.longDistancePerMile,
    features: [
      'GPS shipment tracking',
      'Guaranteed delivery window',
      'Dedicated move coordinator',
    ],
  },
  {
    icon: Package,
    key: 'packing' as const,
    title: SERVICE_LABELS.packing,
    description:
      'Professional packing and unpacking so your valuables arrive safe. Materials and labor included.',
    price: PRICING.packingPerRoom,
    features: ['Pro-grade materials', 'Fragile item wrapping', 'Room-by-room labeling'],
  },
  {
    icon: Warehouse,
    key: 'storage' as const,
    title: SERVICE_LABELS.storage,
    description:
      'Climate-controlled, secure storage for short or long-term needs. Containerized and vault options available.',
    price: PRICING.storagePerMonth,
    features: [
      '24/7 video surveillance',
      'Climate-controlled units',
      'Flexible monthly terms',
    ],
  },
  {
    icon: Boxes,
    key: 'specialty' as const,
    title: SERVICE_LABELS.specialty,
    description:
      'Pianos, antiques, art, safes, and oversized items. Our specialty crews have the gear and the training.',
    price: PRICING.specialtyItemFee,
    features: ['Custom crating', 'Specialty equipment', 'Fully insured handling'],
  },
];

export const STEPS = ['Service', 'Details', 'Contact', 'Estimate'];

export const HOME_STEPS = [
  {
    icon: Quote,
    title: 'Get a Quote',
    description:
      'Tell us about your move in under two minutes. Get an instant, transparent estimate—no phone tag required.',
  },
  {
    icon: Calendar,
    title: 'Pick a Date',
    description:
      'Choose a time slot that works for you. Real-time availability means what you see is what you get.',
  },
  {
    icon: Truck,
    title: 'We Handle the Rest',
    description:
      'Our background-checked crew arrives on time, prepped, and equipped. You relax—we do the heavy lifting.',
  },
  {
    icon: CheckCircle2,
    title: 'Pay Online',
    description:
      'Review your final invoice and pay securely online. No cash, no surprises, no hidden fees.',
  },
];

export const REVIEW_SOURCE_VARIANT: Record<
  string,
  'default' | 'secondary' | 'outline' | 'accent'
> = {
  google: 'default',
  yelp: 'accent',
  trustadvisor: 'secondary',
  internal: 'outline',
} as const;

export const EMPTY: FormState = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
};

export const services: ServiceCard[] = [
  {
    key: 'residential',
    label: 'Residential Move',
    icon: Home,
    description:
      'Stress-free home moves for apartments, condos, and houses of any size. Our crew handles your belongings with care from door to door.',
    features: [
      'Full-service loading & unloading',
      'Furniture disassembly & reassembly',
      'Floor and wall protection',
      'Free in-home estimates',
    ],
    priceFrom: PRICING.baseHourly,
    priceLabel: 'per hour',
  },
  {
    key: 'commercial',
    label: 'Commercial Move',
    icon: Building,
    description:
      'Minimize downtime with efficient office and business relocations. We work around your schedule to keep operations running.',
    features: [
      'After-hours and weekend moves',
      'Workstation and IT equipment handling',
      'Furniture and cubicle reconfiguration',
      'Project management included',
    ],
    priceFrom: PRICING.baseHourly,
    priceLabel: 'per hour',
  },
  {
    key: 'long_distance',
    label: 'Long Distance Move',
    icon: Truck,
    description:
      'Reliable state-to-state and cross-country moving. Your belongings are tracked and insured every mile of the journey.',
    features: [
      'Dedicated long-haul truck',
      'Real-time shipment tracking',
      'Full value protection included',
      'Guaranteed delivery windows',
    ],
    priceFrom: PRICING.longDistancePerMile,
    priceLabel: 'per mile',
  },
  {
    key: 'packing',
    label: 'Packing Service',
    icon: Package,
    description:
      'Leave the boxes to us. Professional packing and unpacking services with high-quality materials to keep everything safe.',
    features: [
      'Professional-grade materials',
      'Room-by-room packing option',
      'Fragile and specialty wrapping',
      'Labeling and inventory list',
    ],
    priceFrom: PRICING.packingPerRoom,
    priceLabel: 'per room',
  },
  {
    key: 'storage',
    label: 'Storage Solutions',
    icon: Warehouse,
    description:
      'Secure, climate-controlled storage for short or long-term needs. Perfect for staging between moves or decluttering.',
    features: [
      'Climate-controlled units',
      '24/7 security monitoring',
      'Flexible month-to-month terms',
      'Containerized storage options',
    ],
    priceFrom: PRICING.storagePerMonth,
    priceLabel: 'per month',
  },
  {
    key: 'specialty',
    label: 'Specialty Items',
    icon: Boxes,
    description:
      'Pianos, art, antiques, safes, and more. Our trained specialists handle your most valuable and challenging items.',
    features: [
      'Custom crating available',
      'Piano and instrument moving',
      'Fine art and antique handling',
      'Safes and heavy equipment',
    ],
    priceFrom: PRICING.specialtyItemFee,
    priceLabel: 'per item',
  },
] as const;

export const whyChooseUs = [
  {
    icon: ShieldCheck,
    title: 'Licensed & Bonded',
    description:
      'Fully licensed (IL MC# 892341), bonded, and insured for your peace of mind. Every move is covered from start to finish.',
  },
  {
    icon: Tag,
    title: 'Transparent Pricing',
    description:
      'No hidden fees, ever. You see your full estimate upfront with a clear breakdown of labor, truck, and any add-ons.',
  },
  {
    icon: Clock,
    title: 'On-Time Guarantee',
    description:
      'We respect your schedule. Our crews arrive within the promised window or your truck fee is on us.',
  },
  {
    icon: Users,
    title: 'Experienced Crew',
    description:
      'Background-checked, professionally trained movers with an average of 7+ years of experience on every team.',
  },
];

export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const TIME_WINDOWS: {
  key: TimeWindow;
  label: string;
  range: string;
  icon: typeof Sun;
}[] = [
  { key: '08:00-12:00', label: 'Morning', range: '08:00 – 12:00', icon: Sun },
  { key: '12:00-16:00', label: 'Afternoon', range: '12:00 – 16:00', icon: Sunset },
  { key: '16:00-20:00', label: 'Evening', range: '16:00 – 20:00', icon: Moon },
  { key: '20:00-24:00', label: 'Night', range: '20:00 – 24:00', icon: MoonStar },
] as const;

export const sourceOrder: Record<string, number> = {
  google: 0,
  yelp: 1,
  trustadvisor: 2,
  internal: 3,
} as const;

export const SERVICE_OPTIONS: { key: ServiceType; icon: LucideIcon }[] = [
  { key: 'residential', icon: Home },
  { key: 'commercial', icon: Building },
  { key: 'long_distance', icon: Truck },
  { key: 'packing', icon: Package },
  { key: 'storage', icon: Warehouse },
  { key: 'specialty', icon: Boxes },
];

export const HOME_SIZE_OPTIONS: HomeSize[] = [
  'studio',
  '1br',
  '2br',
  '3br',
  '4br_plus',
  'office',
  'custom',
];

export const stats: Stat[] = [
  { value: '10,000+', label: 'Moves completed', icon: Truck },
  { value: '9 years', label: 'In business', icon: Calendar },
  { value: '4.9/5', label: 'Average rating', icon: Star },
  { value: '48 states', label: 'Serviced nationwide', icon: MapPin },
] as const;

export const values: Value[] = [
  {
    title: 'Integrity',
    description:
      'We do what we say. Transparent pricing, honest estimates, and no surprise fees — ever. Every promise we make is a promise we keep.',
    icon: ShieldCheck,
  },
  {
    title: 'Care',
    description:
      'Your belongings are treated like our own. From heirlooms to everyday items, our crew is trained to handle everything with respect.',
    icon: HeartHandshake,
  },
  {
    title: 'Community',
    description:
      "We're proud to call the Midwest home. We support local businesses, hire locally, and give back to the neighborhoods that raised us.",
    icon: Building2,
  },
  {
    title: 'Improvement',
    description:
      'We never stop getting better. Every move is a chance to learn, refine our process, and raise the bar for what a moving company can be.',
    icon: TrendingUp,
  },
] as const;

export const team: TeamMember[] = [
  {
    name: 'Marcus Reid',
    role: 'Founder & CEO',
    bio: 'Marcus started Jay `N Jay Movers with a single box truck and a commitment to honest, careful moving. Nine years later, he still personally oversees every long-distance job.',
    image: LOGO.src,
  },
  {
    name: 'Elena Vasquez',
    role: 'Operations Director',
    bio: "Elena keeps the trucks rolling and the crews on schedule. With a decade in logistics, she's the reason your move starts and ends exactly when we say it will.",
    image: LOGO.src,
  },
  {
    name: 'James Okonkwo',
    role: 'Lead Mover & Trainer',
    bio: 'James has personally completed over 1,200 moves. He trains every new crew member on safe handling, packing, and the Summit standard of care.',
    image: LOGO.src,
  },
  {
    name: 'Priya Sharma',
    role: 'Customer Experience Lead',
    bio: 'Priya makes sure every customer feels supported from the first quote to the final box. She leads our support team and manages our satisfaction guarantee.',
    image: LOGO.src,
  },
] as const;

export const revenueData = [
  { month: 'Feb', revenue: 28000 },
  { month: 'Mar', revenue: 32000 },
  { month: 'Apr', revenue: 35000 },
  { month: 'May', revenue: 41000 },
  { month: 'Jun', revenue: 38000 },
  { month: 'Jul', revenue: 45000 },
] as const;

export const PIE_COLORS = [
  '#f59e0b',
  '#10b981',
  '#3b82f6',
  '#6b7280',
  '#ef4444',
] as const;
