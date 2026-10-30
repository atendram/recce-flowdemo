# Admin workflow: forms, jobs, notifications and reports

Latest follow-up: [adding recce persons, clickable overview/MIS, placement and form handoff](Admin_People_MIS_Form_Guide.md). Overview cards now show their matching report on Overview; job filters on Jobs remain independent of MIS filters.

Open http://localhost:5173. Sign in with company `DEMO`, username `meera`, and the password in `artifacts/demo-password.txt`. Use a separate InPrivate window for worker `ravi`.

## Forms → test → approve → assign

1. Open **Forms** and enter a version name, such as “Retail site survey v1”.
2. Add field labels, types, required flags and choices. Available types: text, multiline text, number, checkbox, choice and date. A required checkbox means the worker must tick it; use a Yes/No choice when both answers are valid.
3. Optional: import a TXT file with one label per line or a CSV with labels in the first column. The importer replaces the unsaved field list. It proposes text fields; review each type and required setting.
4. **Save draft**. Complete the worker preview and click **Test completed form**. Missing required answers block the test.
5. **Approve form**. Approval is disabled until the test passes. Only approved company forms appear in job creation.
6. Saved versions are immutable in this prototype. **Copy** creates a new editable version; changes do not affect existing jobs. There is no automatic publishing or approval.

PDFs, scanned forms, Word documents, Excel workbooks and images are **not automatically converted** in this implementation. Their labels can be entered using Add field. OCR and document parsing still need implementation and review against real blank forms. No document is uploaded to an external AI/OCR service.

## Create and group jobs

Choose **Create job**, enter shop, city, project and due date, then select the approved form and assigned worker. Optional fields include full address, site phone, priority, work instructions, and recce group/batch. A group is a company-scoped label for organizing/filtering jobs, not a group chat or separate membership system. Work instructions and the call link appear in the worker survey.

Existing jobs continue using their original sample form. New forms are selected for new jobs. Started jobs cannot be reassigned in this workflow.

## Worker workflow and marking

Starting a new recce requests browser location permission once and opens **Site**. There is no separate Location tab. Coordinates and accuracy appear inline; retry or enter a reason if unavailable. Capture is saved when saving the draft or continuing. There is no continuous tracking.

The worker confirms the address and fills the assigned digital fields, then continues to **Materials & photos**. Material selection still controls Width/Height, Length or Count rules. Each material has independent photos, markings, dimensions and remarks. Required form answers and existing photo/marking requirements are checked on submission. Review shows the answers before sending.

Browser location needs localhost or trusted HTTPS on a physical device. Indoor GPS may identify a nearby building; always confirm the shop address.

## Notifications and conversations

The header bell shows unread incoming job messages (latest 100). Click one to open the job conversation. Opening the conversation marks its loaded messages as read for that account in SQL. Notifications refresh every five seconds while the page is visible. This is an in-app inbox, not browser push.

**Messages** shows existing conversations ordered by latest activity, with previews and unread counts. Start a new discussion from **Jobs → Actions → Job discussion** (admin) or **Job discussion** on the worker job. Chat supports typed messages, recorded voice notes, images and PDFs under existing attachment limits. Messages have familiar incoming/outgoing bubbles; no WhatsApp account or integration is involved. Assignment, submission and support-ticket notifications are not yet included in the bell.

## Filter and export

Admin Jobs uses compact rows with an **Actions** menu. Filter by search text, status, project, group, priority, worker and local due date. **Clear filters** resets the selection. Overview cards open their corresponding job status or support requests.

Set the Jobs filters, then open **Reports**. Select included columns and use ↑ / ↓ to order them. Digital form answers are available as columns named “Form / Field”. **Download CSV for Excel** exports only matching jobs, up to 500 per export. Each material gets a row; site answers repeat for each material. Jobs with no material get one row. Draft and submitted jobs are included according to the filters; use Submitted status for final evidence only.

CSV uses UTF-8 with a BOM, quotes values and neutralizes spreadsheet formula prefixes. This is CSV, not an XLSX workbook. Column selections/order are session state; saved report presets are not implemented. Rows contain measurements and remarks, not embedded images/audio.

## Optional readable address lookup

GPS coordinates and readable addresses are different. Reverse geocoding suggests a nearby address; it cannot guarantee the exact shop. Google documents this conversion and requires an API key: [reverse geocoding documentation](https://developers.google.com/maps/documentation/geocoding/guides-v3/requests-reverse-geocoding).

Phase 1 now hides unavailable address actions from workers and shows setup status to admins. A key alone does not enable the service: explicit company enablement, paid-call opt-in and server quota/deduplication controls apply. Suggestions are temporary and do not automatically fill the saved address. GPS/manual address entry remain available without a provider. See the current [Phase 1 setup and verification guide](RecceFlow_v2_Phase1_Test_Guide.md#address-lookup-and-costs). No live provider call has been verified.


The public OpenStreetMap Nominatim endpoint has strict shared usage limits (maximum one request/second across the application), attribution, and other restrictions, so it has not been connected automatically: [official usage policy](https://operations.osmfoundation.org/policies/nominatim/). A contracted provider or self-hosted service should be evaluated for production traffic.

## Database design

`FormTemplates` stores company, version name, approved field definitions in JSON, lifecycle status and creation time. Field IDs remain stable when a version is copied, enabling related versions to share report columns. Each job stores its selected template ID, group and work details. Starting recce copies the immutable definition into `RecceRevisions.ContentJson` together with answers keyed by field ID. The server validates the assigned company/form and prevents worker schema changes. No SQL table/schema is created per customer form or checkbox. `MessageReadStates` stores each user's last-read message ID per company/job.

The additive `DigitalFormsAndJobOrganisation` migration preserves existing jobs and recce media. Apply with the API stopped using the existing migration procedure when moving this code to another machine. Do not reseed or reset the database to see these changes.

## Verification

API build completed with zero warnings/errors; frontend production build and lint passed. All 22 distinct Playwright checks passed across the regression run and the targeted rerun after the admin tablet-layout fix. Coverage includes approved-form handoff, schema tampering rejection, required answers, report order and download, tenant isolation, persisted notification read state, automatic simulated GPS, camera/voice/panorama, image marking and submission. Admin tab layouts were checked at 320, 390, 768, 1024 and 1440 px; the Forms screen was checked at the same widths. The existing large lazy panorama-chunk build warning remains. Physical phones and live Google address lookup still need testing.
