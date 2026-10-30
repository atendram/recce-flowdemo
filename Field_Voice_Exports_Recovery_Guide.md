# Field notes, support, exports and owner recovery

29 October 2026. Refresh **http://localhost:5173** with **Ctrl+F5**. These extend v3 Phase 1.

## Developer sign-in

Only `platform.owner` was reset at your request. Open the ignored local `artifacts/platform-owner-credentials.txt`, select **Platform owner**, enter its temporary password and set your own password when prompted. Old owner sessions were revoked. Meera and Ravi were not reset. After changing the temporary password, use your chosen password; the credential file is not updated with it.

The eye button shows/hides passwords at sign-in, session recovery and new-password/confirmation fields. Passwords start hidden; visibility does not store or recover them.

**30 October login fix:** the local file still matched `platform.owner`, but the account was temporarily locked. Only its lockout/failed-attempt counter was cleared; the password and required first-change state were preserved. Sign-in through the running 5173 proxy was verified with HTTP 200, followed by signing out only that verification session.

For a confirmed local owner lockout, use the narrower command below instead of resetting its password:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools/unlock-platform-owner.ps1 -Username platform.owner
```

This audited Development-only CLI command uses Identity, accepts only an existing platform owner and does not rewrite the credential file. It does not bypass password verification or promote company accounts. Select **Platform owner** on the login page and copy the password from the file; after the first password change, use your chosen password.

Its focused regression uses a separate fictional database:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools/test-v3.ps1 -Specs tests/owner-unlock.spec.ts
```

DEMO remains paused. To resume it, the platform owner selects the company, enables access and chooses **Save company settings**. This is separate from password recovery. Meera's DEMO2 membership remains available.

For a future explicitly requested local recovery:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools/recover-platform-owner.ps1 -Username platform.owner
```

This privileged command builds its own API output and uses ASP.NET Identity to reset only the selected existing platform owner. It audits recovery, clears lockout, revokes sessions and requires a password change. It never creates/promotes a company user or resets everyone. It writes a temporary credential to the ignored owner file with restricted file access. No public unauthenticated reset endpoint was added. Do not share that file or include it in screenshots.

## Worker: site notes, placement and photos

1. In **Site**, type Site notes or use **Speak site notes**: Record voice → Stop recording → listen → Use voice note. Continue/save the draft to persist the reference. Office can listen in the Visit section. This is audio recording, not automatic transcription. Site notes and the separate final Review voice remark remain independent.
2. On a material, choose a placement suggestion or **Write my own placement…**, type the position, then Continue/save. Suggestions are optional.
3. Shape buttons now have icons alongside Rectangle, Arrow, Draw, Ellipse, Polygon and Line labels.
4. Each expanded material has optional **installation photos**, added by the recce person during the visit as you selected. Capture with the camera or upload JPEG/PNG; up to eight photos per material. These remain separate from before/source/marked images and do not establish an installation-approval workflow.

Installation uploads save into the draft. Removing a draft link does not delete shared/historical files. Submitted/verified work stays read-only; office must request correction before it changes. Office sees installation pictures in Materials & images and can open them full size.

## Support: speak and send

Open **Ask for support**, optionally link a job and choose a category. Type a subject/description, or Record voice → Stop → Use voice note → **Send to office support**. With a voice note, subject/description are optional; the category provides a default subject. Send is disabled while a recording/review/upload is unfinished.

The saved request appears in the worker's Support list and the company's office list with audio playback. Voice-only support also works without a job. Audio is private to its uploader and company admins; other workers/companies cannot retrieve it. Limit: 90 seconds / 2 MB. Microphone access needs localhost or trusted HTTPS; typing remains available when permission is denied. Support voice is stored separately from recce/chat media.

**30 October update:** support replies, developer escalation and Pending / Processing / Resolved tracking are now available. Follow the [support and reassignment guide](Support_Workflow_and_Reassignment_Guide.md). Offline sending, automatic transcription and automatic orphan cleanup remain pending.

## Admin: Columns and reassignment

**Jobs → Columns** has a fixed Close (X) header, a scrolling selection/order body and a fixed **Apply columns** footer. Close does not undo choices already applied in this session. Export choices remain in Reports.

Open a job with **View → Reassign job**. Select another active worker and confirm. Started work requires a reason. The new person continues the saved draft, notes and photos; the previous person loses job/media access. The original start time remains. Transfers are audited, version checked and serialized with worker saves/submission to prevent an old worker writing after transfer.

Assigned, In progress and Needs correction jobs can transfer. Submitted/verified jobs require correction first. Existing quick assignment for unstarted jobs remains available.

## Admin: report exports and one-job material lists

For multiple jobs use **Reports → filters/selection → Columns → Report**. For one job, open its detail and **Export job material list**; that builder is scoped to that job.

- Select/order normal fields, assigned-form answers and **Before photos / Marked photos / Installation photos**. Preview photos open full size. Stale marked previews are excluded; original/installation references remain separate.
- **Add your own report column** adds a heading and the same value to each row, for example Prepared by. For different answers per job, add a question to the assigned digital form. Up to ten custom columns; their selection/order is configurable.
- Enter an optional **Report heading** and **Subtitle / note**. They appear in preview/export/print. These are in-memory report choices, not saved company branding/templates.
- **CSV:** UTF-8, with formula-leading values escaped. Entered heading/subtitle rows precede column headers; leave them blank for conventional header-first CSV.
- **Excel (.xlsx):** a genuine Open XML workbook with ordered columns, title rows, styled/frozen headers and text cells preserving IDs/formula-like content. Photo columns contain private URL references, not embedded image bytes. Open them while signed in to the company workspace.
- **PDF (Save as PDF):** opens the printable report and browser print dialog. Select Save as PDF. This is browser PDF generation, not a direct server PDF download.
- **Print report:** the same layout, including headings, notes and photos. Downloads/print include all matching material rows; the on-screen preview is limited to 50. The 500-job cap remains. Narrow very large/image-heavy reports for practical printing.

Current marked-photo inclusion checks metadata fingerprints, which do not prove pixel correctness. Client-rendered previews are not canonical server-rendered evidence. Excel/CSV photo URLs need the running signed-in app; use PDF/print or marked-image ZIP for portable images.

## Database and testing

Migration `20261029063315_SupportVoiceAndVisitPhotos` adds `SupportVoiceNotes` and optional company-constrained `SupportTickets.VoiceNoteId`. Site voice/installation IDs are compatible recce-JSON additions; existing JSON is not rewritten.

A COPY_ONLY/CHECKSUM backup was verified/restored before migration. Backup: `artifacts/backups/support-20261029-499ad593/RecceFlowDb.bak`; restore: `RecceFlow_V3_Restore_9e177f05`. All **344** then-existing upload files were copied and SHA-256 checked. Migration preserved existing recce/review JSON, account state, jobs, forms and support counts. Future backups must include **SQL, `artifacts/uploads` and `artifacts/support-uploads`**. No retention/purge was enabled.

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools/test-v3.ps1 -Specs tests/field-improvements.spec.ts
```

The runner uses fictional SQL databases and test servers at 5081/5174; normal app/database stay on 5080/5173. Recovery checks refuse the normal database. The default runner includes these six new checks. See [implementation status](Implementation_Status.md) for passing results and [screenshots](screenshots/field-improvements/README.md) for fictional current UI without password screens.

Physical camera/microphone/GPS, virtual keyboard, native Excel opening and the actual printer/PDF destination still need acceptance on your device. Browser tests use simulated capture and verify the printable page, not a physical printer.
