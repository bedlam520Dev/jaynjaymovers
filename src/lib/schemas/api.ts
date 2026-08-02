import { z } from 'zod';

export const newsletterSchema = z.object({
  email: z.string().email('Invalid email address').max(254),
});

export const quoteSchema = z.object({
  service_type: z.enum([
    'residential',
    'commercial',
    'long_distance',
    'packing',
    'storage',
    'specialty',
  ]),
  home_size: z.enum(['studio', '1br', '2br', '3br', '4br_plus', 'office', 'custom']),
  moving_date: z.string().optional().nullable(),
  origin_address: z.string().min(1, 'Origin address is required'),
  destination_address: z.string().optional().nullable(),
  contact_name: z.string().min(1, 'Contact name is required'),
  contact_phone: z.string().min(1, 'Contact phone is required'),
  contact_email: z.string().email('Invalid email address'),
  notes: z.string().optional().nullable(),
});

export const bookingSchema = z.object({
  service_type: z.enum([
    'residential',
    'commercial',
    'long_distance',
    'packing',
    'storage',
    'specialty',
  ]),
  home_size: z.enum(['studio', '1br', '2br', '3br', '4br_plus', 'office', 'custom']),
  moving_date: z.string().min(1, 'Moving date is required'),
  time_window: z.enum(['08:00-12:00', '12:00-16:00', '16:00-20:00', '20:00-24:00']),
  origin_address: z.string().min(1, 'Origin address is required'),
  destination_address: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const reviewSchema = z.object({
  author_name: z.string().min(1, 'Author name is required'),
  rating: z.number().int().min(1).max(5),
  text: z.string().min(1, 'Review text is required'),
  source: z.enum(['google', 'yelp', 'trustadvisor', 'internal']).default('internal'),
});

export const paymentSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  method: z.enum([
    'credit_card',
    'crypto',
    'google_pay',
    'apple_pay',
    'paypal',
    'cashapp',
    'zelle',
  ]),
  booking_id: z.string().uuid().optional().nullable(),
});

export const createIntentSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  booking_id: z.string().uuid().optional().nullable(),
  method: z
    .enum([
      'credit_card',
      'crypto',
      'google_pay',
      'apple_pay',
      'paypal',
      'cashapp',
      'zelle',
    ])
    .default('credit_card'),
});
