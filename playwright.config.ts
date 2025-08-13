import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'src/tests/e2e',
  testMatch: '**/*.spec.ts',
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], channel: 'chromium' },
    },
  ],
  use: {
    browserName: 'chromium', // force Chromium
    headless: true, // always run headless
  },
  webServer: {
    command: 'npm run dev -- --host', // Vite: ensure it binds properly
    url: 'http://localhost:5173',
    timeout: 120_000,
    reuseExistingServer: false,
  },
});
