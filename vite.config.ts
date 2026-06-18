import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import babel from '@rolldown/plugin-babel'
import pkg from './package.json'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({
      presets: [reactCompilerPreset()]
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
      'three/addons': path.resolve(__dirname, 'node_modules/three/examples/jsm'),
    },
  },
  build: {
    chunkSizeWarningLimit: 1100,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'react-vendor',
              test: /node_modules[\\\\/]react/,
              priority: 20,
            },
            {
              name: 'vendor',
              test: /node_modules/,
              priority: 10,
            },
            {
              name: 'common',
              minShareCount: 2,
              maxSize: 2617344,
              priority: 5,
            },
          ],
        },
        cleanDir: true,
        comments: false
      }
    }
  },
  define: {
    global: "window",
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(pkg.version),
  },
  //@ts-expect-error test key doesn't exist in UserConfigExport
  test: {
    environment: 'jsdom',
  },
});
