import type { AuthProviderConfig, AuthProviderStatus } from './types';

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

export function getStatus(): AuthProviderStatus {
  return CLIENT_ID ? 'configured' : 'not_configured';
}

export const config: AuthProviderConfig = {
  configured: !!CLIENT_ID,
  name: 'google',
  label: 'Google',
  message: CLIENT_ID
    ? 'Google OAuth is configured'
    : 'Google OAuth not configured — set NEXT_PUBLIC_GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to enable Google sign-in',
};

export function getClientId(): string | null {
  return CLIENT_ID ?? null;
}

export function isConfigured(): boolean {
  return !!CLIENT_ID;
}
