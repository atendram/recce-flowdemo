# RecceFlow v3 Phase 1 - use and verification

29 October 2026. Implements Phase 1 of the latest supplied review. Later phases remain in [the implementation checklist](RecceFlow_v3_Implementation.md).

**Later on 29 October:** the user requested local owner recovery, voice support and additional exports. That owner reset is now complete and first-password change is required; the earlier account inspection below describes the pre-recovery state. Follow [the current recovery/voice/export guide](Field_Voice_Exports_Recovery_Guide.md).

## Open the updated product

Use **http://localhost:5173** and press **Ctrl + F5**. If the local servers are stopped, run these from the repository root in separate PowerShell terminals:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools/start-api.ps1
```

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools/start-web.ps1
```

Do not run npm install/ci while the web server holds the Windows native binding. Existing installed dependencies are sufficient for this update.

The current local database was inspected without reading passwords: `platform.owner` exists with platform access and no pending first-password change; `meera` and `ravi` have active DEMO memberships. **The DEMO company itself is suspended**, so those DEMO sign-ins are denied regardless of password. Its suspension was preserved. If you intend to resume it, use the platform owner's Companies screen. Existing credential files contain initial values only and may be stale; no existing passwords were reset to make tests pass.

## Admin: jobs and forms

1. Open **Jobs**. Search and status chips stay visible. **Filters** opens a drawer; **Show matching jobs** closes it. **Columns** chooses and orders the desktop table columns for this workspace session. Mobile shows cards with one primary View action and secondary Details & actions.
2. Choose **Create job**. Fill Site details, including optional contact name, then Continue to Assignment. Choose due date/time, active worker and approved form, then Continue to Review. Check the summary and Save job. Project/client/group start blank.
3. A lost response keeps the original operation and details. **Check and retry same request** reconciles that operation through the existing idempotent endpoint. Editing is blocked until that uncertain request resolves. Closing it warns you to check the register before creating another job.
4. **Company setup → People / Forms / Materials** remains grouped. An open form draft stays mounted while you move between those screens and other admin pages. **Refresh forms** reloads the library without discarding the builder. A failed load has Retry and keeps existing inputs.
5. Workspace URLs use `#/jobs`, `#/reports`, `#/setup/people`, `#/setup/forms`, `#/setup/materials`, `#/messages` and `#/help`. A worker cannot open an office screen by changing the hash. These are workspace routes; job detail/editor state is not yet a shareable deep link.

Saved named views are designed in the checklist but are not implemented. Column choices are session state. Form drafts are held in memory, not durable offline storage: refreshing/closing the browser loses unsaved changes. Save a draft before doing that.

Reports remain a separate workspace with filters, ordered export fields and a real preview. **Visit outcome** is included by default; **Visit reason** and **Contact name** are additional selectable fields. Job review status remains Assigned / InProgress / Submitted / NeedsCorrection / Approved in CSV. A visit outcome is separate: approving a no-access report does not establish measured material dimensions. CSV stays data-only.

## Worker: survey or incomplete visit

Start an assigned job. GPS still asks permission only for that visit. In **Site**, choose:

- **Survey completed / in progress:** complete the assigned required form, material evidence and manual measurements as before.
- **No access:** give an outcome reason. Access is recorded as No. An optional visit photo can be attached.
- **Revisit required:** give a reason; an optional photo is supported.

No-access/revisit submissions need shop/address and GPS or a location exception, but do not demand fabricated material values or inaccessible form answers. Partial items remain saved for office context and are excluded from measured-material report rows, MIS measured-item/area totals and current marked-image exports for that visit. The Materials step explains that material evidence is not required for that outcome; Review shows the reason before sending. The office sees the outcome in the register/detail and can use its normal review/correction workflow.

For a measured survey, every physical item retains independent GUID, B-code, measurements, source/view/shape links and previews. Add same material starts blank. Newly assigned codes are not reused after removing an item; legacy JSON remains readable. Custom materials now also carry a validated catalog identity.

Count materials show Count in pieces with **no length unit selector**. The editor separates pieces per set from number of identical sets: 8 pieces × 2 sets = 16 pieces. Area/length materials retain quantity of identical pieces. Use separate items when positions, sizes or evidence differ. Feet-and-inches area is displayed in ft²/m²: 12 ft × 3 ft is 36 ft².

After changing size, placement, unit or quantity, the editor lists views needing refresh. **Refresh affected images** renders/uploads every affected view and saves its new references. Stages name the current view; no percentage is invented. Partial failures retain successful previews in the editor for retry. Empty/unmarked views still require marking. Submit and current-image downloads continue to validate preview metadata fingerprints. **These remain client-generated image previews**; the fingerprint does not prove pixel correctness. Trusted server rendering, full decoded-image validation and EXIF normalization remain later media work.

