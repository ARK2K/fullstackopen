const { test, expect, beforeEach, describe } = require("@playwright/test");

describe("Blog app", () => {
  beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    // Check for the presence of the login heading
    const loginHeading = await page.locator('h1:has-text("Login")').isVisible();
    expect(loginHeading).toBe(true);

    // Check for the presence of the login button
    const loginButton = await page
      .locator('button[type="submit"]:has-text("login")')
      .isVisible();
    expect(loginButton).toBe(true);
  });
});
