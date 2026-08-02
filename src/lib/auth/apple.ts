import type { AuthProviderConfig, AuthProviderStatus } from './types';

const CLIENT_ID = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID;
const TEAM_ID = process.env.APPLE_TEAM_ID;
const KEY_ID = process.env.APPLE_KEY_ID;
const PRIVATE_KEY = process.env.APPLE_PRIVATE_KEY;

export function getStatus(): AuthProviderStatus {
  return CLIENT_ID ? 'configured' : 'not_configured';
}

export const config: AuthProviderConfig = {
  configured: !!CLIENT_ID,
  name: 'apple',
  label: 'Apple',
  message: CLIENT_ID
    ? 'Apple OAuth is configured'
    : 'Apple OAuth not configured — set NEXT_PUBLIC_APPLE_CLIENT_ID and APPLE_TEAM_ID to enable Apple sign-in',
};

export function getClientId(): string | null {
  return CLIENT_ID ?? null;
}

export function isConfigured(): boolean {
  return !!CLIENT_ID;
}

export function getAppleConfig() {
  if (!CLIENT_ID) return null;
  return {
    clientId: CLIENT_ID,
    teamId: TEAM_ID ?? null,
    keyId: KEY_ID ?? null,
    redirectURI: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/oauth`,
  };
}
