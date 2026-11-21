
import { type Page, type Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly loginHeading: Locator;
  readonly errorMessage: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;

    const loginSection = page.locator('.login-form');

    this.emailInput = loginSection.getByPlaceholder('Email Address');
    this.passwordInput = loginSection.getByPlaceholder('Password');

    this.loginButton = loginSection.getByRole('button', {
      name: 'Login',
      exact: true,
    });

    this.loginHeading = loginSection.getByRole('heading', {
      name: 'Login to your account',
    });

    this.errorMessage = loginSection.getByText(
      'Your email or password is incorrect!'
    );

    this.logoutLink = page.getByRole('link', {
      name: /Logout/,
    });
  }

  async navigate(): Promise<void> {
    await this.page.goto('/login', {
      waitUntil: 'domcontentloaded',
    });
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async logout(): Promise<void> {
    await this.logoutLink.click();
  }
}
