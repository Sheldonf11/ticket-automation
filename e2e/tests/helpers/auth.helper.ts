import { Page } from '@playwright/test';

export const testUsers = {
  admin: {
    email: 'test@example.com',
    password: 'password123',
  },
  agent: {
    email: 'agent@example.com',
    password: 'password123',
  },
};

export class AuthHelper {
  constructor(public readonly page: Page) {}

  async login(email = testUsers.admin.email, password = testUsers.admin.password) {
    await this.page.goto('/login');
    await this.page.fill('input[type="email"]', email);
    await this.page.fill('input[type="password"]', password);
    await this.page.click('button[type="submit"]');
  }

  async logout() {
    // Assuming the "Sign Out" button has the text "Sign Out"
    await this.page.click('button:has-text("Sign Out")');
  }
}
