import { test, expect } from '@playwright/test';
import { AuthHelper, testUsers } from './helpers/auth.helper';

test.describe('Authentication', () => {
  let auth: AuthHelper;

  test.beforeEach(async ({ page }) => {
    auth = new AuthHelper(page);
  });

  test.describe('Unauthenticated Access (Guards)', () => {
    test('should redirect an unauthenticated user from / to /login', async ({ page }) => {
      await page.goto('/');
      await expect(page).toHaveURL(/\/login/);
    });

    test('should redirect an unauthenticated user from /users to /login', async ({ page }) => {
      await page.goto('/users');
      await expect(page).toHaveURL(/\/login/);
    });
  });

  test.describe('Authenticated Access (Guards)', () => {
    test('should redirect an authenticated user from /login to /', async ({ page }) => {
      await auth.login(testUsers.agent.email, testUsers.agent.password);
      await expect(page).not.toHaveURL(/\/login/);
      
      // Attempt to access login page
      await page.goto('/login');
      await expect(page).not.toHaveURL(/\/login/);
      await expect(page).toHaveURL('/');
    });
  });

  test.describe('Form Validation & Invalid Login', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login');
    });

    test('should display validation errors for empty fields', async ({ page }) => {
      await page.click('button[type="submit"]');
      await expect(page.locator('text=Please enter a valid email address')).toBeVisible();
      await expect(page.locator('text=Password must be at least 6 characters')).toBeVisible();
    });

    test('should display validation errors for invalid email format and short passwords', async ({ page }) => {
      await page.fill('input[type="email"]', 'invalidemail');
      await page.fill('input[type="password"]', 'short');
      await page.click('button[type="submit"]');
      await expect(page.locator('text=Please enter a valid email address')).toBeVisible();
      await expect(page.locator('text=Password must be at least 6 characters')).toBeVisible();
    });

    test('should show an error message for an invalid password', async ({ page }) => {
      await page.fill('input[type="email"]', testUsers.admin.email);
      await page.fill('input[type="password"]', 'wrongpassword');
      await page.click('button[type="submit"]');
      await expect(page.locator('text=Invalid email or password')).toBeVisible();
    });

    test('should show an error message for a non-existent email', async ({ page }) => {
      await page.fill('input[type="email"]', 'nonexistent@example.com');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      await expect(page.locator('text=Invalid email or password')).toBeVisible();
    });
  });

  test.describe('Admin User Flow', () => {
    test('should successfully log in, access /users, and log out', async ({ page }) => {
      await auth.login(testUsers.admin.email, testUsers.admin.password);

      // Verify redirect to dashboard
      await expect(page).not.toHaveURL(/\/login/);
      
      // Verify access to /users
      await page.goto('/users');
      await expect(page).toHaveURL(/\/users/);
      await expect(page.locator('h1')).toBeVisible(); 

      // Go back to home to access the logout button
      await page.goto('/');

      // Logout using actual UI element
      await auth.logout();
      await expect(page).toHaveURL(/\/login/);
    });
  });

  test.describe('Agent User Flow', () => {
    test('should successfully log in, be denied /users, and log out', async ({ page }) => {
      await auth.login(testUsers.agent.email, testUsers.agent.password);

      // Verify redirect to dashboard
      await expect(page).not.toHaveURL(/\/login/);

      // Attempt to access /users, should be redirected to /
      await page.goto('/users');
      await expect(page).not.toHaveURL(/\/users/);
      await expect(page).toHaveURL('/');

      // Logout using actual UI element
      await auth.logout();
      await expect(page).toHaveURL(/\/login/);
    });
  });
});
