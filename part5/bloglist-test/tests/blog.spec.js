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

    // Create a new user (creator)
    const creatorUser = {
      name: "Creator User",
      username: "creatorUser",
      password: "creatorPassword",
    };
    const creatorUserResponse = await request.post(
      "http://localhost:3003/api/users/",
      { data: creatorUser }
    );
    console.log(
      "Creator User Creation Response:",
      creatorUserResponse.status()
    );

    // Create a different user
    const differentUser = {
      name: "Different User",
      username: "differentUser",
      password: "differentPassword",
    };
    const differentUserResponse = await request.post(
      "http://localhost:3003/api/users/",
      { data: differentUser }
    );
    console.log(
      "Different User Creation Response:",
      differentUserResponse.status()
    );

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

    test("a blog can be liked", async ({ page }) => {
      await page.fill('input[name="Username"]', "testuser");
      await page.fill('input[name="Password"]', "testpassword");
      await page.click('button[type="submit"]');
      await page.click("button.new");
      await page.fill('input[name="title"]', "Test Blog Title");
      await page.fill('input[name="author"]', "Test Author");
      await page.fill('input[name="url"]', "http://testblogurl.com");
      await page.click('button[type="submit"]');
      await page.waitForSelector(".blog");
      const likeButton = await page.locator('button:has-text("Like")');
      await likeButton.click();
      await page.waitForTimeout(500); // wait for the like to be processed

      const likesCount = await page.locator(".blog").textContent();
      expect(likesCount).toContain("Likes: 1");
    });

    test("a new blog can be created and deleted by the creator", async ({
      page,
    }) => {
      // Log in
      await page.fill('input[name="Username"]', "testuser");
      await page.fill('input[name="Password"]', "testpassword");
      await page.click('button[type="submit"]');
      console.log("Logged in");

      // Create a new blog
      await page.click("button.new");
      await page.fill('input[name="title"]', "Test Blog Title");
      await page.fill('input[name="author"]', "Test Author");
      await page.fill('input[name="url"]', "http://testblogurl.com");
      await page.click('button[type="submit"]');
      console.log("Blog created");

      // Wait for the blog to appear
      await page.waitForSelector(".blog");
      console.log("Blog is visible");

      // Setup the dialog event listener before clicking the Delete button
      page.on("dialog", async (dialog) => {
        await dialog.accept();
      });

      // Wait for the Delete button and verify it is visible
      await page.waitForSelector('button:has-text("Delete")');
      const deleteButtonVisible = await page.isVisible(
        'button:has-text("Delete")'
      );
      console.log("Delete button visible:", deleteButtonVisible);
      expect(deleteButtonVisible).toBeTruthy();

      // Click the Delete button
      await page.click('button:has-text("Delete")');
      console.log("Delete button clicked");

      // Wait for the blog to disappear
      await page.waitForTimeout(1000); // Adding a short wait to allow the deletion to process
      const blogVisible = await page.isVisible("text=Likes");
      console.log("Blog visible after delete attempt:", blogVisible);
      expect(blogVisible).toBe(false);
    });

    test("only the user who added the blog sees the delete button", async ({
      page,
    }) => {
      // Log in as the creator
      await page.fill('input[name="Username"]', "creatorUser");
      await page.fill('input[name="Password"]', "creatorPassword");
      await page.click('button[type="submit"]');
      console.log("Logged in as creator");

      // Create a new blog
      await page.click("button.new");
      await page.fill('input[name="title"]', "Test Blog Title");
      await page.fill('input[name="author"]', "Test Author");
      await page.fill('input[name="url"]', "http://testblogurl.com");
      await page.click('button[type="submit"]');
      console.log("Blog created");

      // Wait for the blog to appear
      await page.waitForSelector(".blog");
      console.log("Blog is visible");

      // Verify the delete button is visible for the creator
      const deleteButtonVisibleForCreator = await page.isVisible(
        'button:has-text("Delete")'
      );
      console.log(
        "Delete button visible for creator:",
        deleteButtonVisibleForCreator
      );
      expect(deleteButtonVisibleForCreator).toBeTruthy();

      // Log out
      await page.click('button:has-text("Logout")');
      console.log("Logged out as creator");

      // Log in as a different user
      await page.fill('input[name="Username"]', "differentUser");
      await page.fill('input[name="Password"]', "differentPassword");
      await page.click('button[type="submit"]');
      console.log("Logged in as different user");

      // Wait for the blog to appear
      await page.waitForSelector(".blog");
      console.log("Blog is visible for different user");

      // Verify the delete button is not visible for the different user
      const deleteButtonVisibleForDifferentUser = await page.isVisible(
        'button:has-text("Delete")'
      );
      console.log(
        "Delete button visible for different user:",
        deleteButtonVisibleForDifferentUser
      );
      expect(deleteButtonVisibleForDifferentUser).toBeFalsy();
    });
  });
});
