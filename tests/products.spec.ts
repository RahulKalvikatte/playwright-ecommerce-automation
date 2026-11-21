
import { test, expect } from '@playwright/test';
import { ProductsPage } from '../pages/ProductsPage';

test.describe('Product Tests', () => {
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    productsPage = new ProductsPage(page);
    await productsPage.navigate();
  });

  test('TC05 - Verify Products page loads successfully', async ({ page }) => {
    await expect(page).toHaveURL(/\/products\/?$/);

    await expect(productsPage.productsHeading).toBeVisible();

    await expect(
      productsPage.productCards.first()
    ).toBeVisible();
  });

  test('TC06 - Verify search for an existing product', async () => {
    await productsPage.searchProduct('Blue Top');

    await expect(
      productsPage.searchedProductsHeading
    ).toBeVisible();

    await expect(
      productsPage.productCards.first()
    ).toBeVisible();

    await expect(
      productsPage.productCards.first()
    ).toContainText('Blue Top');
  });

  test('TC07 - Verify search for a nonexistent product', async () => {
    await productsPage.searchProduct(
      'NonexistentProductXYZ987654'
    );

    await expect(
      productsPage.searchedProductsHeading
    ).toBeVisible();

    await expect(productsPage.productCards).toHaveCount(0);
  });
});
