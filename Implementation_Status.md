# Implementation status

## Support tracking, developer escalation and feedback - 30 October 2026

Worker requests route to Office; admin-created requests route to Developer. Company admins can explicitly escalate an office issue with a reason, sharing its request, voice recording and history. A new platform Support tab shows only admin-created/escalated issues. Tenant scope, platform authorization and required password-change checks remain enforced; developer support access does not grant access to underlying recce evidence or job chat.

Added paginated/filterable inboxes, Pending / Processing / Resolved status with colour and text, version-checked replies/status changes, resolution notes and worker reopening. Concurrent admin/developer writes serialize against the ticket row; lost-response retries reuse an operation ID and return the saved receipt without duplicate history. The UI preserves unsent replies when refreshing and freezes uncertain updates for retry. Original resolution time survives later comments and clears on reopening. Legacy Open tickets display as Pending and stay with Office until deliberately escalated.

Admins can open a normal WhatsApp draft to +91 9326861539 from the saved request. No message is sent automatically and no external reply/status synchronization is claimed. Foreground support polling runs approximately every ten seconds with unresolved badges and notifications for other participants' updates. Shared form-action toasts provide pending/success/error feedback, reduced-motion handling and dismissal; the toast message surface allows clicks through rather than blocking page actions. Field save, media, authentication and report paths retain their existing specific feedback where appropriate. Existing Jobs → View → Reassign job transfers editable work to another active worker while preserving evidence and revoking the previous worker's access.

Migration `20261030064642_SupportIssueWorkflow` was tested on a verified restore before the normal local database. Backup: `artifacts/backups/workflow-20261030-7b5189c0/RecceFlowDb.bak`; restored DB: `RecceFlow_V3_Restore_5ac8c194`. All 388 original recce upload files and three separate support voice files were copied and hash checked. Existing recce/review JSON, account state and job/form/support data were preserved. No real account password was reset or company access changed for this support task. No media purge was enabled.

Validation: **29 distinct checks passed across the final runs**: six support, seven foundation/responsive, six field/exports/reassignment, four session and six product-admin/review. The 28-check combined run passed in `RecceFlow_V3_Tests_3c6dfc96`; the final six-support run in `RecceFlow_V3_Tests_37380f9b` also covers lost acknowledgements after successful saves, simulated as both network failure and HTTP 503, with exactly one history entry after retry. Test owner recovery between suites is confined to the newly generated fictional database and fixture username, preventing suite-order password contamination. API build passed with zero warnings/errors; web production build and lint passed. The existing lazy panorama chunk-size warning remains.

See the [usage and test guide](Support_Workflow_and_Reassignment_Guide.md) and [fictional screenshots](screenshots/support-workflow/README.md). Actual WhatsApp delivery and physical-device microphone/keyboard behavior remain manual checks. This local update does not add offline sending, automatic transcription or notifications while the app is closed. Older dated sections below record earlier checkpoints and their then-current limitations.

## Platform-owner lockout recovery - 30 October 2026

Investigated a reported owner-login failure without changing passwords. The ignored temporary credential file still matched the local owner's hash; `LockedOutNow` was true and `MustChangePassword` remained true. Added a Development-only, audited Identity CLI unlock plus `tools/unlock-platform-owner.ps1` with explicit username selection. It rejects non-platform accounts, clears only lockout/failed-attempt state, and preserves the password, credential version and first-change requirement. No HTTP recovery endpoint or migration was added.

Cleared only `platform.owner`. A private credential-file sign-in through the actual running web proxy at localhost:5173 returned HTTP 200 and role SuperAdmin with password change required; only that verification session was logged out. Existing credential files were not rewritten. See [the recovery guide](Field_Voice_Exports_Recovery_Guide.md). Meera/Ravi were not reset; company suspension is independent from this login repair.

