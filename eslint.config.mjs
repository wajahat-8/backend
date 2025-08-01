// eslint.config.mjs
import js from '@eslint/js';
import globals from 'globals';

export default [
  // ESLint's recommended rules
  js.configs.recommended,

  // Your custom configuration
  {
    files: ['**/*.js'],



    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-unused-vars': 'warn', // custom rule
    },
  },
  {
    ignores: ['dist/**'],
  },
];
