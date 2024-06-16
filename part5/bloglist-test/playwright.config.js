// playwright.config.js
const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  use: {
    browserName: "chromium",
    baseURL: "http://localhost:5173",
  },
  webServer: {
    command: "npm run dev",
    port: 5173,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
});