Validation: API build passed with zero warnings/errors. One focused SQL-backed regression passed in `RecceFlow_V3_Tests_a9987945`: five incorrect attempts create a real lockout, the correct password remains denied until unlock, unlock rejects company-user promotion, and the same password succeeds afterward with its first-change requirement intact. `git diff --check` passed. The normal API was not restarted and no other account was changed by the repair.

## Field voice, support, report formats and local recovery - 29 October 2026

Added Site voice notes, voice-only general/job-linked support, explicit custom placement selection, labelled shape icons, a Columns chooser with a fixed close header/Apply footer, optional per-material installation photos captured by the recce person, and reason/version-checked reassignment of editable jobs. Reassignment preserves the saved draft/evidence and original start time, is audited and serializes against worker saves/submission. The previous worker loses access; submitted/verified work stays locked until correction.

Reports support before/marked/installation-photo columns, optional headings/subtitles and up to ten constant-value custom columns alongside existing form-answer fields. One-job material exports are available from job details. CSV, genuine Open XML XLSX and browser Print/Save as PDF share the selected field order/scope. Web/print show photos; CSV/XLSX contain private image URL references rather than embedded images. Stale marked previews remain excluded. Report settings are in-memory; no saved branding/template/preset system is claimed.

At the user's explicit request, only `platform.owner` was reset via a new audited local Identity recovery command. The ignored local credential file was updated with restricted access; previous sessions are revoked and a password change is required. No password appears in source/docs/screenshots. Meera and Ravi's existing password matches were verified unchanged, and DEMO's paused state was preserved. Shared eye controls now cover login, recovery and password-change fields. Recovery cannot promote company users and has no public unauthenticated API.

Migration `20261029063315_SupportVoiceAndVisitPhotos` adds company-constrained private support-voice references. Compatible site-audio/installation references live in recce JSON. Before migration, a fresh COPY_ONLY/CHECKSUM backup was restored/verified at `artifacts/backups/support-20261029-499ad593`, restored DB `RecceFlow_V3_Restore_9e177f05`. All 344 then-existing upload files were copied and SHA-256 checked. Post-migration comparisons preserved recce/review JSON, account state and job/form/support counts. Future backups include SQL plus uploads **and support-uploads**; no purge was enabled.

Verification: **24 distinct targeted checks passed across runs**: six new feature checks, three recce, one recce validation, five draft/atomic-creation, three office workflow and six product-admin/review regressions. A 390 px support check was adjusted to use the actual mobile Support navigation; an installation assertion now waits for server acknowledgement instead of assuming an optimistic thumbnail proves persistence. The saved placement was independently checked in the isolated DB. Recovery, columns, reassignment and export checks passed in `RecceFlow_V3_Tests_4a3d696f`; final mobile voice/installation reruns passed in `RecceFlow_V3_Tests_57a50893`. Earlier new-feature passes are retained in the isolated logs. API build: zero warnings/errors. Web build and lint passed. Independent Python ZIP CRC/XML checks verified XLSX structure, escaped headings, literal formula-like text and three private photo references. Normal API health returned 200 after restart. The pre-existing lazy panorama chunk-size warning remains.

See [usage/login/export guide](Field_Voice_Exports_Recovery_Guide.md) and [current fictional screenshots](screenshots/field-improvements/README.md). Browser tests simulate camera/microphone and verify the printable page; physical device capture, native Excel and actual printer/PDF destination acceptance remain manual. No deployment, paid API, automatic transcription, support escalation, offline sync or cleanup was added.

## v3 Phase 1: consistent UI and field reliability - 29 October 2026

Implemented the first phase of the latest supplied review, preserving React/.NET/SQL/Konva and the existing workflow. Jobs now has persistent search/status filters, filter and column drawers, phone cards, role-safe hash routes and a Site / Assignment / Review creation drawer with optional contact name and unchanged operation-ID reconciliation. Setup drafts survive navigation in memory; refreshing the browser still requires saving first. Shared feedback/dialog primitives provide local pending/error states, keyboard focus containment, guarded chat dismissal and focus return. Inter/Noto tokens and computed 16px/48px field input sizing apply through the final CSS cascade.

