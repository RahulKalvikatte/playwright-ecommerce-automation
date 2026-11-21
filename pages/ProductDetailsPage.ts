
import { type Page, type Locator } from '@playwright/test';

export class ProductDetailsPage {
  readonly page: Page;
  readonly productName: Locator;
  readonly category: Locator;
  readonly price: Locator;
  readonly availability: Locator;
  readonly condition: Locator;
  readonly addToCartButton: Locator;
  readonly quantityInput: Locator;

  constructor(page: Page) {
    this.page = page;

    const productInfo = page.locator('.product-information');

    this.productName = productInfo.locator('h2');

    this.category = productInfo.locator('p').filter({
      hasText: 'Category:',
    });

    this.price = productInfo.locator('span span');

    this.availability = productInfo.locator('p').filter({
      hasText: 'Availability:',
    });

    this.condition = productInfo.locator('p').filter({
      hasText: 'Condition:',
    });

    this.addToCartButton = page.getByRole('button', {
        name: /Add to cart/i,
    });

    this.quantityInput = page.locator('#quantity');
    
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
    }


async setQuantity(quantity: number): Promise<void> {
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error('Quantity must be a positive integer');
  }

  await this.quantityInput.fill(quantity.toString());
}

}
