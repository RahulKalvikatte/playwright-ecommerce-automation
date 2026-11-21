
import { test, expect } from '@playwright/test';
import { ProductsPage } from '../pages/ProductsPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';
import { CartPage } from '../pages/CartPage';

test.describe('Shopping Cart Tests', () => {
  test('TC09 - Verify product can be added to cart', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const productDetailsPage = new ProductDetailsPage(page);
    const cartPage = new CartPage(page);

    // Open Products page.
    await productsPage.navigate();

    // Select the first product.
    await productsPage.openFirstProduct();

    // Capture product details before adding to cart.
    const selectedProductName = (
      await productDetailsPage.productName.innerText()
    ).trim();

    const selectedProductPrice = (
      await productDetailsPage.price.innerText()
    ).trim();

    // Add selected product to cart.
    await productDetailsPage.addToCart();

    // Open cart from confirmation dialog.
    await expect(cartPage.viewCartLink).toBeVisible();
    await cartPage.openCart();

    // Verify cart page URL.
    await expect(page).toHaveURL(/\/view_cart\/?$/);

    // Verify exactly one product is present.
    await expect(cartPage.cartRows).toHaveCount(1);

    // Verify the correct product was added.
    await expect(cartPage.productNames.first()).toHaveText(
      selectedProductName
    );

    // Verify the displayed price matches the product price.
    await expect(cartPage.productPrices.first()).toHaveText(
      selectedProductPrice
    );

    // Verify the initial quantity is 1.
    await expect(cartPage.productQuantities.first()).toHaveText('1');
  });


test('TC10 - Verify selected product quantity in cart', async ({ page }) => {
  const productsPage = new ProductsPage(page);
  const productDetailsPage = new ProductDetailsPage(page);
  const cartPage = new CartPage(page);

  const expectedQuantity = 4;

  // Navigate to the Products page.
  await productsPage.navigate();

  // Open the first product.
  await productsPage.openFirstProduct();

  // Capture the selected product name.
  const selectedProductName = (
    await productDetailsPage.productName.innerText()
  ).trim();

  // Set product quantity.
  await productDetailsPage.setQuantity(expectedQuantity);

  // Verify quantity before adding to cart.
  await expect(
    productDetailsPage.quantityInput
  ).toHaveValue(expectedQuantity.toString());

  // Add product to cart.
  await productDetailsPage.addToCart();

  // Open cart.
  await expect(cartPage.viewCartLink).toBeVisible();
  await cartPage.openCart();

  // Verify cart URL.
  await expect(page).toHaveURL(/\/view_cart\/?$/);

  // Locate the selected product's row.
  const selectedProductRow = cartPage.cartRows.filter({
    has: page.locator('.cart_description h4 a', {
      hasText: selectedProductName,
    }),
  });

  await expect(selectedProductRow).toHaveCount(1);

  // Verify the selected quantity.
  await expect(
    selectedProductRow.locator('.cart_quantity button')
  ).toHaveText(expectedQuantity.toString());
});


test('TC11 - Verify product can be removed from cart', async ({ page }) => {
  const productsPage = new ProductsPage(page);
  const productDetailsPage = new ProductDetailsPage(page);
  const cartPage = new CartPage(page);

  // Navigate to Products page.
  await productsPage.navigate();

  // Open the first product.
  await productsPage.openFirstProduct();

  // Capture selected product name.
  const selectedProductName = (
    await productDetailsPage.productName.innerText()
  ).trim();

  // Add product to cart.
  await productDetailsPage.addToCart();

  // Open cart.
  await expect(cartPage.viewCartLink).toBeVisible();
  await cartPage.openCart();

  await expect(page).toHaveURL(/\/view_cart\/?$/);

  // Identify the selected product in the cart.
  const selectedProductRow = cartPage.cartRows.filter({
    has: page.locator('.cart_description h4 a', {
      hasText: selectedProductName,
    }),
  });

  // Verify product exists before removal.
  await expect(selectedProductRow).toHaveCount(1);

  // Remove selected product.
  await cartPage.removeProduct(selectedProductName);

  // Verify product is removed.
  await expect(selectedProductRow).toHaveCount(0);
});


test('TC12 - Verify multiple products can be added to cart', async ({ page }) => {
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);

  // Open Products page.
  await productsPage.navigate();

  // Capture the first two product names and prices.
  const firstProduct = productsPage.productCards.nth(0);
  const secondProduct = productsPage.productCards.nth(1);

  const firstProductName = (
    await firstProduct.locator('.productinfo p').innerText()
  ).trim();

  const secondProductName = (
    await secondProduct.locator('.productinfo p').innerText()
  ).trim();

  const firstProductPrice = (
    await firstProduct.locator('.productinfo h2').innerText()
  ).trim();

  const secondProductPrice = (
    await secondProduct.locator('.productinfo h2').innerText()
  ).trim();

  // Add both products.
  await productsPage.addProductFromListing(0);
  await productsPage.addProductFromListing(1);

  // Navigate to the cart.
  await page.goto('/view_cart', {
    waitUntil: 'domcontentloaded',
  });

  // Verify exactly two products are present.
  await expect(cartPage.cartRows).toHaveCount(2);

  // Verify the first product.
  const firstCartRow = cartPage.cartRows.filter({
    has: page.locator('.cart_description h4 a', {
      hasText: firstProductName,
    }),
  });

  await expect(firstCartRow).toHaveCount(1);
  await expect(
    firstCartRow.locator('.cart_price p')
  ).toHaveText(firstProductPrice);

  // Verify the second product.
  const secondCartRow = cartPage.cartRows.filter({
    has: page.locator('.cart_description h4 a', {
      hasText: secondProductName,
    }),
  });

  await expect(secondCartRow).toHaveCount(1);
  await expect(
    secondCartRow.locator('.cart_price p')
  ).toHaveText(secondProductPrice);
});