Custom Count materials use pieces and identical sets without length units. Feet/inches area uses valid ft²/m². Repeated physical items retain independent identities and view references; measurement edits show stale views and can refresh all affected marked previews. Panorama placement reaches the canvas even when an existing marker overlaps it. No-access/revisit outcomes require a reason and valid location/address context but exempt inaccessible form/material evidence. Partial items remain available for context and are excluded from measured-material exports, MIS totals and current-image exports for those outcomes. Previews remain client generated; metadata fingerprints are not proof of image pixel correctness.

CSV now rejects malformed post-quote text/duplicate mapping headers and warns about skipped headings until Phase 2 persists document layout. Worker creation/reset generates one-time temporary credentials, requires password change and revokes prior sessions. Company access changes deliberately invalidate sessions; administrator edits use concurrency checks, protect the last active company admin and are audited. No existing passwords were reset. The existing DEMO company suspension was preserved.

Additive migration `20261028192628_FieldReliabilityV3` adds only `Jobs.ContactName`. A COPY_ONLY/CHECKSUM backup was verified/restored before applying it; recce JSON, historical review JSON, original account state and job/form/message counts matched afterward. All 265 original media files were copied and hash verified. Early fictional v3 fixtures in the local database were disabled with restore-based scope checks; later tests use separate SQL databases and servers.

Validation: **39 distinct targeted checks passed across runs**, including eight new v3 checks, field/draft/session/CSV/admin/review regressions and one real panorama-viewer check. API build: zero warnings/errors. Web production build and lint passed; the existing lazy panorama dependency-size warning remains. Normal API and web endpoints returned HTTP 200 after restart. See [the verification record](RecceFlow_v3_Verification.md), [test guide](RecceFlow_v3_Phase1_Test_Guide.md) and [six current screenshots](screenshots/v3/README.md). Physical touch/camera/GPS, zoom, virtual keyboard and screen-reader acceptance remain manual checks. Named saved views have a model design only; Phase 2–5 imports, document versions, chat/storage/retention, OCR/offline and deployment remain outstanding. Older dated sections below describe prior checkpoints.

## Compact tabbed workspace UI - 28 October 2026

Admin navigation now groups People, Forms and Materials under Company setup. Add-person and add-material cards span the page above searchable, paginated lists. Forms use Create form / Saved forms / Test & approve tabs. Reports use Filters / Columns / Report tabs with date shortcuts, selectable field order and a real data preview before CSV download. Overview, job details and the platform console use related sub-tabs; jobs have compact status-coloured rows and expandable secondary actions. Worker screens have clearer step icons, status filters and reduced spacing. Existing permissions, approvals, media validation and saved records remain in place; this UI update requires no SQL migration.

See [the UI guide and screenshot gallery](UI_Simplification_Guide.md) for the current navigation. The sketch was used as a grouped-tab layout reference rather than adding a separate calendar feature. Older guides below may describe the previous menu positions.

Validation: web production build and lint passed. All 32 targeted browser checks passed across runs: four UI checks, six product administration/review checks, nine field/CSV checks, ten office/session checks, two draft-recovery checks and one panorama check. Main menus were checked at 320, 390, 768 and 1440-pixel widths, including Messages and Support. Checks cover keyboard tab navigation, draft preservation, ordered report previews/exports and existing approval/marking flows. The existing lazy panorama chunk-size warning remains. Native camera/GPS acceptance on physical devices is still required; no deployment was performed.

## Product administration and recce verification — 28 October 2026

Added a separate platform-owner login with company/admin provisioning, one-time credential handoff, first-login password changes, company/access management and audited password reset that invalidates old sessions. The initial owner is provisioned locally; tenant users cannot self-promote and platform sessions have no implicit tenant survey access.

