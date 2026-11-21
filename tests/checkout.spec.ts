
import { test, expect } from '@playwright/test';
import { ProductsPage } from '../pages/ProductsPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { LoginPage } from '../pages/LoginPage';
import { parsePrice } from '../utils/priceUtils';

import { PaymentPage } from '../pages/PaymentPage';

test.describe('Checkout Tests', () => {
  test('TC14 - Verify checkout requires login', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const productDetailsPage = new ProductDetailsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Open Products page.
    await productsPage.navigate();

    // Select first product.
    await productsPage.openFirstProduct();

    // Add product to cart.
    await productDetailsPage.addToCart();

    // Open shopping cart.
    await expect(cartPage.viewCartLink).toBeVisible();
    await cartPage.openCart();

    // Verify cart page.
    await expect(page).toHaveURL(/\/view_cart\/?$/);
    await expect(cartPage.cartRows.first()).toBeVisible();

    // Attempt checkout without authentication.
    await cartPage.proceedToCheckout();

    // Verify login requirement.
    await expect(
      checkoutPage.loginRequiredMessage
    ).toBeVisible();

    // Verify Register/Login option.
    await expect(
      checkoutPage.registerLoginLink
    ).toBeVisible();

    // Navigate to Login page.
    await checkoutPage.openRegisterLogin();

    await expect(page).toHaveURL(/\/login\/?$/);
  });


test('TC15 - Verify checkout with logged-in user', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const productsPage = new ProductsPage(page);
  const productDetailsPage = new ProductDetailsPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  const email = process.env.AE_TEST_EMAIL;
  const password = process.env.AE_TEST_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'AE_TEST_EMAIL and AE_TEST_PASSWORD must be configured'
    );
  }

  // Login.
  await loginPage.navigate();
  await loginPage.login(email, password);

  await expect(loginPage.logoutLink).toBeVisible();

  // Navigate to Products.
  await productsPage.navigate();

  // Open first product.
  await productsPage.openFirstProduct();

  const selectedProductName = (
    await productDetailsPage.productName.innerText()
  ).trim();

  // Add product to cart.
  await productDetailsPage.addToCart();

  // Open cart.
  await expect(cartPage.viewCartLink).toBeVisible();
  await cartPage.openCart();

  await expect(page).toHaveURL(/\/view_cart\/?$/);

  // Proceed to checkout.
  await cartPage.proceedToCheckout();

  // Verify checkout page.
  await expect(page).toHaveURL(/\/checkout\/?$/);

  // Verify delivery and billing addresses.
  await expect(checkoutPage.deliveryAddress).toBeVisible();
  await expect(checkoutPage.billingAddress).toBeVisible();

  // Verify order review section.
  await expect(
    checkoutPage.reviewOrderHeading
  ).toBeVisible();

  // Verify selected product appears in order review.
  
  // Verify selected product appears in checkout order review.
  
  // Verify selected product appears in checkout order review.
  const selectedProductRow = checkoutPage.orderRows.filter({
    has: page.getByRole('link', {
      name: selectedProductName,
      exact: true,
    }),
  });

  await expect(selectedProductRow).toHaveCount(1);


});


test('TC16 - Verify checkout order summary calculation', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const productsPage = new ProductsPage(page);
  const productDetailsPage = new ProductDetailsPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  const email = process.env.AE_TEST_EMAIL;
  const password = process.env.AE_TEST_PASSWORD;

  if (!email || !password) {
    throw new Error('Test account credentials are not configured');
  }

  const expectedQuantity = 2;

  // Login with valid credentials.
  await loginPage.navigate();
  await loginPage.login(email, password);

  await expect(loginPage.logoutLink).toBeVisible();
  // Clear existing cart items to ensure test isolation.
  
  await page.goto('/view_cart', {
    waitUntil: 'domcontentloaded',
  });

  const existingRows = cartPage.cartRows;

  while (await existingRows.count() > 0) {
    const previousCount = await existingRows.count();

    await existingRows.first()
      .locator('.cart_quantity_delete')
      .click();

    await expect(existingRows).toHaveCount(previousCount - 1);
  }



  // Open a product.
  await productsPage.navigate();
  await productsPage.openFirstProduct();

  const productName = (
    await productDetailsPage.productName.innerText()
  ).trim();

  const unitPrice = parsePrice(
    await productDetailsPage.price.innerText()
  );

  // Set quantity and add to cart.
  await productDetailsPage.setQuantity(expectedQuantity);
  await productDetailsPage.addToCart();

  await expect(cartPage.viewCartLink).toBeVisible();
  await cartPage.openCart();

  // Verify the cart contains the selected product.
  const cartProductRow = cartPage.cartRows.filter({
    has: page.getByRole('link', {
      name: productName,
      exact: true,
    }),
  });

  await expect(cartProductRow).toHaveCount(1);

  // Proceed to checkout.
  await cartPage.proceedToCheckout();

  await expect(page).toHaveURL(/\/checkout\/?$/);

  // Locate the product in the checkout order summary.
  const orderRow = checkoutPage.getProductRow(productName);

  await expect(orderRow).toHaveCount(1);

  // Verify quantity.
  await expect(
    orderRow.getByRole('button', {
      name: expectedQuantity.toString(),
      exact: true,
    })
  ).toBeVisible();

  // Read price and total from their respective table cells.
  const cells = orderRow.getByRole('cell');

  const checkoutUnitPrice = parsePrice(
    await cells.nth(2).innerText()
  );

  const checkoutTotal = parsePrice(
    await cells.nth(4).innerText()
  );

  // Verify price matches product details.
  expect(checkoutUnitPrice).toBe(unitPrice);

  // Verify the total calculation.
  expect(checkoutTotal).toBe(
    checkoutUnitPrice * expectedQuantity
  );
});


