export type PaymentProvider = 'stripe' | 'paypal' | 'google_pay' | 'apple_pay';

export type PaymentMethod =
  | 'credit_card'
  | 'crypto'
  | 'google_pay'
  | 'apple_pay'
  | 'paypal'
  | 'cashapp'
  | 'zelle';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface CreatePaymentIntentParams {
  amount: number;
  currency?: string;
  booking_id?: string;
  method?: PaymentMethod;
  metadata?: Record<string, string>;
}

export interface PaymentIntentResult {
  clientSecret: string | null;
  paymentIntentId: string | null;
  provider: PaymentProvider;
  message?: string;
}

export interface PaymentRecord {
  id: string;
  user_id: string | null;
  booking_id: string | null;
  amount: number;
  method: PaymentMethod | string;
  status: PaymentStatus;
  provider_payment_id: string;
  created_at: string;
}

export interface ProviderConfig {
  configured: boolean;
  name: string;
  label: string;
  supportedMethods: PaymentMethod[];
  message: string;
}

export type ProviderStatus = 'configured' | 'not_configured' | 'error';