Office Jobs now has a paginated/filterable register, client name, per-admin/per-submission seen state, unseen-submission priority, 15-second foreground refresh and a detailed visit/material/photo/remarks/conversation review page. Current marked photos download individually or as a private ZIP. Submitted recces can be verified or returned for corrections; review records retain the submitted content, and workers see pending/review/correction/verified states. Overview/MIS includes real verified/correction totals and performance progress.

Jobs and forms support reversible delete/restore. Assigned/historical form definitions and survey evidence remain stored. Jobs/Reports offer field inclusion and serial ordering, scoped exports, dynamic assigned-form answers, client/worker/timestamps/GPS/read-state/review columns. Loading a new filter scope cannot export stale matching IDs; refresh preserves column choices.

Migration `20261028111015_ProductAdministrationAndReview` was applied after a verified COPY_ONLY/CHECKSUM backup at `artifacts/backups/product-admin-20261028-110936/RecceFlowDb.bak`. Existing recce JSON hashes and job/form counts matched afterward. Historical start/create times remain unknown/null. See [the product testing guide](Product_Admin_Review_Test_Guide.md) for exact login, review, export and removal steps and the remaining deployment/product boundaries. Earlier dated sections below describe previous slices; their superseded pending-review notes are historical.

Validation: API build (zero warnings/errors), web production build and lint passed. Six new product tests and 20 existing targeted regression checks passed across runs, including field marking, panorama, session recovery, forms, reports and MIS. Updated test selectors follow the new register; active Forms requests retain their previous URL. The sign-in limiter remains enabled and now returns a clear retry message. The existing lazy panorama bundle-size warning remains; no production deployment was performed.

## Admin people, overview MIS and guided forms — 27 October 2026

Added admin worker-account creation with transactional company membership, active/inactive access management and workload counts. Uses the existing Identity/Membership tables; no new migration. Inactive membership is checked on every protected API request, including already signed-in sessions. Invitation email, password recovery, named multi-role permissions and typed teams remain later work.

Overview now uses a company-scoped, due/project/person-filtered MIS endpoint with actual status/overdue counts, calculated material area, seven-day submission trend and worker/project summaries. Card clicks stay on Overview and move to the matching report; the detail table has 20-row pages, exports include all matched rows (maximum 500 jobs per scope). No approval or attendance metrics are invented. CSV exports include worker summary and job details. Unavailable or failed filtered results are not presented as fresh data.

Added common placement suggestions alongside free text in material cards and the editor, sticky header sign-out on normal workspace screens, and an in-app form creation/test/approval/assignment guide. See [Admin People/MIS/Form Guide](Admin_People_MIS_Form_Guide.md). Existing form approval publishes a template for new jobs and remains distinct from future recce approval/correction decisions.

## v2 Phase 1 — 27 October 2026

Implemented the supplied review's first phase: serialized draft saves with edit generations, atomic retry-safe job creation/initial assignment, consistent three-step labels and worker My jobs landing, one expanded material with completed cards collapsed, advanced panorama/item controls under More, partial marking drafts versus Save item validation, deliberate unit conversion and feet/inches, compact dimension-linked movable labels and contextual replayable help. Inter and Noto Sans Devanagari WOFF2/fonts/licenses are self-hosted. Small hooks/components were extracted instead of replacing the app.

Geocoding is disabled unless explicitly enabled for that company. Capabilities hide unavailable worker actions. Accessible job/operation IDs, SQL-backed global/company/user daily budgets and request dedup precede provider calls. Suggested provider text is transient and no longer automatically persisted as the site address. No paid calls or public deployment were made.

