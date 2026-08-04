import path from 'path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: [
      'node_modules',
      '.next/**/*',
      '_dev/**/*',
      '_devlogs/**/*',
      '.kilo/**/*',
      '.opencode/**/*',
    ],
    env: {
      NEXT_PUBLIC_BASE_URL: 'https://jaynjaymovers.com',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
