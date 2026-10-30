# Test the field recce flow

Latest change: location is now requested automatically when starting a new recce and appears inside Site details. The survey has three tabs. For approved digital forms, notifications, job groups and reports, follow [the admin workflow guide](Admin_Forms_Reports_Guide.md). Older step-by-step location-tab references below describe the earlier layout.

Updated 26 October 2026. These screens are now implemented; the full Version 1.1 plan still contains later work.

**New media features:** see [camera, voice, panorama and office discussion](Camera_Voice_Panorama_Chat_Guide.md). Direct camera capture, recorded remarks and job chat now supplement the original upload/text journey below. References below to those features being pending describe the earlier slice; technical escalation and automatic offline sync remain pending.

## Open the application

Keep the API and web terminals running, then open http://localhost:5173 and refresh with Ctrl+F5. Company: DEMO. Worker: ravi. Administrator: meera. Use the local generated password in `artifacts/demo-password.txt`; do not publish that file.

If the terminals are stopped, run these from the project root in separate terminals:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools/start-api.ps1
```

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools/start-web.ps1
```

The new FieldRecceCapture database migration has already been applied on this machine. For another local checkout/database, stop the API before updating its schema, then run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools/migrate.ps1
```

Stop Vite before `npm.cmd ci --prefix src/web` if dependencies need installation. Ordinary use does not require reinstalling them.

## Try an existing assigned job

1. Sign in as Ravi. The worker home shows assigned job cards with a prominent **Start recce**, **Continue recce** or **View submitted recce** action. Office summary counters no longer dominate the worker's home screen.
2. Open Shree Stores and tap **Start recce** on its introduction screen.
3. Tap **Save site location** and allow browser location access. Inspect coordinates and accuracy. If permission is denied/unavailable, enter the real reason in the exception field; office will see it. This does not fabricate a GPS reading.
4. Tap **Continue**. Confirm the shop/address, add a contact if useful, choose site access and fill site notes. These are the manually configured sample signage form fields, not an imported form.
5. Continue to **Materials & photos**. Choose ACP fascia and tap **Add material**.
6. Tap **Open device camera** to capture a photo, or **Upload before photo** to choose a JPEG/PNG under 10 MB. The image is uploaded privately and opens in the editor. Camera access requires permission and localhost/trusted HTTPS.
7. In the editor, enter placement `Front fascia`, width `12`, height `3`, unit `ft`, and confirm the values were measured. Choose **Rectangle** and drag over the sign. You may also use ellipse, polygon, arrow, line or freehand Draw. Finish polygon with its button. Select mode moves/resizes marks and moves labels; Pan mode moves the photo. Zoom and Fit help inspect details.
8. Tap **Save marking**. You return to B01's card with a saved marked image and a Ready indicator. Original photos are retained. Drawing identifies the position; it never calculates physical measurements.
9. Tap **Add same material**. B02 starts with empty dimensions/evidence. Reuse B01's original explicitly or upload another photo. Mark B02 independently with width `6`, height `2` and placement `Side board`.
10. Optionally add another marked photo to B01. Every view saves its own drawing; choose which view is primary. Changing size/placement invalidates affected previews, which must be saved again.
11. You can also add LED strip (length input), Sign letters (count input), vinyl or flex. Counts do not require width/height.
12. Continue to **Review & send**. Check each item's labelled preview, measurements and location/exception, then enter remarks. Missing evidence is listed with the item code. Complete all items before sending.
13. Tap **Send recce to office**. Wait for the success confirmation; the submitted revision becomes read-only. Refresh and reopen it to verify persistence.

Use **Save draft** before closing the form; Continue also saves. Unsaved editor changes trigger a discard confirmation on Back. This slice saves to SQL Server; automatic offline drafts/queued uploads are not implemented. Do not assume an unsaved browser form is backed up.

## Create a new shop and assign it

1. Sign in as Meera.
2. Click **Create job**. Enter shop/site name, area/city, project and due date; choose Ravi in **Assign to worker** and save.
3. Alternatively assign an unstarted existing job using its **Assigned worker** selector. Started jobs cannot be silently reassigned in this workflow.
4. Sign out, then sign in as Ravi. Refresh the job list if needed. Open the new shop and follow the steps above.
5. After Ravi submits, sign in as Meera and click **View recce** on that job. Inspect Location, Site details, Materials & photos and Review & send, including original/marked comparison. The admin view is read-only; approval/correction decisions are not implemented yet.

## Check narrow screens

Use browser device emulation at 320, 360 or 390 px. The page should fit without sideways scrolling. Material/measurement controls stay touch sized. The editor uses a photo canvas above the measurement panel on phones and a side panel where space permits. The worker's active survey has its own layout rather than the office sidebar.

Device emulation does not provide a physical camera or a genuine site GPS signal. Browser tests use a clearly synthetic photo and simulated coordinates. Real-phone camera/GPS/microphone testing requires trusted HTTPS; localhost on your laptop is not localhost on your phone. LAN/HTTPS setup is still separate work.

## Support and current limits

Need help? opens the existing company support request form without closing the recce. Basic text tickets work. For two-way text, voice and small attachments, use **Job discussion**. Recorded item/site remarks are also available. Technical escalation, ticket-thread replies and notifications remain pending.

The recce slice supports a fixed sample form, five material presets, decimal length units, one editable/submitted revision per job and private files. Camera capture, recorded remarks, explicit area rules, panorama tagging and company job discussion are now available through the media guide. Arbitrary template import, configurable material catalogue, separate feet-and-inches controls, automated offline recovery, correction/review approval, reports and installation remain later milestones. Do not describe this slice as the whole Version 1.1 specification being complete.

Development checks create clearly fictional jobs such as Recce test shop, Validation test and UI assignment test. These are not real site evidence. Original user data and existing jobs were retained.

## Files and recovery

Recce content and original entered/canonical length values are in SQL Server. Uploaded originals and marked previews are under ignored `artifacts/uploads`. Back up both SQL and this private directory; a database-only backup cannot restore photos. The current revision stores validated structured JSON while the broader relational/versioned measurement model is still planned. Do not delete files from artifacts/uploads while records reference them.
