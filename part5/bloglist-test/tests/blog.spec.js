const { test, expect, beforeEach, describe } = require("@playwright/test");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    // Empty the database
    const resetResponse = await request.post(
      "http://localhost:3003/api/testing/reset"
    );
    console.log("Reset Response:", resetResponse.status());

    // Create a new user
    const user = {
      name: "Test User",
      username: "testuser",
      password: "testpassword",
    };
    const userResponse = await request.post(
      "http://localhost:3003/api/users/",
      { data: user }
    );
    console.log("User Creation Response:", userResponse.status());

    // Visit the app
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

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await page.fill('input[name="Username"]', "testuser");
      await page.fill('input[name="Password"]', "testpassword");
      await page.click('button[type="submit"]');

      // Wait for the login process to complete
      await page.waitForTimeout(1000); // Adjust timeout as needed

      const loggedInMessage = await page
        .locator("text=Test User logged in")
        .isVisible();
      expect(loggedInMessage).toBe(true);
    });

    test("fails with wrong credentials", async ({ page }) => {
      await page.fill('input[name="Username"]', "testuser");
      await page.fill('input[name="Password"]', "wrongpassword");
      await page.click('button[type="submit"]');

      // Wait for the error message to appear
      await page.waitForTimeout(1000); // Adjust timeout as needed

      const errorMessage = await page
        .locator("text=Wrong username or password")
        .isVisible();
      expect(errorMessage).toBe(true);
      const errorColor = await page.locator(".error").evaluate((element) => {
        return window.getComputedStyle(element).color;
      });
      expect(errorColor).toBe("rgb(255, 0, 0)"); // Assuming the error text is red
    });
  });
});
