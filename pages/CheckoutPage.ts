
import { type Page, type Locator } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly loginRequiredMessage: Locator;
  readonly registerLoginLink: Locator;
  readonly deliveryAddress: Locator;
  readonly billingAddress: Locator;
  readonly reviewOrderHeading: Locator;
  readonly orderRows: Locator;
  readonly placeOrderButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Checkout login modal.
    this.loginRequiredMessage = page.getByText(
      /Register \/ Login account to proceed on checkout/i
    );

    this.registerLoginLink = page.locator(
      '#checkoutModal a[href="/login"]'
    );

    // Authenticated checkout page.
    this.deliveryAddress = page.locator(
      '#address_delivery'
    );

    this.billingAddress = page.locator(
      '#address_invoice'
    );

    this.reviewOrderHeading = page.getByText(
      'Review Your Order',
      { exact: true }
    );

    this.orderRows = page.getByRole('table').getByRole('row');

    this.placeOrderButton = page.getByRole('link', {
  name: 'Place Order',
  exact: true,
});
  }

  async openRegisterLogin(): Promise<void> {
    await this.registerLoginLink.click();
  }


    getProductRow(productName: string): Locator {
    return this.orderRows.filter({
        has: this.page.getByRole('link', {
        name: productName,
        exact: true,
        }),
    });
    }

    async placeOrder(): Promise<void> {
  await this.placeOrderButton.click();
}

}
