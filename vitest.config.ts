import {mergeConfig} from 'vite'
import {defineConfig as defineVitestConfig} from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineVitestConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      include: ['**/*.spec.ts', '**/*.test.ts'],
    },
  })
)