test('TC17 - Verify payment form fields', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const productsPage = new ProductsPage(page);
  const productDetailsPage = new ProductDetailsPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);
  const paymentPage = new PaymentPage(page);

  const email = process.env.AE_TEST_EMAIL;
  const password = process.env.AE_TEST_PASSWORD;

  if (!email || !password) {
    throw new Error('Test account credentials are not configured');
  }

  // Login.
  await loginPage.navigate();
  await loginPage.login(email, password);

  await expect(loginPage.logoutLink).toBeVisible();

  // Clear existing cart items for test isolation.
  await page.goto('/view_cart', {
    waitUntil: 'domcontentloaded',
  });

  const existingRows = cartPage.cartRows;

  while (await existingRows.count() > 0) {
    const previousCount = await existingRows.count();

    await existingRows.first()
      .locator('.cart_quantity_delete')
      .click();

    await expect(existingRows).toHaveCount(previousCount - 1);
  }

  // Add product to cart.
  await productsPage.navigate();
  await productsPage.openFirstProduct();
  await productDetailsPage.addToCart();

  // Open cart.
  await expect(cartPage.viewCartLink).toBeVisible();
  await cartPage.openCart();

  await expect(page).toHaveURL(/\/view_cart\/?$/);

  // Proceed to checkout.
  await cartPage.proceedToCheckout();

  await expect(page).toHaveURL(/\/checkout\/?$/);

  // Navigate to payment page.
  await checkoutPage.placeOrder();

  await expect(page).toHaveURL(/\/payment\/?$/);

  // Verify payment form fields.
  await expect(paymentPage.nameOnCard).toBeVisible();
  await expect(paymentPage.cardNumber).toBeVisible();
  await expect(paymentPage.cvc).toBeVisible();
  await expect(paymentPage.expiryMonth).toBeVisible();
  await expect(paymentPage.expiryYear).toBeVisible();

  // Verify payment submission button.
  await expect(paymentPage.payButton).toBeVisible();
});


test('TC18 - Verify required payment field validation', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const productsPage = new ProductsPage(page);
  const productDetailsPage = new ProductDetailsPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);
  const paymentPage = new PaymentPage(page);

  const email = process.env.AE_TEST_EMAIL;
  const password = process.env.AE_TEST_PASSWORD;

  if (!email || !password) {
    throw new Error('Test account credentials are not configured');
  }

  // Login.
  await loginPage.navigate();
  await loginPage.login(email, password);

  await expect(loginPage.logoutLink).toBeVisible();

  // Clear existing cart items.
  await page.goto('/view_cart', {
    waitUntil: 'domcontentloaded',
  });

  const existingRows = cartPage.cartRows;

  while (await existingRows.count() > 0) {
    const previousCount = await existingRows.count();

    await existingRows.first()
      .locator('.cart_quantity_delete')
      .click();

    await expect(existingRows).toHaveCount(previousCount - 1);
  }

  // Add a product.
  await productsPage.navigate();
  await productsPage.openFirstProduct();
  await productDetailsPage.addToCart();

  await expect(cartPage.viewCartLink).toBeVisible();
  await cartPage.openCart();

  // Checkout.
  await cartPage.proceedToCheckout();

  await expect(page).toHaveURL(/\/checkout\/?$/);

  // Open payment page.
  await checkoutPage.placeOrder();

  await expect(page).toHaveURL(/\/payment\/?$/);

  // Verify payment fields are initially empty.
  await expect(paymentPage.nameOnCard).toBeEmpty();
  await expect(paymentPage.cardNumber).toBeEmpty();
  await expect(paymentPage.cvc).toBeEmpty();
  await expect(paymentPage.expiryMonth).toBeEmpty();
  await expect(paymentPage.expiryYear).toBeEmpty();

  // Attempt to submit without entering payment details.
  await paymentPage.submitPayment();

  // Verify browser blocks the submission.
  await expect(page).toHaveURL(/\/payment\/?$/);

  // Verify required field remains invalid.
  const isInvalid = await paymentPage.nameOnCard.evaluate(
    (element: HTMLInputElement) => !element.checkValidity()
  );

  expect(isInvalid).toBe(true);
});


