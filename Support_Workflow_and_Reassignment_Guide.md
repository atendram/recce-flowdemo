# Support tracking and job reassignment

30 October 2026. Open **http://localhost:5173** and refresh with **Ctrl+F5** to load the current UI.

## Give an existing job to another recce person

1. As the company admin, open **Jobs**, find the job and select **View**.
2. Select **Reassign job**, choose another active recce person and confirm. For work already started, enter the reason for the change.
3. The new person opens **My jobs** and continues the saved draft, photos and notes. The previous person loses access to that job and its private media.

Reassignment is available for **Assigned**, **In progress** and **Needs correction** jobs. Submitted or verified work must be returned for correction before transferring. The original start time and evidence remain in the record, and reassignment is audited. A new visit does not silently replace the recorded GPS or start time; check the visit details and update the editable site information where appropriate.

## Worker: ask for help and track it

Open **Support → Ask for support** (or **Ask for support** from the workspace). Optionally link a job, choose the category and enter the issue. You can type, record a voice note, or use both. For voice: **Record → Stop → Use voice note → Send to office support**. Sending waits until the recording/upload is complete.

Your saved request appears in **My requests**. Select **View / track** to read replies and see the handling team and status:

| Status | Meaning |
| --- | --- |
| Pending | Raised or reopened; waiting for action |
| Processing | Office or developer is working on it |
| Resolved | A team member has supplied a resolution note |

Reply in **Reply / update note**, then **Save support update**. If a resolved issue continues, select **Reopen — I still need help**, explain why and save. Workers can see their own requests and reopen them; the office/developer manages Processing and Resolved.

## Admin: office requests and developer help

**Support → Company requests** lists your company's worker requests and requests sent to the developer. Use the search box, status buttons, **Handling team** or **Raised by me** filters, then select **View / track**.

- For an office issue, reply and choose **Processing** or **Resolved** under **Update status**. Resolving requires a note.
- If technical help is needed, choose **Escalate to developer**, explain the help needed and select **Send to developer**. The screen explicitly confirms that this shares the request, recorded voice and reply history. A resolved request must be reopened before escalation.
- A new request raised by an admin goes directly to the developer. Use **Ask for support**, type or record the issue, then **Send to developer**.
- After escalation, company admins can still follow and update the same request. The worker who raised it can track the status and replies too.

## Developer: shared issues across companies

Sign in using **Platform owner**, finish any required password change, then open the platform console's **Support** tab. It shows admin-created and explicitly escalated requests, with company identifiers, search and status filters.

Open a request, reply, choose a status and save. Add a resolution note when marking it **Resolved**. Company admins see the same history. Developer support access includes the shared request recording; it does not grant access to the company's underlying job photos, recce records or job chat. Other companies and workers cannot browse the request.

## WhatsApp contact

Inside a saved request, the admin can select **Open WhatsApp** to contact **+91 9326861539**. The draft includes the request reference, company code, subject and status. Review the text and press Send in WhatsApp yourself. Opening the link does not send a message, escalate the issue or change its status. WhatsApp replies do not sync into RecceFlow; record the relevant outcome in the request history.

This uses ordinary [WhatsApp click to chat](https://faq.whatsapp.com/5913398998672934), not the Business API. The configured international number is in `Support.DeveloperWhatsAppNumber` in `src/api/appsettings.json`.

## Alerts, loading and safe retries

Submitting supported forms shows **Please wait…** while the request is running, then a success or error toast. Support update buttons show their saving state and prevent another submission while waiting. The animation indicates activity; it does not invent a percentage or completion time. Inline validation and error messages remain available. Toasts are dismissible, respect reduced-motion settings and allow clicks through their message area so they do not block the page's actions.

Support badges count unresolved requests visible to the signed-in user. While the app is open and visible, it checks for updates approximately every **10 seconds** and shows a toast for other people's new support activity. Use **Refresh requests** for the list and **Refresh history** in an open thread. These checks are not push notifications when the app is closed.

Refreshing history preserves your unsent reply. If another team member changed the request, refresh before saving against the new version. If the server response is lost, **Check and retry same update** resends the same operation instead of creating duplicate history. Network errors leave your entered content available. Session changes clear old notifications. Offline sending and automatic transcription are not included.

## Storage and local update

Migration **20261030064642_SupportIssueWorkflow** adds support destination, version/timestamps and an event history. Old `Open` tickets display as Pending without rewriting their original stored status. Existing tickets remain with Office until an admin escalates them.

The migration has been applied to the local database. Before applying it, a COPY_ONLY/CHECKSUM backup was verified through a restore: `artifacts/backups/workflow-20261030-7b5189c0/RecceFlowDb.bak`, restored database `RecceFlow_V3_Restore_5ac8c194`. All **388** then-existing recce upload files and **3** separate support voice files were copied and hash checked. Comparisons preserved existing recce/review JSON, account state and job/form/support data. No real account password was reset during this support change.

Back up SQL together with **artifacts/uploads** and **artifacts/support-uploads**. This update does not delete old media or enable an automatic purge. For startup commands see the [project README](../README.md); use the current API build and refresh the web app.

## Check the complete journey

Create a fictional test job and support issue, then use separate browser sessions for worker, admin and developer:

1. Reassign an editable job; confirm the new worker can continue and the former worker loses access.
2. As the worker, send typed or recorded support and open its tracking history.
3. As admin, mark it Processing, reply and escalate with a reason. Also create a separate direct developer request.
4. In the platform Support tab, locate the shared issue, reply and resolve it with a note.
5. As the worker, refresh history and reopen it with a reason. Confirm the office and developer see Pending again.
6. As admin, inspect the WhatsApp draft; send only when you intend to contact the number.

Automated checks use a separate fictional SQL database and ports 5081/5174:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools/test-v3.ps1 -Specs tests/support-workflow.spec.ts
```

The runner restores only its fictional owner's credential baseline between suites; it does not recover or change the normal platform owner's password. **29 distinct targeted checks passed across final runs**, including six support checks, reassignment, existing field/export behavior, session recovery, responsive layouts and product administration/review. API build, web build and lint passed; the existing lazy panorama chunk-size warning remains. The support checks include concurrent updates, access isolation and a successful save followed by a lost response, retried without duplicate history.

Physical-phone microphone/keyboard behavior and actual WhatsApp delivery require manual acceptance. See the [current screenshots](screenshots/support-workflow/README.md).
