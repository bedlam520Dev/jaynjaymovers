import * as applePay from './apple-pay';
import * as googlePay from './google-pay';
import * as paypal from './paypal';
import * as stripe from './stripe';
import type {
  CreatePaymentIntentParams,
  PaymentIntentResult,
  PaymentMethod,
  PaymentProvider,
  ProviderConfig,
} from './types';

export * from './types';
export { stripe, paypal, googlePay, applePay };

export function getProviderConfig(method: PaymentMethod | string): ProviderConfig {
  switch (method) {
    case 'credit_card':
    case 'crypto':
    case 'google_pay':
    case 'apple_pay':
      return stripe.config;
    case 'paypal':
      return paypal.config;
    default:
      return {
        configured: false,
        name: 'unknown',
        label: method,
        supportedMethods: [],
        message: `Payment method "${method}" is not supported`,
      };
  }
}

export function getAllProviderConfigs(): ProviderConfig[] {
  return [stripe.config, paypal.config, googlePay.config, applePay.config];
}

export async function createPaymentIntent(
  params: CreatePaymentIntentParams
): Promise<PaymentIntentResult> {
  const { method = 'credit_card' } = params;

  switch (method) {
    case 'paypal':
      return paypal.createPaymentIntent(params);
    case 'credit_card':
    case 'crypto':
    case 'google_pay':
    case 'apple_pay':
    default:
      return stripe.createPaymentIntent(params);
  }
}

export function resolveProvider(method: PaymentMethod | string): PaymentProvider {
  switch (method) {
    case 'paypal':
      return 'paypal';
    case 'google_pay':
      return 'google_pay';
    case 'apple_pay':
      return 'apple_pay';
    default:
      return 'stripe';
  }
}
