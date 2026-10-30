# v3 Phase 1 verification - 29 October 2026

Verified locally against Windows LocalDB with headless Microsoft Edge. These are results observed across focused runs after fixes, not a claim that every test in the repository or every physical device was tested.

| Suite | Distinct passing checks |
|---|---:|
| v3-reliability.spec.ts | 8 |
| recce.spec.ts | 3 |
| recce-validation.spec.ts | 1 |
| materials-csv.spec.ts | 5 |
| phase1.spec.ts | 5 |
| session.spec.ts | 4 |
| workflow.spec.ts | 3 |
| admin-workspace.spec.ts | 3 |
| product-admin-review.spec.ts | 6 |
| collaboration.spec.ts: real panorama viewer | 1 |
| Total | **39** |

The final affected-suite run (v3, materials/CSV, admin workspace, product review) passed 22 checks in `RecceFlow_V3_Tests_d2d16530`. The panorama check subsequently passed in `RecceFlow_V3_Tests_e9c28619`; its last-run JSON reported `status: passed`, with no failed tests. Earlier successful field/draft/session/office runs supply the remaining distinct checks. A failed panorama run exposed existing-marker hit targets intercepting placement; fixing placement and rerunning the same real canvas-click test resolved it.

The v3 checks cover independent repeated items/shared source images, custom Count, unit/area conversion, refreshing every stale view, no-access reporting, reset/access invalidation, last-admin concurrency, retry reconciliation, draft preservation across routes, dialog keyboard/dirty guards and responsive layouts. The full imported form was checked at 320/390/768/1440 widths for document overflow and reachable controls; register/editor tests also include tablet orientations and computed field sizes.

Build results:

```text
API: Build succeeded. 0 Warning(s). 0 Error(s).
Web: tsc -b && vite build completed (2057 modules transformed).
Lint: oxlint exited 0.
Local health: localhost:5080/api/health -> 200; localhost:5173 -> 200.
```

Vite still warns about the lazy panorama dependency chunk (about 630 kB minified / 162 kB gzip). It remains separately loaded; the warning was not hidden.

Run instructions and exact commands are in [the test guide](RecceFlow_v3_Phase1_Test_Guide.md). Isolated database/API/setup logs remain under `artifacts/sql/RecceFlow_V3_Tests_*`; Playwright's `artifacts/playwright/.last-run.json` represents only the latest invocation. Logs, backups and credentials are ignored local artifacts, not published test fixtures.

## Data preservation

- Verified COPY_ONLY/CHECKSUM backup: `artifacts/backups/v3-20261029-ba38bb4d/RecceFlowDb.bak`.
- Verified restore: `RecceFlow_V3_Restore_50437333`.
- Migration tested on that restore, then applied to the normal local database; only `Jobs.ContactName` is added to SQL schema.
- Original recce JSON, immutable review JSON, account hashes/flags and job/form/message counts matched after migration. All 265 original upload files were copied and SHA-256 checked, including a final source-file recheck.
- Fourteen early fictional v3 companies were disabled, not deleted. Scope was limited to test-owner-created companies absent from the verified restore, with exact-count/transaction guards and original-account/recce/form comparisons. Later test runs used separate databases.
- Existing company suspension and existing passwords were preserved. No database reset, customer-record purge, paid API enablement, push or deployment occurred.

## Remaining acceptance work

The [screenshots](screenshots/v3/README.md) show fictional current data at desktop/tablet/phone widths. Prior ignored phone baseline images exist; fresh pre-change captures at all sizes were not made. Browser emulation does not verify physical touch, native camera/microphone/GPS, zoom with an open virtual keyboard, device WebGL performance or screen-reader behavior. Test these on trusted HTTPS hardware before a pilot. Offline persistence, saved named views, canonical server-rendered previews and later-phase capabilities remain explicitly outside this checkpoint.