Additive WorkerFlowReliability migration adds job-creation receipts and lookup reservations. Backup checksum/restore, populated migration and old-data comparison succeeded; 39 pre-existing revisions and 86 media-file hashes were preserved. See [the Phase 1 guide](RecceFlow_v2_Phase1_Test_Guide.md) for commands, screenshots, contract changes and limits. Later phases are retained in [the backlog](RecceFlow_v2_Implementation.md). Older sections below describe earlier stages and are not new verification results.

## Admin forms, notifications, groups and exports — 26 October 2026

See [Admin Forms and Reports Guide](Admin_Forms_Reports_Guide.md). Added company-scoped immutable digital form versions (draft/test/approve), worker answers with server validation, approved-form selection on new jobs, group labels, priority/address/contact/instructions, compact admin row actions, job filters and clickable overview cards. Added incoming-message notifications with persisted read cursors, latest-message conversation previews, ordered selectable CSV report columns (including digital answers), and inline automatic GPS capture at recce start. Google reverse geocoding is integrated but disabled without a server API key; live provider calls were not tested. Existing jobs retain the sample form.

TXT/CSV first-column label import and manual field creation work. PDF/image OCR, Word/Excel parsing, saved report presets, XLSX output, group membership/group chat, non-message notifications and push delivery remain unimplemented. These limits are explicit in the UI and guide. Material-specific marking remains the existing independent per-item workflow; forms add site questions rather than inventing new measurement rules.

The additive DigitalFormsAndJobOrganisation SQL migration has been applied locally. Form definitions and answers use validated JSON with stable field IDs; no dynamic customer SQL schemas are created. Current verification results are recorded in the task response; older sections below describe earlier stages.


## Camera, voice, 360° and job discussion — 26 October 2026

Current controls and limits are documented in [the media/discussion guide](Camera_Voice_Panorama_Chat_Guide.md). Direct camera capture/retake/front-rear request, typed/recorded item and site remarks, explicit rectangle/bounding-box area rules, quantity totals, shared-photo overview, full equirectangular panorama viewing/material markers and worker/office job conversations have been added. The Messages tab and mobile sign-out are available. Plain system typography and container-responsive job cards replace cramped table layouts.

The JobConversations migration added persisted, idempotent messages and private media metadata without resetting existing jobs or evidence. Chat supports text, voice and up to three small image/PDF attachments; it polls every five seconds while open. Discussion cannot modify a submitted revision. No transcription, automatic 360° stitching, physical image measurement, read receipts, push notification or platform technical escalation is claimed.

New verification: seven media/collaboration checks passed in Edge with simulated camera/microphone and software WebGL. They cover worker/office text/photo/audio exchange and reload, direct camera capture and retake, typed/voice remarks, area and quantity persistence, preserved unsaved editor state during discussion, stopped camera/microphone tracks, two independent 360° material markers, rejected normal-photo panorama upload, retry conflicts, disallowed file type and cross-company conversation/file denial. Both roles were checked on all five tabs at 320/390/768/1024/1440 px. Denied camera/microphone permissions leave upload/typing usable. Panorama/mobile/desktop screenshots were inspected. Physical device camera, microphone quality, real capture/GPS and device-specific WebGL performance still need testing on trusted HTTPS.

Final regression: all eleven existing foundation/recce tests passed against the media update, giving eighteen distinct passing checks across the new and regression suites. The permission-denied check was also rerun after the recorder's failure-path cleanup change and passed. Frontend build and lint passed; API build passed with zero warnings/errors. Vite reports the separately loaded 360° library chunk above its default 500 kB warning threshold; ordinary login/recce screens do not fetch that library. The first-open development reload was fixed by prebundling the panorama packages. No real-hardware or production performance claim is made.

Visual review also found SQL datetime2 losing DateTime.Kind when serialised. The API now explicitly emits UTC timestamps; a nineteenth automated check passed for exact job due-date round-trip, chat creation time and recce update time after SQL reload. This required no timestamp data rewrite or schema migration. The final API rebuild again passed with zero warnings/errors. The browser displays those UTC timestamps in its device timezone once.

