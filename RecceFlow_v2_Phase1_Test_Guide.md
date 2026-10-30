# RecceFlow v2 — Phase 1

This phase follows the supplied v2 brief. The existing React/TypeScript, ASP.NET Core/EF/SQL Server and Konva application is preserved. Phases 2–6 remain in [the implementation backlog](RecceFlow_v2_Implementation.md).

## Try the changes

Refresh http://localhost:5173 with Ctrl+F5. Sign in as `ravi` (company `DEMO`, password in `artifacts/demo-password.txt`). Workers now land on **My jobs**. Admin `meera` still lands on the office Overview.

1. Start or continue an assigned job. The tabs and headings consistently read **1 Site → 2 Materials → 3 Review**. Location is inline within Site.
2. On Site, type a contact or note, click **Save draft**, and continue typing while it saves. A completed response cannot replace the newer text. The status stays Unsaved changes until a subsequent save acknowledges those edits. Saves serialize against the current SQL rowversion; a real conflicting edit returns an error rather than overwriting someone else's version. Changing steps saves, but later typing stays visibly unsaved. This is server draft persistence, not offline storage or background autosave.
3. On Materials, choose a material and add it. Take/upload a photo, which opens that item's editor. Draw first and choose **Save marking draft** without entering size. Reopen the editor: the drawing is retained. The item remains incomplete and cannot be submitted until its missing fields, measurements, confirmation and evidence are complete.
4. Enter tape measurements, confirm them and choose **Save item**. The item collapses to its name, size, status and thumbnail. **View / edit item** reopens it. Only one card is expanded at a time. **More item options** holds extra photos, remarks/voice, duplicate-item and removal controls. **Add same material** creates a new independent item.
5. Use **Unit** to select a different unit. Existing values require an explicit choice: **Convert values · keep the same size**, or **Clear values · enter a new size**. Cancel leaves the original values/unit intact. Both accepted changes reset confirmation and invalidate affected previews.
6. For **Feet + inches**, enter feet and inches in separate boxes. Inches must be between 0 and 12 (exclusive). Example: width 12 ft 6 in, height 3 ft 0 in → convert to mm → width 3810, height 914.4. Count items never receive a distance conversion.
7. Compact labels reference a Width/Height/Length/Count key. Select a mark and change its **Dimension label** as needed. Arrow orientation suggests Width or Height. Move labels across the image in Select mode; leader lines link them to their marks. A single header carries the item/placement and full size. No physical dimensions are inferred from pixels.
8. **More: site overview / 360°** keeps the existing panorama tools available after routine capture. Comparison with original and shared-photo item marking still work.
9. **Help** expands only when requested and can be reopened. Browser English speech is offered only when an English voice is available; readable guidance always remains. It does not autoplay. Recorded user remarks remain separate from spoken instructions. Hindi/Marathi font coverage is included; UI translation and saved onboarding/language preferences are later work.

## Admin job creation and retries

Create job now includes initial assignment in the same server write. The UI sends one stable `clientOperationId` for retries of that open form. An invalid worker/form prevents creation entirely. Identical retries return the existing job; concurrent identical requests create one job. Reusing the ID with different details returns 409. Closing and opening a new creation is a new operation.

The API now requires `clientOperationId` on `POST /api/jobs`; external clients must be updated. `assignedUserId` is optional (unassigned jobs are still supported). The separate assignment endpoint remains for subsequent assignment while a job has not started.

## Address lookup and costs

Browser GPS and free Maps links work without a provider key. An authenticated, secret-free `/api/capabilities` response controls availability. Unconfigured lookup is hidden from workers; admins can see setup status on Overview. The application does not enable paid calls during this phase.

Operational enablement requires all three server settings: `Geocoding:AllowPaidCalls=true`, a `Geocoding:GoogleApiKey`, and the company code in `Geocoding:EnabledCompanies`. Provider credentials, billing restrictions/quotas and applicable attribution/storage rules must be reviewed before production enablement. Daily request defaults are 5 per user/company, 20 per company, 50 across this API database, reset at UTC midnight. Server config can lower/raise the limits (maximum 10,000; zero blocks requests). All instances sharing this database share reservations. These limits do not cover other applications using the provider account.

Each request must identify an accessible job and a stable operation ID. Reservations persist before external access, including failed/timed-out calls; retrying the same operation or the same rounded coordinate/job/day is rejected without another provider call. SQL serializable transactions guard quotas. A conflict or exhausted quota leaves manual site entry available. Provider timeout is eight seconds.

