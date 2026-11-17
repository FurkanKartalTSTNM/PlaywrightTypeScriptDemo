import { expect, test, type Page } from '@playwright/test';

/**
 * Long-running scenarios for testing the executor's max execution time and timeouts.
 *
 * Each test keeps working for N "units"; one unit is LONG_TEST_UNIT_SECONDS (default 60 s), so by default:
 *   1 minute, 3 minutes, 5 minutes per test and per Playwright project.
 * Set LONG_TEST_UNIT_SECONDS (e.g. as a plan environment parameter) to make them shorter or longer.
 * The per-test timeout grows with the duration, so only the executor's max execution time can stop them.
 */
const unitSeconds = Number(process.env.LONG_TEST_UNIT_SECONDS ?? 60);
const stepSeconds = 10;

async function keepWorking(page: Page, seconds: number) {
  await page.setContent(`
    <main>
      <h1>Long running job</h1>
      <progress max="${seconds}" value="0"></progress>
      <output data-testid="elapsed">0</output>
    </main>
  `);
  for (let elapsed = stepSeconds; elapsed <= seconds; elapsed += stepSeconds) {
    await page.waitForTimeout(stepSeconds * 1000);
    await page.evaluate((value) => {
      document.querySelector('progress')!.value = value;
      document.querySelector('[data-testid="elapsed"]')!.textContent = String(value);
    }, elapsed);
    await expect(page.getByTestId('elapsed')).toHaveText(String(elapsed));
  }
}

function durationSeconds(units: number) {
  return Math.max(stepSeconds, Math.round(units * unitSeconds));
}

// Each test is declared on its own line: tests created in a loop share one file:line:column, so selecting one
// of them (Testinium runs `file:line:column`) would run all of them.
test.describe('Long running jobs', () => {
  test('finishes a 1-unit job @long', async ({ page }) => {
    test.setTimeout((durationSeconds(1) + 60) * 1000);
    await keepWorking(page, durationSeconds(1));
  });

  test('finishes a 3-unit job @long', async ({ page }) => {
    test.setTimeout((durationSeconds(3) + 60) * 1000);
    await keepWorking(page, durationSeconds(3));
  });

  test('finishes a 5-unit job @long', async ({ page }) => {
    test.setTimeout((durationSeconds(5) + 60) * 1000);
    await keepWorking(page, durationSeconds(5));
  });
});
