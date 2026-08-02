import type { ProviderConfig, ProviderStatus } from './types';

const MERCHANT_ID = process.env.GOOGLE_PAY_MERCHANT_ID;
const MERCHANT_NAME = process.env.GOOGLE_PAY_MERCHANT_NAME ?? 'Jay N Jay Movers';

export function getStatus(): ProviderStatus {
  return MERCHANT_ID ? 'configured' : 'not_configured';
}

export const config: ProviderConfig = {
  configured: !!MERCHANT_ID,
  name: 'google_pay',
  label: 'Google Pay',
  supportedMethods: ['google_pay'],
  message: MERCHANT_ID
    ? 'Google Pay is configured'
    : 'Google Pay not configured — set GOOGLE_PAY_MERCHANT_ID to enable Google Pay',
};

export function getGooglePayConfig() {
  if (!MERCHANT_ID) return null;

  return {
    environment: process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'TEST',
    apiVersion: 2,
    apiVersionMinor: 0,
    merchantInfo: {
      merchantId: MERCHANT_ID,
      merchantName: MERCHANT_NAME,
    },
    allowedPaymentMethods: [
      {
        type: 'CARD',
        parameters: {
          allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
          allowedCardNetworks: ['VISA', 'MASTERCARD', 'AMEX', 'DISCOVER'],
        },
        tokenizationSpecification: {
          type: 'PAYMENT_GATEWAY',
          parameters: {
            gateway: 'stripe',
            'stripe:version': '2023-10-16',
          },
        },
      },
    ],
  } as const;
}
