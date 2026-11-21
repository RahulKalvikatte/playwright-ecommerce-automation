
import { test, expect } from '@playwright/test';
import { ProductsPage } from '../pages/ProductsPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';

test.describe('Product Details Tests', () => {
  test('TC08 - Verify product details are displayed', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const productDetailsPage = new ProductDetailsPage(page);

    // Navigate to Products page.
    await productsPage.navigate();

    // Open first available product.
    await productsPage.openFirstProduct();

    // Verify product details page URL.
    await expect(page).toHaveURL(/\/product_details\/\d+\/?$/);

    // Verify product name is displayed.
    await expect(
      productDetailsPage.productName
    ).toBeVisible();

    // Verify category is displayed.
    await expect(
      productDetailsPage.category
    ).toContainText('Category:');

    // Verify product price is displayed.
    await expect(
      productDetailsPage.price
    ).toContainText(/Rs\.\s*\d+/);

    // Verify availability is displayed.
    await expect(
      productDetailsPage.availability
    ).toContainText('Availability:');

    // Verify product condition is displayed.
    await expect(
      productDetailsPage.condition
    ).toContainText('Condition:');
  });
});