The following field/foundation sections describe earlier checkpoints; use this section for the current media boundary.

## Field recce update — 26 October 2026

The foundation-only description below is the historical 24 October baseline. A connected field recce slice has now been added. Use [the field test guide](Field_Recce_Test_Guide.md) for current run/test instructions.

New features: admin worker assignment; Start/Continue recce; location with accuracy or an explained exception; sample site form; independent material instances; private before-photo upload; Konva shapes/freehand, colours, move/resize, undo/redo, zoom/pan; on-image measured labels; multiple marked views and primary selection; manual SQL-backed draft save; revision concurrency; completion checks; immutable submission; read-only office inspection. Length/count materials use the appropriate fields, and lengths have server-derived canonical millimetres. The mobile home prioritises jobs and the layout includes 320 px screens.

This remains a fixed sample-form vertical slice, not completion of all Version 1.1 milestones. Draft content/annotations are validated structured JSON with company/job-scoped media rows; the fully relational, configurable, multi-revision correction model remains pending. Automated offline drafts/sync, arbitrary template extraction, approval/correction decisions, exports, installation and technical support escalation are not implemented. Voice and job discussion are covered by the later media update above.

The non-destructive FieldRecceCapture migration was applied to local RecceFlowDb. Existing jobs/accounts/support records were retained. Private photos are in artifacts/uploads and must be backed up with SQL. Browser workflow tests use a synthetic labelled photo and simulated geolocation, not genuine site evidence. Physical phone camera/GPS/touch checks remain untested.

Validation for this update: API build passed with zero warnings/errors; frontend build and lint passed. Eleven automated checks passed across the browser suite and a targeted rerun: existing support create/reload; no horizontal overflow at 320/360/390/768/1024/1440 px; admin create/assign; complete location/form/two-item recce with multiple marked views, shared original, independent sizes/previews, canonical unit conversion, submission/reload and submitted-edit denial; incomplete/stale/cross-company recce denial; length versus count rules, stale-preview rejection and private-media isolation. Editor/mobile screenshots were inspected. Earlier failures exposed a canvas whitespace bug and a test fixture issue; these were corrected before handoff. The final targeted material-mode check passed against the rebuilt API.

Updated 24 October 2026. This is the first working foundation slice, not the completed product or all of Milestone 1.

## Working

- React/TypeScript responsive interface using navy/teal styling and Lucide icons.
- Company-code login, Identity password hashing, lockout, IP-based login throttling, HttpOnly cookies and CSRF validation.
- Current company membership is checked on each protected business request.
- Admin job creation and listing; assigned-worker job listing and search.
- Worker text support request with optional job context, category and work-blocking flag.
- Worker sees own support requests; company admin sees company requests.
- Stable request operation IDs prevent duplicate tickets; changed content using an old ID returns a conflict.
- SQL Server LocalDB database `RecceFlowDb`, EF migration, fictional accounts and two isolated fictional company workspaces.
- Generated local development password stored only in ignored `artifacts/demo-password.txt`.

## Validation performed

- Windows-authenticated SQL query succeeded against `(localdb)\MSSQLLocalDB`, SQL version 15.0.4382.1.
- Database data/log files created under `artifacts/sql` on D:; initial migration applied successfully.
- API build: passed, zero warnings/errors after dependency servicing updates.
- Frontend TypeScript/production build: passed.
- Frontend lint: passed after fixing the effect warning.
- npm install audit reported zero vulnerabilities; final NuGet restore/build had no vulnerability warnings. This is not a full security audit.
- API smoke check passed: authentication, unauthenticated denial, missing-CSRF denial, worker create denial, unassigned/cross-company job restrictions, admin create, support request creation, repeat-request idempotency, changed retry conflict, inaccessible linked-job denial, empty-description rejection, company ticket isolation and logout.
- The API was stopped and restarted; exact job and ticket IDs from the preceding smoke run remained available from SQL.
- Six headless Microsoft Edge browser checks passed: worker login and contextual support creation/reload; no horizontal page overflow at 360, 390, 768, 1024 and 1440 px; mobile support navigation and request dialog at narrow widths.
- Desktop and mobile screenshots inspected. Screenshots are in ignored `artifacts/screenshots`.

