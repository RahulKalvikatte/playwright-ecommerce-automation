
import { type Page, type Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly viewCartLink: Locator;
  readonly cartRows: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;
  readonly productQuantities: Locator;
  readonly productTotals: Locator;
  readonly proceedToCheckoutButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.viewCartLink = page.getByRole('link', {
      name: 'View Cart',
      exact: true,
    });

    this.cartRows = page.locator('#cart_info_table tbody tr');

    this.productNames = page.locator(
      '#cart_info_table .cart_description h4 a'
    );

    this.productPrices = page.locator(
      '#cart_info_table .cart_price p'
    );

    this.productQuantities = page.locator(
      '#cart_info_table .cart_quantity button'
    );
    this.productTotals = page.locator(
    '#cart_info_table .cart_total .cart_total_price'
    );
    this.proceedToCheckoutButton = page.getByText(
  'Proceed To Checkout',
  { exact: true }
);
  }

  async openCart(): Promise<void> {
    await this.viewCartLink.click();
  }


    async removeProduct(productName: string): Promise<void> {
    const productRow = this.cartRows.filter({
        has: this.page.locator('.cart_description h4 a', {
        hasText: productName,
        }),
    });

    await productRow.locator('.cart_quantity_delete').click();
    }


    async getProductTotal(productName: string): Promise<string> {
    const productRow = this.cartRows.filter({
        has: this.page.locator('.cart_description h4 a', {
        hasText: productName,
        }),
    });

    return (
        await productRow.locator('.cart_total_price').innerText()
    ).trim();
    }
    async proceedToCheckout(): Promise<void> {
  await this.proceedToCheckoutButton.click();
}


}
