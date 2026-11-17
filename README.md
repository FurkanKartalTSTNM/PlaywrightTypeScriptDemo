# Playwright TypeScript Sample

Playwright TypeScript project for Testinium scenario discovery and execution.
The tests use inline HTML with `page.setContent`, so they do not require external internet access.

## Commands

```bash
npm ci
npm run test:list
npm run test:quick   # every test except @long
npm run test:long    # long running jobs only
npm run typecheck
```

## Tests

| File | Scenarios | Notes |
| --- | --- | --- |
| `tests/login.spec.ts` | 2 | `@smoke` |
| `tests/cart.spec.ts` | 1 | `@regression` |
| `tests/search.spec.ts` | 4 | 3 of them are generated in a loop and share one `file:line:column` |
| `tests/checkout.spec.ts` | 4 | `beforeEach` and a nested `describe` |
| `tests/long-running.spec.ts` | 3 | `@long`: 1, 3 and 5 units per test and project |

Every scenario runs in both `chromium` and `firefox`.

## Long running tests (max execution time)

One unit is `LONG_TEST_UNIT_SECONDS` seconds (default `60`), so by default the jobs take 1, 3 and 5 minutes.
Each test raises its own Playwright timeout to its duration + 60 s, so only Testinium's max execution time
can stop it. Set `LONG_TEST_UNIT_SECONDS` as a plan environment parameter to make the jobs shorter or longer.

Example: plan max execution time 2 minutes + the 3-unit job (3 minutes) → the run is stopped by the timeout.
