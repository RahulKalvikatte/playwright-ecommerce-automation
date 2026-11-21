
import { type Page, type Locator } from '@playwright/test';

export class ProductsPage {
  readonly page: Page;
  readonly productsLink: Locator;
  readonly productsHeading: Locator;
  readonly productCards: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly searchedProductsHeading: Locator;
  readonly viewProductLinks: Locator;
  readonly addToCartButtons: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.productsLink = page.locator('a[href="/products"]');

    this.productsHeading = page.getByRole('heading', {
      name: 'All Products',
      exact: true,
    });

    this.viewProductLinks = page.locator(
      '.features_items a[href^="/product_details/"]'
    );

    this.productCards = page.locator(
      '.features_items .product-image-wrapper'
    );

    this.searchInput = page.locator('#search_product');

    this.searchButton = page.locator('#submit_search');

    this.searchedProductsHeading = page.getByRole('heading', {
      name: 'Searched Products',
      exact: true,
    });
    this.addToCartButtons = page.locator(
  '.features_items .product-overlay a.add-to-cart'
    );

    this.continueShoppingButton = page.getByRole('button', {
      name: 'Continue Shopping',
    });
  }

  async navigate(): Promise<void> {
    await this.page.goto('/products', {
      waitUntil: 'domcontentloaded',
    });
  }

  async openFromNavigation(): Promise<void> {
    await this.productsLink.click();
  }

  async searchProduct(productName: string): Promise<void> {
    await this.searchInput.fill(productName);
    await this.searchButton.click();
  }

  async openFirstProduct(): Promise<void> {
    await this.viewProductLinks.first().click();
  }


  async addProductFromListing(index: number): Promise<void> {
    const productCard = this.productCards.nth(index);

    // Hover to reveal the product overlay.
    await productCard.hover();

    // Click the Add to cart button inside this product card.
    await productCard
      .locator('.product-overlay a.add-to-cart')
      .click();

    // Close confirmation modal.
    await this.continueShoppingButton.click();
  }

}
