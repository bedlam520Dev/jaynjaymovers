import * as apple from './apple';
import * as google from './google';
import type { AuthProvider, AuthProviderConfig } from './types';

export * from './types';
export { google, apple };

export function getProviderConfig(provider: AuthProvider): AuthProviderConfig {
  switch (provider) {
    case 'google':
      return google.config;
    case 'apple':
      return apple.config;
  }
}

export function getAllProviderConfigs(): AuthProviderConfig[] {
  return [google.config, apple.config];
}

export function isProviderConfigured(provider: AuthProvider): boolean {
  switch (provider) {
    case 'google':
      return google.isConfigured();
    case 'apple':
      return apple.isConfigured();
  }
}
