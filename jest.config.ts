import type { Config } from "jest";

const config: Config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.(ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },
  testMatch: ["**/__tests__/**/*.test.(ts|tsx)", "**/?(*.)+(spec|test).(ts|tsx)"],
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/", "<rootDir>/e2e/"],
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts", "!src/**/stories.tsx"],
};

export default config;
