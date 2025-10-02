import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests', // folder containing test files
  timeout: 30 * 1000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:5173', // React dev server
    headless: false,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 5000,
    ignoreHTTPSErrors: true,
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'Desktop Chrome', use: { ...devices['Desktop Chrome'] } },
    { name: 'Desktop Firefox', use: { ...devices['Desktop Firefox'] } },
  ],
});