Suggested Google address text is transient UI state, separate from the saved site address. It is not automatically copied into long-lived answers or exports. No real Google calls were made in verification. A successful live suggestion still needs testing after authorised setup; it cannot prove the exact shop location.

## Migration and preservation

Migration: `20261027065447_WorkerFlowReliability`. Adds `JobCreations` and `GeocodingRequests` with tenant/job relationships and retry/quota indexes. Existing job IDs, submitted revisions, media and form schemas are preserved. The optional shape `measurementKey` is JSON-only; absent keys are omitted during serialization, preserving old metadata fingerprints. New `ft-in` measurements store total inches and use decimal conversion to canonical millimetres on the server. No evidence is rewritten.

Local pre-migration backup: `artifacts/backups/phase1-20261027-741f340a`. SQL BACKUP CHECKSUM/RESTORE VERIFYONLY and restore into a separate database succeeded. The populated restore was migrated and compared against the main DB: existing jobs, all 39 pre-existing revision JSON/timestamps and media records matched. All 86 pre-existing uploaded files matched copied SHA-256 hashes. The verification database `RecceFlow_Phase1_Restore_2e13629e` remains read-only. Backups contain private application data; keep them with the database/media retention policy.

The migration runner initially targeted the main local database because connection configuration/flag precedence was wrong. Only the additive tables were applied. The runner/configuration was corrected; the restored-data migration and unchanged-record comparison then passed. No SQL reset, reseed, upload deletion or rollback of submitted evidence occurred.

On another machine, stop the API, back up database and uploads together, verify a restore, then run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools/migrate.ps1
```

Environment and command-line settings override `appsettings.Local.json`. For a verification connection passed on the command line, put its `--ConnectionStrings:RecceFlow=...` argument **before** the terminal `--migrate` flag. The local development scripts continue to work normally.

## Repeat verification

Completed results on 27 October 2026: API build succeeded with 0 warnings/errors; frontend production build and lint passed. All 27 distinct Playwright cases passed across the regression run and targeted reruns (the initial run had an obsolete Site overview assertion and a reload check that passed on rerun). The five Phase 1 cases were rerun after final editor changes and passed, including label movement beyond the old 15% clamp, 360/390/768/1024/1440 editor widths and loading the local Devanagari font. The separate zero-quota/dedup verification passed. The existing lazy panorama chunk warning (~630 kB) remains; no runtime/provider certification is implied.

Main changed areas: `Workflow/JobCreationEndpoints.cs` and the new job receipt model; `Workflow/LocationEndpoints.cs` and lookup reservations; the additive migration; `recce/useRecceDraft.ts`, `MeasurementInputs.tsx`, `MaterialDetails.tsx`, `AddressLookup.tsx`, `ContextHelp.tsx`; existing App/RecceFlow/PhotoEditor integration; scoped CSS, font assets/licenses; regression tests and verification tools. Existing files were incrementally edited rather than replacing the application.

Start the normal API/frontend first. From the project root:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools/test-phase1.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File tools/test-phase1.ps1 -Full
powershell -NoProfile -ExecutionPolicy Bypass -File tools/verify-location-limits.ps1
npm.cmd run build --prefix src/web
npm.cmd run lint --prefix src/web
```

The quota script uses a temporary local API on port 5081, a fake key and a **zero quota**. It verifies 429 and durable duplicate rejection without external calls, seeds only a fictional test job's reservation, and stops its own process. Browser checks use fictional jobs and simulated hardware/GPS; they do not prove physical-phone camera/touch or poor-network reliability.

Before screenshots copied from earlier fictional-data checks: `artifacts/screenshots/phase1-editor-before-390.png`, `phase1-jobs-before-390.png` (not new captures of the same job). Current captures: `phase1-site-after-390.png`, `phase1-editor-after-390.png`, `phase1-editor-after-768.png`, `phase1-editor-after-1440.png`. Regression screenshots cover the other layouts. Font files and SIL licenses are self-hosted in `src/web/public/fonts`.

## Remaining limits

No recce approval/correction history yet (Phase 3); submitted remains different from approved. No new company/team/batch/catalogue management or template lineage/routes (Phase 2). No offline queue, trusted server rendering, complete media decoding or production hosting hardening (Phase 4). No automatic PDF/image OCR (Phase 5). No printing/install module (Phase 6). Previews are client-generated; a matching metadata fingerprint does not prove preview pixels. A measurement change can require reopening other views to regenerate their previews. Coordinate bounds for translated/scaled shapes need further hardening. Physical devices, successful live geocoding and native speech voices still need manual validation.
