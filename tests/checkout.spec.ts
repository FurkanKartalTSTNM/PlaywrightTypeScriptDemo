import { expect, test } from '@playwright/test';

const checkoutPage = `
  <form novalidate>
    <label>Full name <input aria-label="Full name" required /></label>
    <label>Email <input aria-label="Email" type="email" required /></label>
    <label>Quantity <input aria-label="Quantity" type="number" value="1" min="1" max="5" /></label>
    <p data-testid="total">Total: 50 TL</p>
    <button type="submit">Place order</button>
    <p role="alert" hidden></p>
    <p data-testid="confirmation" hidden>Order received</p>
    <script>
      const form = document.querySelector('form');
      const quantity = form.querySelector('[aria-label="Quantity"]');
      quantity.addEventListener('input', () => {
        document.querySelector('[data-testid="total"]').textContent = 'Total: ' + (Number(quantity.value) * 50) + ' TL';
      });
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const alert = form.querySelector('[role="alert"]');
        const missing = [...form.querySelectorAll('[required]')].filter((input) => !input.value.trim());
        if (missing.length) {
          alert.textContent = missing.map((input) => input.getAttribute('aria-label')).join(', ') + ' is required';
          alert.hidden = false;
          return;
        }
        alert.hidden = true;
        document.querySelector('[data-testid="confirmation"]').hidden = false;
      });
    </script>
  </form>
`;

test.describe('Checkout', () => {
  test.beforeEach(async ({ page }) => {
    await page.setContent(checkoutPage);
  });

  test.describe('validation', () => {
    test('requires name and email @regression', async ({ page }) => {
      await page.getByRole('button', { name: 'Place order' }).click();
      await expect(page.getByRole('alert')).toHaveText('Full name, Email is required');
    });

    test('requires email when only name is filled @regression', async ({ page }) => {
      await page.getByLabel('Full name').fill('Demo User');
      await page.getByRole('button', { name: 'Place order' }).click();
      await expect(page.getByRole('alert')).toHaveText('Email is required');
    });
  });

  test('updates the total with quantity @regression', async ({ page }) => {
    await page.getByLabel('Quantity').fill('3');
    await expect(page.getByTestId('total')).toHaveText('Total: 150 TL');
  });

  test('places an order @smoke', async ({ page }) => {
    await page.getByLabel('Full name').fill('Demo User');
    await page.getByLabel('Email').fill('demo@testinium.com');
    await page.getByRole('button', { name: 'Place order' }).click();
    await expect(page.getByTestId('confirmation')).toBeVisible();
  });
});
