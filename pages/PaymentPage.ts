
import { Page, Locator } from '@playwright/test';

export class PaymentPage {
  readonly page: Page;
  readonly nameOnCard: Locator;
  readonly cardNumber: Locator;
  readonly cvc: Locator;
  readonly expiryMonth: Locator;
  readonly expiryYear: Locator;
  readonly payButton: Locator;
  readonly downloadInvoiceButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.nameOnCard = page.locator('[data-qa="name-on-card"]');
    this.cardNumber = page.locator('[data-qa="card-number"]');
    this.cvc = page.locator('[data-qa="cvc"]');
    this.expiryMonth = page.locator('[data-qa="expiry-month"]');
    this.expiryYear = page.locator('[data-qa="expiry-year"]');
    this.payButton = page.locator('[data-qa="pay-button"]');
    this.downloadInvoiceButton = page.getByRole('link', {
    name: 'Download Invoice',
});
  }

async enterPaymentDetails(): Promise<void> {
  await this.nameOnCard.fill('Test User');
  await this.cardNumber.fill('4111111111111111');
  await this.cvc.fill('123');
  await this.expiryMonth.fill('12');
  await this.expiryYear.fill('2030');
}

async submitPayment(): Promise<void> {
  await this.payButton.click();
}

}
