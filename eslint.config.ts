import path from 'path';
import { fileURLToPath } from 'url';

import { FlatCompat } from '@eslint/eslintrc';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const compat = new FlatCompat({
  baseDirectory: dirname,
});

const eslintConfig = [
  ...compat.extends(),
  {
    rules: {},
  },
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'dist/**',
      '_dev/**',
      '_devlogs/**',
      '.vscode/**',
      '.kilo/**',
      'src/app/editor/**/*',
      'src/components/editor/**/*',
    ],
  },
];

export default eslintConfig;