test('TC13 - Verify cart total price calculation', async ({ page }) => {
  const productsPage = new ProductsPage(page);
  const productDetailsPage = new ProductDetailsPage(page);
  const cartPage = new CartPage(page);

  const expectedQuantity = 3;

  // Navigate to Products page.
  await productsPage.navigate();

  // Open first product.
  await productsPage.openFirstProduct();

  // Capture product name and unit price.
  const productName = (
    await productDetailsPage.productName.innerText()
  ).trim();

  const priceText = (
    await productDetailsPage.price.innerText()
  ).trim();

  // Extract the numeric price.
  const unitPrice = Number(
  priceText.replace(/Rs\.\s*/i, '').replace(/,/g, '').trim()
);

  expect(Number.isFinite(unitPrice)).toBe(true);
  expect(unitPrice).toBeGreaterThan(0);

  // Set quantity and add product.
  await productDetailsPage.setQuantity(expectedQuantity);
  await productDetailsPage.addToCart();

  // Open cart.
  await expect(cartPage.viewCartLink).toBeVisible();
  await cartPage.openCart();

  await expect(page).toHaveURL(/\/view_cart\/?$/);

  // Identify the correct cart row.
  const productRow = cartPage.cartRows.filter({
    has: page.locator('.cart_description h4 a', {
      hasText: productName,
    }),
  });

  await expect(productRow).toHaveCount(1);

  // Verify cart quantity.
  await expect(
    productRow.locator('.cart_quantity button')
  ).toHaveText(expectedQuantity.toString());

  // Read actual cart total.
  const totalText = await cartPage.getProductTotal(productName);

  const actualTotal = Number(
  totalText.replace(/Rs\.\s*/i, '').replace(/,/g, '').trim()
);

  // Calculate expected total independently.
  const expectedTotal = unitPrice * expectedQuantity;

  console.log('Unit Price:', unitPrice);
console.log('Quantity:', expectedQuantity);
console.log('Expected Total:', expectedTotal);
console.log('Actual Total:', actualTotal);

  // Verify total calculation.
  expect(actualTotal).toBe(expectedTotal);
});


});
