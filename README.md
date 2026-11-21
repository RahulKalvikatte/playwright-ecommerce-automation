# Playwright E-Commerce Automation Framework

A scalable end-to-end web automation testing framework built using **Playwright, TypeScript, and Page Object Model (POM)** to validate critical e-commerce workflows on the Automation Exercise application.

## Tech Stack

- Playwright with TypeScript
- Page Object Model (POM)
- Node.js and npm
- Git and GitHub
- GitHub Actions CI/CD
- HTML Reports, Screenshots, and Traces

## Application Under Test

https://automationexercise.com/

## Test Coverage

The framework includes 20 functional test cases covering:

- User login and logout
- Product listing and search
- Product details verification
- Add to cart and remove from cart
- Product quantity and price validation
- Checkout and address verification
- Payment form validation
- Order placement using dummy payment data
- Invoice download verification

## Framework Features

- Reusable Page Object classes
- Cross-browser testing with Chromium, Firefox, and WebKit
- Automated assertions and validations
- Environment-based test credentials
- Screenshots on test failure
- Playwright HTML reporting
- Trace collection on retry
- GitHub Actions CI/CD integration

## Installation

Clone the repository:

```bash
git clone https://github.com/RahulKalvikatte/playwright-ecommerce-automation.git
cd playwright-ecommerce-automation
```

Install dependencies:

```bash
npm ci
npx playwright install
```

## Environment Configuration

Create a `.env` file in the project root:

```env
AE_TEST_EMAIL=your_test_email
AE_TEST_PASSWORD=your_test_password
```

Use a dedicated account for testing. Do not commit credentials.

## Test Execution

Run all tests:

```bash
npx playwright test
```

Run tests in Chromium:

```bash
npx playwright test --project=chromium
```

Run a specific test module:

```bash
npx playwright test tests/checkout.spec.ts
```

View the HTML report:

```bash
npx playwright show-report
```

## CI/CD Integration

GitHub Actions automatically executes the Playwright test suite on pushes and pull requests to the `main` branch.

The workflow installs dependencies, configures browsers, executes automated tests, and uploads test reports as artifacts.

## Author

Rahul Kalvikatte

GitHub: https://github.com/RahulKalvikatte