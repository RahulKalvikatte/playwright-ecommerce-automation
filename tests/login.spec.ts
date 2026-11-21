
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Authentication Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('TC01 - Verify login page is displayed', async ({ page }) => {
    await expect(page).toHaveURL(/\/login\/?$/);
    await expect(loginPage.loginHeading).toBeVisible();
  });

  test('TC02 - Verify invalid login displays error', async ({ page }) => {
    await loginPage.login(
      'invaliduser@example.com',
      'InvalidPassword123'
    );

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(page).toHaveURL(/\/login\/?$/);
  });

  test('TC03 - Verify successful login', async ({ page }) => {
    const email = process.env.AE_TEST_EMAIL;
    const password = process.env.AE_TEST_PASSWORD;

    if (!email || !password) {
      throw new Error(
        'AE_TEST_EMAIL and AE_TEST_PASSWORD must be configured'
      );
    }

    await loginPage.login(email, password);

    await expect(
      page.getByRole('link', { name: /Logout/ })
    ).toBeVisible();

    await expect(page).not.toHaveURL(/\/login\/?$/);
  });


    test('TC04 - Verify successful logout', async ({ page }) => {
    const email = process.env.AE_TEST_EMAIL;
    const password = process.env.AE_TEST_PASSWORD;

    if (!email || !password) {
        throw new Error(
        'AE_TEST_EMAIL and AE_TEST_PASSWORD must be configured'
        );
    }

    // Login with valid credentials.
    await loginPage.login(email, password);

    // Confirm user is authenticated.
    await expect(loginPage.logoutLink).toBeVisible();

    // Perform logout.
    await loginPage.logout();

    // Verify user returns to the login page.
    await expect(page).toHaveURL(/\/login\/?$/);

    // Verify login form is displayed.
    await expect(loginPage.loginHeading).toBeVisible();

    // Verify Logout link is no longer available.
    await expect(loginPage.logoutLink).toHaveCount(0);
    });

});
