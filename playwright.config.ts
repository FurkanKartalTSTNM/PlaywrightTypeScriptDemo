import { defineConfig, devices } from '@playwright/test';

const reportRoot = process.env.PLAYWRIGHT_REPORT_ROOT ?? 'test-results';
const htmlReportDir = process.env.PLAYWRIGHT_HTML_OUTPUT_DIR ?? 'playwright-report';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  expect: {
    timeout: 5_000
  },
  fullyParallel: true,
  outputDir: `${reportRoot}/artifacts`,
  reporter: [
    ['line'],
    ['html', { open: 'never', outputFolder: htmlReportDir }],
    ['junit', {
      outputFile: `${reportRoot}/junit.xml`,
      includeProjectInTestName: true,
      stripANSIControlSequences: true
    }],
    ['blob', { outputDir: `${reportRoot}/blob-report` }]
  ],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    }
  ]
});