The editor keeps Select / Pan / Rectangle / Arrow / Draw visible. **More drawing tools** contains ellipse, polygon, line, colour and thickness. Partial marking drafts, undo/redo and dimension-linked labels remain supported. In a panorama, existing material markers stop intercepting clicks while placing another marker; after placement they can open their respective items again.

## Worker accounts and dialogs

Create a recce person with name, username and optional contacts. The server generates a temporary password and shows it once in a private handoff dialog. Share it privately; the worker must change it before using protected job actions. **Reset password** generates a new temporary password and revokes old sessions. Deactivate/reactivate also revoke old credentials; reactivation cannot revive an old cookie.

Workers cannot reset other accounts. Admin resets are limited to their own company's Worker account; a login shared across companies/roles requires platform-owner recovery. Access/create/reset actions are audited. Platform admin edits use an account version; stale edits conflict, and the last active company admin cannot be disabled. Company suspension/reactivation deliberately invalidate existing sessions too. Installing these changes does not force existing users to change their passwords.

Chat, creation, filter/column, credential and session-recovery dialogs share keyboard focus containment and focus return. Escape closes dismissible dialogs through the same unsent/pending guards as the close button. Session recovery requires an explicit sign-in or leaving open work. Chat history is not repeatedly announced wholesale on background refresh. Chat delta polling, uncertain-send reconciliation and storage retention are Phase 3/4 work; nothing here deletes old messages or media.

## Run the isolated regression checks

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools/test-v3.ps1
```

This creates a **new fictional SQL database with files under artifacts/sql**, applies migrations/seeds only there, builds a separate API output and runs test servers at **5081/5174**. Your normal workspace/database stays on 5080/5173. No credential file is read or overwritten. A temporary test owner is disabled afterward. Each suite starts a fresh test API with the normal sign-in limiter; the v3 checks honor Retry-After where needed. Logs/database are retained for inspection; the runner does not delete customer records or uploaded evidence.

Focused run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools/test-v3.ps1 -Specs tests/v3-reliability.spec.ts
```

New checks cover CSV quoting/heading warnings, area conversion, generated worker handoff/reset, last-admin/concurrency safeguards, access revocation, no-access outcomes, lost-response job creation, mobile/tablet registers, draft preservation, chat keyboard/unsent guards and refreshing multiple marked views. Existing field, session, form, report and review checks run alongside them. Results and remaining limitations are recorded in Implementation_Status.md after verification.

The original Phase 1 checkpoint covered 38 checks plus panorama (39 across runs). The default runner now includes six [field/support/export/recovery checks](Field_Voice_Exports_Recovery_Guide.md), giving 44 in the default selection. Run panorama separately with:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools/test-v3.ps1 -Specs tests/collaboration.spec.ts -Grep 'real panorama viewer'
```

See [the verification record](RecceFlow_v3_Verification.md) for suite counts and actual build results. The runner retains SQL/setup logs, while Playwright replaces its last-run output on each invocation.

## Backup and database change

Migration `20261028192628_FieldReliabilityV3` adds only `Jobs.ContactName` (160 characters, default empty). Visit outcomes and item sequences are compatible additions inside existing recce JSON. No new customer-specific SQL schema is created.

Before applying it locally, a COPY_ONLY/CHECKSUM backup was verified and restored to `RecceFlow_V3_Restore_50437333`. Location: `artifacts/backups/v3-20261029-ba38bb4d/RecceFlowDb.bak`. All 265 existing uploaded files were copied and SHA-256 checked. Migration was tested on the restore, then applied locally. Recce JSON, historical review JSON, account hashes/flags and job/form/message counts matched afterward. Subsequent fictional test records are separate from that pre-migration preservation comparison.

## Screens and device limits

- [Jobs - desktop](screenshots/v3/jobs-1440.png), [tablet](screenshots/v3/jobs-768.png), [phone](screenshots/v3/jobs-390.png).
- [Marking/count - desktop](screenshots/v3/editor-1440.png), [tablet](screenshots/v3/editor-768.png), [phone](screenshots/v3/editor-390.png).
- These six fictional-data captures are included under docs so they are available in a source clone; see [the gallery](screenshots/v3/README.md).
- Previous baseline captures remain under the ignored `artifacts/screenshots/phase1-*-before-390.png` and `ui-*`. No new pre-change desktop/tablet comparison was captured; the new gallery shows the verified current UI.

Viewport checks include 320/390/430, 768×1024, 1024×768, 1024×1366, 1366×1024 and 1440 widths. Tests inspect computed 16px/48px worker inputs, keyboard focus, overflow and real saved data. Physical touch hardware, browser zoom and a real virtual keyboard still require manual testing. Camera/GPS require a supported secure origin on a physical device. Panorama remains lazy-loaded; its existing large dependency warning is not hidden.

Phase 2+ imports/XLSX/document layout/version families, named saved views, fully paginated bootstrap metadata, chat deltas/media-reference storage, retention, PDF/OCR, offline sync and production setup are still outstanding. Paid providers, cleanup and deployment were not enabled.
