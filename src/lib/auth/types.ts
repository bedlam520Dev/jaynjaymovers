export type AuthProvider = 'google' | 'apple';

export interface AuthProviderConfig {
  configured: boolean;
  name: AuthProvider;
  label: string;
  message: string;
}

export type AuthProviderStatus = 'configured' | 'not_configured';

export interface OAuthResult {
  success: boolean;
  provider: AuthProvider;
  error?: string;
}
