import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'src/tests/e2e',
  testMatch: '**/*.spec.ts',

  use: {
    ...devices['Desktop Chrome'],
    channel: 'chromium', // new headless mode
    headless: true,
    baseURL: 'http://localhost:5173',
  },

  webServer: {
    command: 'npm run dev -- --host',
    url: 'http://localhost:5173',
    timeout: 120_000,
    reuseExistingServer: false,
  },
});
