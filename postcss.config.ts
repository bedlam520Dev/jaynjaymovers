import type { Plugin } from "postcss";

const config: { plugins: (string | Plugin | Plugin[])[] } = {
  plugins: ["@tailwindcss/postcss"],
};

export default config;
