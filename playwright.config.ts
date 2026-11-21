
import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

export default defineConfig({
  testDir: './tests',

  // Allow independent tests to run in parallel.
  fullyParallel: true,

  // Prevent accidental test.only() in CI.
  forbidOnly: !!process.env.CI,

  // Retry failed tests only in CI.
  retries: process.env.CI ? 2 : 0,

  // One worker to avoid the WebKit concurrency issue.
  workers: 1,

  // Generate HTML test reports.
  reporter: 'html',

  use: {
    // Application under test.
    baseURL: 'https://automationexercise.com/',

    // Capture screenshots on failure.
    screenshot: 'only-on-failure',

    // Capture trace when a failed test is retried.
    trace: 'on-first-retry',
  },

  // Cross-browser testing.
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
