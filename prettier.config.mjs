// prettier.config.mjs
/** @type {import("prettier").Config} */
export default {
  semi: true,
  singleQuote: true,
  useTabs: true,
  tabWidth: 2,
  trailingComma: 'es5',
  printWidth: 88,
  plugins: ['prettier-plugin-tailwindcss'],
};
