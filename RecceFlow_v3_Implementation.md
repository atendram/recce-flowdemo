# RecceFlow v3 implementation

Source: the user's 29 October review of commit `a80d5ad`. Phase 1 is implemented and locally verified as recorded below. Preserve existing data and the current React/.NET/SQL/Konva architecture.

## Phase 1 - current scope

- [x] Shared design tokens, Inter/Noto typography and field touch sizing.
- [x] Register filters/columns overlays, mobile cards and stable role-safe navigation; saved-view model design.
- [x] Shared async feedback and accessible dialogs, including guarded chat drafts.
- [x] Site / Assignment / Review creation with contact name and unchanged atomic operation semantics.
- [x] Mode-driven measurements, valid area units, independent repeated items and refresh of stale views.
- [x] Explicit no-access/revisit outcome with reason and truthful report semantics.
- [x] Strict CSV quotes/headers and visible skipped-heading warnings.
- [x] Generated worker credentials/reset, first-login change, revocation and last-admin protection/auditing.
- [x] Verified backup before additive migration; builds, focused regressions and screenshots.

Verification on 29 October: 39 distinct targeted checks passed across runs; API build, web production build and lint passed. See [the verification record](RecceFlow_v3_Verification.md), [screenshots](screenshots/v3/README.md) and [test guide](RecceFlow_v3_Phase1_Test_Guide.md). Physical phone/tablet camera, GPS, touch, zoom, virtual keyboard and screen-reader acceptance remain manual pilot checks; browser viewport and keyboard tests do not establish those results.

## Later phases

The subsequent [field/support/export update](Field_Voice_Exports_Recovery_Guide.md) adds small XLSX exports and browser PDF/print only. XLSX imports, reusable document layout/branding and template families below remain outstanding. Future reference backfills/retention must also protect `SiteNoteAudioId`, `InstallationPhotoIds` and the separate support-voice references; no purge may assume that all audio belongs to chat.

- Phase 2: separate job/form/catalog CSV/XLSX import pipelines; mapping/validation/idempotent commits; document layout blocks, immutable template families/versions and print preview. No automatic publication.
- Phase 3: coordinated chat deltas and complete catch-up; uncertain sends; bytes/hashes/staging, explicit current/history media references and quotas. No deletion by media kind/age.
- Phase 4: optional closure-based retention, Off by default; holds, alerts, dry-run report, reference verification, durable purge/backup reconciliation. Approval is not closure. Never purge customer data while developing.
- Phase 5: reviewed PDF/text/OCR adapters, disabled paid providers, explicit device/server offline state, later production/installation using approved versions.

## Boundaries

Do not deploy, push, contact clients, enable paid providers, reset existing passwords or delete/reseed data. Existing local credential files may be stale; never reproduce passwords in documentation or screenshots. Browser emulation cannot verify physical phone camera/GPS, keyboard or touch hardware.

Saved-view model design: a future server record uses CompanyId + UserId + ScreenKey + SchemaVersion, validated filter/sort values and allowlisted ordered columns. Do not store survey content or credentials in views. Until implemented, register choices live only in this workspace session; no UI should claim a view was saved.
