import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for visual regression testing
 * Focus: Mobile header clipping detection
 *
 * Run locally: npx playwright test
 * Update snapshots: npx playwright test --update-snapshots
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html", { open: "never" }]],

  use: {
    baseURL: process.env.BASE_URL || "http://localhost:8080",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  /* Mobile viewport configurations for header testing */
  projects: [
    {
      name: "Mobile Chrome (Android)",
      use: {
        ...devices["Pixel 5"],
        // Simulate Android Chrome status bar area
        viewport: { width: 393, height: 851 },
      },
    },
    {
      name: "Mobile Chrome Small",
      use: {
        ...devices["Pixel 5"],
        viewport: { width: 360, height: 640 },
      },
    },
    {
      name: "iPhone 12",
      use: {
        ...devices["iPhone 12"],
      },
    },
    {
      name: "iPhone 12 Pro Max",
      use: {
        ...devices["iPhone 12 Pro Max"],
      },
    },
    {
      name: "iPhone SE",
      use: {
        ...devices["iPhone SE"],
      },
    },
    {
      name: "Galaxy S9+",
      use: {
        ...devices["Galaxy S9+"],
      },
    },
  ],

  /* Run local dev server before starting tests */
  webServer: {
    command: "npm run dev",
    url: "http://localhost:8080",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