Smoke tests deliberately leave clearly fictional verification jobs/requests in the demo database. No existing user database was reset or deleted. No outbound messages were sent. No site was published.

## Environment findings

- Node 22.20.0 and npm 11.6.2 found. PowerShell's npm.ps1 was blocked by execution policy; scripts use npm.cmd.
- System SDK was .NET 9; .NET 10.0.402 installed within `.dotnet` in this project. System SDK was not replaced.
- Only SQLWriter service was detected; SQL LocalDB was available and successfully connected outside the restricted helper context.
- C: had 0 GB free during setup. Packages, build caches, temp files and new database files were redirected to D:. User files were not deleted. The full system drive still needs attention from the user because it can affect Windows and other applications.

## Still pending

Complete the rest of the foundation: company settings/editing, material catalogue CRUD, teams/invitations, role-grant UI, job updates/assignments and pagination. API response DTO organisation and validation should expand with these features.

Next: dynamic survey form, board measurements/photo annotation, private media storage, device drafts and reliable submit. Then review/correction revisions, reports, support replies/internal notes/technical escalation, live notifications and installation proof.

There are no live AI, transcription, outbound contact, voice, file attachment or offline support integrations. My recce and support pages state their limits. Contact phone/email are unconfigured and no fabricated contact buttons are displayed.

Real phone GPS/camera/microphone, full keyboard/accessibility audit, translation review, expired-membership changes during an active request, login throttle exhaustion, load/concurrency stress, backup/restore, deployment HTTPS and production onboarding have not been tested. Desktop browser mobile emulation does not replace device testing.

## Run and inspect

The frontend was started at http://localhost:5173 and API at http://localhost:5080. If they stop, use the scripts in the [README](../README.md).

Company `DEMO`, user `meera` for admin or `ravi` for worker; use the generated password from the local ignored file. The second workspace `DEMO2` is for tenant-isolation checks. All data is fictional.

# 28 October 2026 — materials, typed CSV and approval feedback

Company-scoped custom materials now support immutable width/height, length or count modes, optional default area rules and archive/reactivate. Existing archived items retain their measurement rules; new use is blocked. Workers use the catalog in normal and panorama material selection, while measurement keys and area remain validated by the API.

The importer now reads typed/quoted/multiline CSV, including the supplied v3 headers, sections and printed checkbox groups. That file produces 44 fields and 15 multiselect groups, with explicit notes for signatures, sketches and write-in blanks. Templates and a converted v3 CSV are under `docs/examples/`. Form testing/approval has local sticky feedback, readable progress, read-only approved previews and bounded request waits. Multiselect answers are validated and exported as readable selections.

The initial/focus session probe uses a public authenticated flag rather than repeated anonymous `/api/me` failures. Protected endpoints stay protected and same-account recovery retains unsaved work. A favicon, hover borders/shadows, focus outlines and reduced-motion support are included.

Verification: API build, web production build and lint passed; 17 targeted new/regression tests passed, including panorama material selection. Before migration `20261028015357_CompanyMaterialCatalog`, a COPY_ONLY/CHECKSUM backup was verified under `artifacts/backups/material-catalog-20261028-015148/`; existing recce JSON hashes and job/form counts matched after the schema update. Tests add clearly fictional records after that check. The PDF/image extraction adapter remains unimplemented; Google reverse geocoding remains an opt-in configuration and Mappls needs a separate adapter. No paid provider calls were made. See `docs/Materials_CSV_Approval_Test_Guide.md` and `docs/Extraction_Location_API_Options.md`.
