import { type Config } from "prettier";

const config: Config = {
  semi: true,
  singleQuote: true,
  useTabs: false,
  tabWidth: 2,
  trailingComma: 'es5',
  printWidth: 80,
  plugins: [
    'prettier-plugin-tailwindcss',
    'prettier-plugin-sh'
  ],
};

export default config;