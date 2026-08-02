import type {
  CreatePaymentIntentParams,
  PaymentIntentResult,
  ProviderConfig,
  ProviderStatus,
} from './types';

const CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const SECRET = process.env.PAYPAL_CLIENT_SECRET;

export function getStatus(): ProviderStatus {
  return CLIENT_ID && SECRET ? 'configured' : 'not_configured';
}

export const config: ProviderConfig = {
  configured: !!CLIENT_ID,
  name: 'paypal',
  label: 'PayPal',
  supportedMethods: ['paypal'],
  message:
    CLIENT_ID && SECRET
      ? 'PayPal is configured and ready'
      : 'PayPal not configured — set NEXT_PUBLIC_PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET to enable PayPal payments',
};

const API_BASE = process.env.PAYPAL_API_URL ?? 'https://api-m.paypal.com';

async function getAccessToken(): Promise<string> {
  if (!SECRET) throw new Error('PayPal not configured');

  const response = await fetch(`${API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${SECRET}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error('Failed to get PayPal access token');
  }

  const data = await response.json();
  return data.access_token;
}

export async function createPaymentIntent(
  params: CreatePaymentIntentParams
): Promise<PaymentIntentResult> {
  if (!CLIENT_ID || !SECRET) {
    return {
      clientSecret: null,
      paymentIntentId: null,
      provider: 'paypal',
      message: config.message,
    };
  }

  const token = await getAccessToken();

  const orderResponse = await fetch(`${API_BASE}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: (params.currency ?? 'USD').toUpperCase(),
            value: params.amount.toFixed(2),
          },
          ...(params.booking_id ? { invoice_id: params.booking_id } : {}),
        },
      ],
    }),
  });

  if (!orderResponse.ok) {
    const err = await orderResponse.json();
    throw new Error(err.message ?? 'PayPal API error');
  }

  const order = await orderResponse.json();

  return {
    clientSecret: order.id,
    paymentIntentId: order.id,
    provider: 'paypal',
  };
}

export { CLIENT_ID };
