import eslint from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import prettier from 'eslint-plugin-prettier'
import reactCompiler from 'eslint-plugin-react-compiler'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import storybook from 'eslint-plugin-storybook'
import { defineConfig } from 'eslint/config'
import betterTailwindcss from 'eslint-plugin-better-tailwindcss'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import i18next from 'eslint-plugin-i18next'
import { fixupPluginRules } from '@eslint/compat'

export default defineConfig(
  { ignores: ['node_modules', 'dist', 'vite.config.ts', 'storybook-static', '!.storybook'] },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  ...storybook.configs['flat/recommended'],
  {
    extends: [eslintConfigPrettier],
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        project: 'tsconfig.json',
        sourceType: 'module',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      eslint,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'react-compiler': reactCompiler,
      prettier,
      import: importPlugin,
      'better-tailwindcss': betterTailwindcss,
      i18next: fixupPluginRules(i18next),
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-compiler/react-compiler': 'error',
      'prettier/prettier': 'error',
      eqeqeq: 'error',
      curly: 'error',
      'no-duplicate-imports': 'warn',
      'object-shorthand': ['error', 'always'],
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
        },
      ],
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error', 'info', 'debug', 'table', 'time', 'timeEnd'],
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/no-unsafe-enum-comparison': 'error',
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: false,
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],
      'import/extensions': [
        'error',
        'never',
        {
          css: 'always',
          json: 'always',
          webp: 'always',
          png: 'always',
          jpg: 'always',
          jpeg: 'always',
          gif: 'always',
          svg: 'always',
          module: 'always',
        },
      ],
      'i18next/no-literal-string': [
        'error',
        {
          mode: 'jsx-text-only',
          message: 'Literal string is not allowed',
        },
      ],
    },
  },
  {
    files: ['**/*.stories.tsx'],
    rules: {
      'i18next/no-literal-string': 'off',
    },
  },
)
