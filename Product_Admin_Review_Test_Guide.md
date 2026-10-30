# Platform owner, company onboarding and recce verification

**Navigation update:** the newer [UI guide](UI_Simplification_Guide.md) replaces the older screen arrangement below. People/Forms/Materials are now under Company setup, reports use separate Filters/Columns/Report tabs, and job detail uses Visit/Materials & images/Form answers/Verification tabs. The access and review rules described here still apply.

Implemented locally on 28 October 2026. See [the scope and design](Product_Admin_Review_Plan.md). This guide describes the current product-administration slice; it does not claim a production deployment.

## 1. Open the new platform login

1. Save your work, refresh `http://localhost:5173` with Ctrl+F5, and sign out if you are in a company workspace.
2. On the login screen choose **Platform owner**. This is a separate account from meera or ravi and does not require a company code.
3. Open the local ignored file `artifacts/platform-owner-credentials.txt`. Use its username and temporary password. The provisioned username is `platform.owner`; never paste the password into a shared document or presentation.
4. Set your own password on the first-sign-in screen (12–128 characters, upper/lowercase, number and symbol). The temporary password no longer works after this change. The file is only a bootstrap handoff and is not updated with your chosen password.

The owner was provisioned during this change. For a **new installation**, migrate/build first, then run from the project root:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools/create-platform-owner.ps1
```

The command refuses to promote an existing company account. Running it again preserves an existing owner's password and does not generate replacement credentials for it. Existing company users do not become platform owners. Keep platform-owner access with the product operator; company administrators use Company workspace login.

## 2. Create and manage a company

On **Companies & administrators**, enter company name, a unique company code, administrator name and unique username. Email and phone are optional. Company codes allow letters/numbers/underscore/hyphen, 2–32 characters, and remain stable. Usernames are global across workspaces, 3–64 characters.

Click **Create company & admin**. The company and its first admin are saved together. A credentials card displays the login URL, company code, username and temporary password. **Copy credentials** and share them directly with that administrator through your chosen channel. Nothing is emailed or messaged automatically. Dismissing the card removes the password from the UI; passwords cannot be retrieved from the company list. Reset a password if a new handoff is needed.

Select a company in the register to:

- Edit its display name and office support contacts.
- Pause/reactivate company access. Pausing blocks its existing sessions and new company sign-ins.
- Edit administrator name, email, phone and access.
- Add another company administrator.
- Reset an administrator password. This ends their existing sessions, produces a new temporary password and requires a new first-login password change.

Recent actions appear in the platform audit log, without passwords. A platform session manages workspaces/admin accounts; tenant survey and media APIs still require a company membership. There is no implicit survey impersonation.

## 3. Company administrator's first visit

Sign out of platform login. Choose **Company workspace** and enter the supplied company code, username and temporary password. Complete **Set your own password** before company data is accessible.

Then use **Recce persons** to create workers, **Materials** to add catalog entries, and **Forms** to import/build, test and approve a template. In **Jobs → Create job**, enter shop, **Client name**, area, project, due date, contact/instructions, approved form and worker. Existing demo users retain their passwords and memberships.

## 4. Use the recce register

The company admin's **Jobs** page starts with a paginated table (25 rows/page): selection, recce ID, shop/site, client/project, recce person, due time, material count, verification, read state and row actions. My recce opens the same office register for administrators. Worker pages continue to show only assigned jobs.

Search recce ID/shop/client/area/project, or filter status, seen/unseen, client, project, worker and due dates. **Clear filters** resets the scope. New unseen submitted recces sort first, newest submission first. The register refreshes every 15 seconds while its tab is visible, or use **Refresh jobs**. A blue row and Unseen badge identify an unread submission. Text labels accompany every colour.

Seen state belongs to the current administrator and current submission. Opening the job marks that submission seen for that admin only. Another admin can still have it unseen. Resubmitting after corrections makes the new submission unseen again. **Seen is not approval.**

The table scrolls inside its container on smaller screens; page width stays within the device. Wider layouts keep the Actions column visible. Existing jobs may have blank Client because that field was added now.

## 5. Review one job

Click **View recce** on the row, or a job's View recce action in the overview report. The detail page shows:

- Known creation, start, submission and due timestamps, assigned worker and contact/instructions.
- Captured coordinates, accuracy, capture time and a map link, or the worker's GPS exception.
- Site notes, form answers, recce remarks and available voice notes.
- Every material's placement, measurements, quantity and enabled area calculation, its before photo and saved marked views.
- Panorama source images and linked-material counts.
- **Open job conversation**, using the existing text/voice/file chat.

Historical creation/start times were not stored before this update. They show **Not recorded**, rather than invented timestamps. A GPS coordinate/address suggestion still needs human confirmation of the actual shop.

Each saved/current marked view has **Open full image** and **Download marked image**. **Download all marked images** on the detail page, or **Images ZIP** on the row, exports the current marked views for that job. Names include item/view identifiers, so repeated materials do not overwrite one another. ZIP export supports up to 320 views / 250 MB; larger sets require individual downloads. Missing files produce an explicit error. Unfinished/stale previews are not exported as current evidence. Originals remain visible as before/source photos.

## 6. Approve or request corrections

| On-screen state | Meaning | Worker action |
| --- | --- | --- |
| Pending visit | Assigned, not started | Start recce |
| In progress | Editable field survey | Continue and submit |
| Awaiting review | Submitted to office | View read-only submission |
| Changes requested | Office needs corrections | Edit and resubmit |
| Verified | Office approved the submission | View verified, read-only recce |

For an Awaiting review job, enter an optional review note and click **Approve recce**, or enter a required correction note and click **Request corrections**. The green result confirms approval; the worker sees Verified in their list and inside the recce. A correction request reopens the worker's saved draft and shows the office note. The worker fixes the evidence and submits again; the admin reviews the new submission.

The server checks the submitted revision version before deciding. A stale/already-reviewed request returns a conflict instead of approving different evidence. Each decision retains a submitted-content snapshot and reviewer/time/comment; review history is listed on the detail page. Approving a **form template** and approving a **completed recce** are separate actions.

## 7. Choose export data and serial order

In Jobs, apply filters, then click **Choose export columns**. Export all matching jobs, or tick row checkboxes for a subset. In **Include data**, choose fields. In **Column order**, move them up/down to decide serial position. Click **Download CSV for Excel**.

The **Reports** navigation opens its own register with the export controls already expanded. Apply filters on that page for its export. Column choices/order are retained while the same register refreshes; a loading filter result cannot export the previous scope.

Exports include client, worker, status, start/submission/review timestamps, review note, seen/unseen, coordinates/accuracy, site notes, placement and material/measurement data. Dynamic form questions are loaded from the forms actually assigned to those jobs, including retained deleted definitions. One row is produced per material; a job without materials still gets one row. Maximum 500 jobs/export; narrow the filters for a larger register. Timestamps in this configurable CSV are UTC/ISO; the app and overview's explicitly labelled local exports use your device timezone.

Overview adds clickable **Verified recces** and **Changes requested** cards. Its charts, worker-performance report and project summary distinguish verified work from awaiting review. Verified jobs are excluded from overdue work. Reports count active jobs; deleted jobs are excluded.

## 8. Delete and restore

**Jobs:** use the row's Delete action and confirm the named job. It leaves active lists/reports and is unavailable to the worker. Select **Deleted jobs** to find and restore it. Survey/media/review records remain stored. A repeated old creation request cannot silently recreate a deleted job.

**Forms:** find the saved version in Forms, click **Delete form** and confirm. It disappears from new-job selection. **Show deleted forms → Restore form** restores it. Jobs already assigned to that definition can still start/validate against their retained form, and historical answers remain reportable.

These are reversible removals, not permanent evidence purges. There is no bulk permanent-delete feature.

## Validation and current boundaries

The additive migration is `20261028111015_ProductAdministrationAndReview`. Before applying it, a SQL COPY_ONLY/CHECKSUM backup was created and verified at `artifacts/backups/product-admin-20261028-110936/RecceFlowDb.bak`. Existing recce JSON hashes and job/form counts matched afterward. Tests create clearly fictional companies, users and jobs; the temporary test platform owner is disabled afterward. The actual `platform.owner` account remains available for your first login.

Targeted API/browser tests cover onboarding, company/role isolation, first-login password change, reset invalidation, independent read state, correction/resubmission, stale review rejection, verification, single/ZIP downloads, export ordering and delete/restore. Layout checks use 320, 390, 768 and 1440 pixel viewports. Browser emulation does not replace actual phone acceptance testing.

This provides the requested local product administration and MIS workflow. Billing/subscriptions, automated invitations, MFA/recovery delivery, production hosting/HTTPS, distributed storage/backup operations and offline sync remain separate product work. No external credentials were sent and no deployment was performed.
