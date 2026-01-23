import { test, expect } from "@playwright/test";

/**
 * Visual regression tests for mobile header
 * Catches clipping issues on Android/iOS devices
 */

const pagesToTest = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Projects", path: "/projects" },
  { name: "Contact", path: "/contact" },
  { name: "About", path: "/about" },
  { name: "Stone Veneer", path: "/stone-veneer" },
];

test.describe("Mobile Header Visual Tests", () => {
  for (const page of pagesToTest) {
    test(`Header not clipped on ${page.name} page`, async ({ page: p }) => {
      await p.goto(page.path);

      // Wait for header to be fully loaded
      await p.waitForLoadState("networkidle");

      // Take screenshot of the top portion (header area)
      const headerScreenshot = await p.screenshot({
        clip: { x: 0, y: 0, width: 393, height: 150 },
      });

      // Visual comparison - will fail if header looks different from baseline
      expect(headerScreenshot).toMatchSnapshot(`header-${page.name.toLowerCase()}.png`, {
        threshold: 0.1, // Allow 10% pixel difference for anti-aliasing
        maxDiffPixelRatio: 0.02, // Max 2% of pixels can differ
      });
    });
  }

  test("Header elements are fully visible", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Check hamburger menu button is visible and not clipped
    const hamburger = page.locator('button[aria-label="פתח תפריט"]');
    await expect(hamburger).toBeVisible();

    const hamburgerBox = await hamburger.boundingBox();
    expect(hamburgerBox).not.toBeNull();

    // Hamburger should not be at y=0 (would indicate clipping)
    expect(hamburgerBox!.y).toBeGreaterThan(20);

    // Check logo is visible
    const logo = page.locator('header img[alt="א.א פרויקטים וגובה"]').first();
    await expect(logo).toBeVisible();

    const logoBox = await logo.boundingBox();
    expect(logoBox).not.toBeNull();

    // Logo top should have enough clearance from viewport top
    expect(logoBox!.y).toBeGreaterThan(15);

    // Check CTA button is visible
    const cta = page.locator('header a:has-text("להצעת מחיר")').first();
    await expect(cta).toBeVisible();
  });

  test("Header padding respects safe area", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Get the mobile header element
    const mobileHeader = page.locator(".lg\\:hidden.fixed.top-0");
    await expect(mobileHeader).toBeVisible();

    // Get computed padding-top
    const paddingTop = await mobileHeader.evaluate((el) => {
      return window.getComputedStyle(el).paddingTop;
    });

    // Padding should be at least 44px (our minimum)
    const paddingValue = parseInt(paddingTop, 10);
    expect(paddingValue).toBeGreaterThanOrEqual(44);
  });
});

test.describe("Header Scroll Behavior", () => {
  test("Header hides on scroll and shows at top", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Header should be visible at top
    const header = page.locator("header");
    await expect(header).toHaveCSS("opacity", "1");

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(500);

    // Header should be hidden
    await expect(header).toHaveCSS("opacity", "0");

    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    // Header should be visible again
    await expect(header).toHaveCSS("opacity", "1");
  });
});
