
import { test, expect } from '@playwright/test';

test('Verify Automation Exercise homepage loads successfully', async ({ page }) => {
  await page.goto('/', {
    waitUntil: 'domcontentloaded',
    timeout: 30000,
  });

  await expect(page).toHaveURL(
    'https://automationexercise.com/'
  );

  // Locate the Products navigation link.
  const productsLink = page.getByRole('link', {
    name: /Products/,
  });

  await expect(productsLink).toBeVisible();
  await expect(productsLink).toHaveAttribute('href', '/products');
});
