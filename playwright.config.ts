import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
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
    // if Vite: add --host to avoid binding issues in CI
    command: 'npm run dev -- --host',
    url: 'http://localhost:5173',
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
});
