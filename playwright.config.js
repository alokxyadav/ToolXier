import { defineConfig, devices } from '@playwright/test'
export default defineConfig({
  testDir: 'e2e', retries: process.env.CI ? 1 : 0, reporter: 'list',
  use: { baseURL: 'http://localhost:4173' },
  webServer: { command: 'npm run build && node scripts/serve.mjs', url: 'http://localhost:4173', reuseExistingServer: !process.env.CI, timeout: 120000 },
  projects: [{ name: 'desktop-chrome', use: { ...devices['Desktop Chrome'] } }, { name: 'android', use: { ...devices['Pixel 7'] } }, { name: 'iphone', use: { ...devices['iPhone 14'] } }],
})
