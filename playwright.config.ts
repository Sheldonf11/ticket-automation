import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import dotenv from 'dotenv';

const serverEnv = dotenv.config({ path: path.resolve(process.cwd(), 'server/.env.test') }).parsed;

export default defineConfig({
  testDir: './e2e/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  globalSetup: './e2e/global-setup.ts',
  globalTeardown: './e2e/global-teardown.ts',

  use: {
    baseURL: 'http://localhost:5174',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: [
    {
      command: 'bun run --cwd server src/index.ts',
      url: 'http://localhost:3002/api/health',
      reuseExistingServer: !process.env.CI,
      env: {
        ...serverEnv
      }
    },
    {
      command: 'bun run --cwd client vite --port 5174',
      url: 'http://localhost:5174',
      reuseExistingServer: !process.env.CI,
      env: {
        VITE_API_URL: 'http://localhost:3002'
      }
    }
  ],
});
