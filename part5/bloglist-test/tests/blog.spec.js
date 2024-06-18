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
    console.log("Login heading visibility:", loginHeading); // Log the visibility status
    expect(loginHeading).toBe(true);

    // Check for the presence of the login button
    const loginButton = await page
      .locator('button[type="submit"]:has-text("login")')
      .isVisible();
    console.log("Login button visibility:", loginButton); // Log the visibility status
    expect(loginButton).toBe(true);
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      console.log("Filling in username and password for login");
      await page.fill('input[name="Username"]', "testuser");
      await page.fill('input[name="Password"]', "testpassword");
      await page.click('button[type="submit"]');

      // Wait for the login process to complete
      await page.waitForSelector("text=Test User logged in");
    });

    test("fails with wrong credentials", async ({ page }) => {
      console.log("Filling in username and wrong password for login");
      await page.fill('input[name="Username"]', "testuser");
      await page.fill('input[name="Password"]', "wrongpassword");
      await page.click('button[type="submit"]');

      // Wait for the error message to appear
      await page.waitForSelector("text=Wrong username or password");

      const errorMessage = await page
        .locator("text=Wrong username or password")
        .isVisible();
      console.log("Error message visibility:", errorMessage); // Log the visibility status
      expect(errorMessage).toBe(true);
      const errorColor = await page.locator(".error").evaluate((element) => {
        return window.getComputedStyle(element).color;
      });
      expect(errorColor).toBe("rgb(255, 0, 0)"); // Assuming the error text is red
    });
  });

  describe("When logged in", () => {
    test("a new blog can be created", async ({ page }) => {
      // Wait for the "New Blog" button to be visible
      await page.fill('input[name="Username"]', "testuser");
      await page.fill('input[name="Password"]', "testpassword");
      await page.click('button[type="submit"]');

      await page.click("button.new");

      // Now you can proceed with creating a new blog
      await page.fill('input[name="title"]', "Test Blog Title");
      await page.fill('input[name="author"]', "Test Author");
      await page.fill('input[name="url"]', "http://testblogurl.com");
      await page.click('button[type="submit"]');

      // Wait for the new blog to be added to the list
      await page.waitForSelector(".blog");

      // Check if the new blog is visible in the list
      const blogTitle = await page.locator(".blog").textContent();
      expect(blogTitle).toContain("Test Blog Title");
    });
  });
});
