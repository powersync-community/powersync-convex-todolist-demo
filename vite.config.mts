/// <reference types="vitest" />
import { fileURLToPath, URL } from 'url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Set VITE_GITHUB_PAGES_BASE_PATH to your repo name when deploying to GitHub Pages.
const githubPagesBasePath = process.env.VITE_GITHUB_PAGES_BASE_PATH?.replace(/\/$/, '') ?? '';

// https://vitejs.dev/config/
export default defineConfig({
  base: githubPagesBasePath ? `${githubPagesBasePath}/` : '/',
  root: 'src',
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: 'src/index.html'
    },
    emptyOutDir: true
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? 'development')
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: fileURLToPath(new URL('./src', import.meta.url))
      }
    ]
  },
  publicDir: '../public',
  envDir: '..', // Use this dir for env vars, not 'src'.
  optimizeDeps: {
    // Don't optimize these packages as they contain web workers and WASM files.
    // https://github.com/vitejs/vite/issues/11672#issuecomment-1415820673
    exclude: ['@powersync/web']
  },
  esbuild: {
    jsx: 'automatic'
  },
  plugins: [react()],
  worker: {
    format: 'es'
  },
  test: {
    globals: true,
    include: ['../e2e/**/*.test.{ts,tsx}'],
    maxConcurrency: 1,
    browser: {
      enabled: true,
      isolate: true,
      provider: 'playwright',
      headless: true,
      instances: [
        {
          browser: 'chromium'
        }
      ]
    }
  }
});
