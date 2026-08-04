import type { ProviderConfig, ProviderStatus } from './types';

const MERCHANT_ID = process.env.NEXT_PUBLIC_APPLE_PAY_MERCHANT_ID;
const MERCHANT_DOMAIN = process.env.NEXT_PUBLIC_APPLE_PAY_MERCHANT_DOMAIN;
const CERTIFICATE = process.env.APPLE_PAY_CERTIFICATE;

export function getStatus(): ProviderStatus {
  return MERCHANT_ID && MERCHANT_DOMAIN ? 'configured' : 'not_configured';
}

export const config: ProviderConfig = {
  configured: !!MERCHANT_ID,
  name: 'apple_pay',
  label: 'Apple Pay',
  supportedMethods: ['apple_pay'],
  message:
    MERCHANT_ID && MERCHANT_DOMAIN
      ? 'Apple Pay is configured'
      : 'Apple Pay not configured — set APPLE_PAY_MERCHANT_ID and APPLE_PAY_MERCHANT_DOMAIN to enable Apple Pay',
};

export function getMerchantIdentifier(): string | null {
  return MERCHANT_ID ?? null;
}

export function getMerchantDomain(): string | null {
  return MERCHANT_DOMAIN ?? null;
}

export function getApplePayConfig() {
  if (!MERCHANT_ID || !MERCHANT_DOMAIN) return null;

  return {
    merchantIdentifier: MERCHANT_ID,
    supportedNetworks: ['visa', 'masterCard', 'amex', 'discover'] as const,
    supportedCountries: ['US'],
    capabilities: ['supports3DS', 'supportsCredit', 'supportsDebit'] as const,
  };
}
