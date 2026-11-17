import { expect, test } from '@playwright/test';

const catalogPage = `
  <main>
    <label>Search <input aria-label="Search" /></label>
    <ul data-testid="results"></ul>
    <p data-testid="empty" hidden>No products found</p>
    <script>
      const products = ['Keyboard', 'Mouse', 'Monitor', 'Mouse pad', 'Laptop stand'];
      const input = document.querySelector('input');
      input.addEventListener('input', () => {
        const query = input.value.trim().toLowerCase();
        const matches = query ? products.filter((name) => name.toLowerCase().includes(query)) : [];
        document.querySelector('[data-testid="results"]').innerHTML =
          matches.map((name) => '<li>' + name + '</li>').join('');
        document.querySelector('[data-testid="empty"]').hidden = !query || matches.length > 0;
      });
    </script>
  </main>
`;

test.describe('Product search', () => {
  const cases = [
    { query: 'mouse', expected: ['Mouse', 'Mouse pad'] },
    { query: 'key', expected: ['Keyboard'] },
    { query: 'stand', expected: ['Laptop stand'] },
  ];

  for (const { query, expected } of cases) {
    test(`finds products for "${query}" @regression`, async ({ page }) => {
      await page.setContent(catalogPage);
      await page.getByLabel('Search').fill(query);
      await expect(page.getByRole('listitem')).toHaveText(expected);
    });
  }

  test('shows an empty state when nothing matches @smoke', async ({ page }) => {
    await page.setContent(catalogPage);
    await page.getByLabel('Search').fill('printer');
    await expect(page.getByTestId('empty')).toBeVisible();
    await expect(page.getByRole('listitem')).toHaveCount(0);
  });
});
