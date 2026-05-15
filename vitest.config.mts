import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.mts';

export default mergeConfig(
  viteConfig,
  defineConfig({
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
  })
);