test('TC19 - Verify successful order placement', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const productsPage = new ProductsPage(page);
  const productDetailsPage = new ProductDetailsPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);
  const paymentPage = new PaymentPage(page);

  const email = process.env.AE_TEST_EMAIL;
  const password = process.env.AE_TEST_PASSWORD;

  if (!email || !password) {
    throw new Error('Test account credentials are not configured');
  }

  // Login.
  await loginPage.navigate();
  await loginPage.login(email, password);

  await expect(loginPage.logoutLink).toBeVisible();

  // Clear existing cart items.
  await page.goto('/view_cart', {
    waitUntil: 'domcontentloaded',
  });

  while (await cartPage.cartRows.count() > 0) {
    const previousCount = await cartPage.cartRows.count();

    await cartPage.cartRows.first()
      .locator('.cart_quantity_delete')
      .click();

    await expect(cartPage.cartRows).toHaveCount(previousCount - 1);
  }

  // Add product to cart.
  await productsPage.navigate();
  await productsPage.openFirstProduct();
  await productDetailsPage.addToCart();

  await expect(cartPage.viewCartLink).toBeVisible();
  await cartPage.openCart();

  await expect(cartPage.cartRows.first()).toBeVisible();

  // Checkout.
  await cartPage.proceedToCheckout();
  await expect(page).toHaveURL(/\/checkout\/?$/);

  // Open payment page.
  await checkoutPage.placeOrder();
  await expect(page).toHaveURL(/\/payment\/?$/);

  // Enter dummy payment details.
  await paymentPage.enterPaymentDetails();

  // Submit order.
  await paymentPage.submitPayment();

  // Verify successful order confirmation.
  await expect(page).toHaveURL(/\/payment_done\/\d+\/?$/);

  await expect(
    page.getByText('Congratulations! Your order has been confirmed!', {
      exact: true,
    })
  ).toBeVisible();
});


test('TC20 - Verify order invoice download', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const productsPage = new ProductsPage(page);
  const productDetailsPage = new ProductDetailsPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);
  const paymentPage = new PaymentPage(page);

  const email = process.env.AE_TEST_EMAIL;
  const password = process.env.AE_TEST_PASSWORD;

  if (!email || !password) {
    throw new Error('Test account credentials are not configured');
  }

  // Login.
  await loginPage.navigate();
  await loginPage.login(email, password);

  await expect(loginPage.logoutLink).toBeVisible();

  // Clear existing cart items.
  await page.goto('/view_cart', {
    waitUntil: 'domcontentloaded',
  });

  while (await cartPage.cartRows.count() > 0) {
    const previousCount = await cartPage.cartRows.count();

    await cartPage.cartRows.first()
      .locator('.cart_quantity_delete')
      .click();

    await expect(cartPage.cartRows).toHaveCount(previousCount - 1);
  }

  // Add product.
  await productsPage.navigate();
  await productsPage.openFirstProduct();
  await productDetailsPage.addToCart();

  await expect(cartPage.viewCartLink).toBeVisible();
  await cartPage.openCart();

  await expect(cartPage.cartRows.first()).toBeVisible();

  // Checkout.
  await cartPage.proceedToCheckout();
  await expect(page).toHaveURL(/\/checkout\/?$/);

  // Open payment page.
  await checkoutPage.placeOrder();
  await expect(page).toHaveURL(/\/payment\/?$/);

  // Enter dummy payment details.
  await paymentPage.enterPaymentDetails();
  await paymentPage.submitPayment();

  // Verify order confirmation.
  await expect(page).toHaveURL(/\/payment_done\/\d+\/?$/);

  await expect(
    page.getByText('Congratulations! Your order has been confirmed!', {
      exact: true,
    })
  ).toBeVisible();

  // Verify invoice download link.
  await expect(
    paymentPage.downloadInvoiceButton
  ).toBeVisible();

  // Wait for download event.
  const downloadPromise = page.waitForEvent('download');

  await paymentPage.downloadInvoiceButton.click();

  const download = await downloadPromise;

  // Verify download completed successfully.
  expect(download.suggestedFilename()).toMatch(
    /\.(pdf|txt)$/i
  );

  expect(await download.failure()).toBeNull();
});


});
