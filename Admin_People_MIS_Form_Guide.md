# Admin guide: recce persons, overview MIS and forms

**28 October update:** use **Materials** to add company-specific measurement types. Forms now import typed CSV and actual multiple-selection checkbox groups, with feedback beside the approval buttons. See [the materials/CSV test guide](Materials_CSV_Approval_Test_Guide.md) and [downloadable examples](examples/RecceFlow_Form_Template.csv).

Open http://localhost:5173 and refresh with Ctrl+F5. Sign in with company `DEMO`, username `meera`, and the password in `artifacts/demo-password.txt`. The examples below are fictional.

## Add a recce person

1. Open **Recce persons** in the sidebar. There is also an **Add / manage recce persons** shortcut on Overview.
2. Enter Full name, Login username and Account password. Phone and email are optional. A username has 3–40 letters/numbers/dots/dashes/underscores. Passwords need at least 12 characters including uppercase, lowercase, number and symbol.
3. Click **Create worker login**. This creates an active Worker membership for the current company; it does not grant admin access.
4. Give that person the company code, chosen username and password privately. An email invitation is not sent automatically.
5. Select the person under **Assign to worker** while creating a job, or assign an unstarted job from Jobs → Actions.

The people list can be searched and filtered by access status. It shows assigned, in-progress and submitted job counts. **Deactivate** stops access while preserving jobs, draft/evidence and history. Inactive people are removed from new-assignment choices. **Activate** restores access. A started job still requires reactivation to continue; controlled draft handover and password recovery are later work. Creation and company membership commit in one SQL transaction. Usernames are unique across this prototype's identity store; another company's existing account cannot be attached by guessing its username.

## Read the overview and MIS

Overview now has six clickable cards: All jobs, Assigned jobs, In progress, Awaiting review, Overdue jobs and Unassigned jobs. Clicking a card keeps you on Overview and moves to the matching job report below the graphics. It does not silently navigate to Jobs. Use All jobs to clear the card selection.

Set **Due date from / to**, **MIS project** and **MIS recce person** to choose the report scope. Dates include the selected end day in the device's local time. The cards, charts and worker/project summaries use that scope; the selected card and Search overview report further narrow the job-detail table. A refresh timestamp is displayed. Old results/exports are hidden while a new filter request is loading, and failures show an error rather than keeping mismatched results.

- **Job progress:** counts from the database for assigned, in-progress and submitted jobs.
- **Seven-day submission trend:** actual recce submission timestamps from the matched jobs, grouped by device local date/current timezone offset. It is not an estimate of worker activity.
- **Recce person performance:** workload, submissions and overdue counts for people with matching jobs. Click a person's name to filter their work.
- **Project summary:** submitted/total work and overdue jobs by project.
- **Job report:** matching sites, assigned person, due time, status and material count; View recce opens the saved survey. There are 20 rows per page.

**Export job MIS** downloads all matching job-detail rows, including rows on other pages. **Export people MIS** downloads the worker summary for the current due/project/person scope. Both are UTF-8 CSV files that open in Excel. Select **Reports** for the existing material/answer report where you choose columns and their order; that screen uses the Jobs filters as shown there.

Reports are company-scoped, require admin access and support up to 500 matching jobs per MIS request. Narrow filters if more match. Fields are read from actual jobs/revisions; no attendance, payment or productivity scores are invented. “Overdue” means unfinished fieldwork past the job due time; submitted jobs are counted in Awaiting review and verified jobs are complete. Material area uses only enabled server-calculated area modes and can include unfinished draft measurements. A submitted recce is **not** an approved recce; use the implemented [office verification and correction workflow](Product_Admin_Review_Test_Guide.md) to decide. The overview now distinguishes verified and correction states.

## Create → test → approve → assign a form

1. Open **Forms**, or use **Create / test forms** on Overview.
2. Enter a name, for example **Retail survey v1**. Click **Add field** for each extra question. Set its label, type, choices and Required flag.
3. Click **Save draft**. The saved version appears under Saved versions and opens in **Worker preview** on the same page.
4. Fill the preview as a worker would. Click **Test completed form**. Required fields and allowed values must pass.
5. Click **Approve form** after the test passes. This publishes that definition for new jobs; it does not approve site evidence. Test answers are sample input used for validation, not answers copied into real jobs.
6. Open **Jobs → Create job**. Enter the shop, address/due details, choose the exact name under **Approved digital form**, choose **Assign to worker**, then Save job.
7. The recce person signs in, opens that assigned job and clicks **Start recce**. The approved questions appear in **Site**. They continue to **Materials**, capture photos/mark each material, then **Review** and send to office.

Approving a form does **not** automatically change old jobs. Existing jobs keep the template selected when they were created. Use **Copy** to make a new version for future jobs; the approved version stays unchanged. The standard shop/address/contact fields and material measurements already exist: avoid adding another Shop name/Address/Width/Height as unrelated custom questions.

For a simple first form, use:

| Label | Type | Setting |
| --- | --- | --- |
| Mounting surface | Choice | Concrete, Brick, Glass, Other; required |
| Power available | Choice | Yes, No; required |
| Access notes | Textarea | Optional |
| Site details checked | Checkbox | Required only if it must be ticked |

A required checkbox means the worker must tick it. Use a Yes/No choice when both answers are valid, and multiselect for several independent options. You can enter fields manually, import simple first-column labels, or use typed CSV with `id,label,type,required,options,section,description`. Options use `|` separators. The supplied v3 signage CSV headers and printed checkbox groups are also recognized. Automatic scanned PDF/image conversion is still not implemented; see [API options and costs](Extraction_Location_API_Options.md).

## What does Placement mean?

Placement is the physical position of one material item. In both the material card and photo editor, you can choose a common suggestion and/or type your own wording. Examples: Front fascia, Left side board, Front window, Entrance/door, Awning or Indoor wall. “Front fascia above main entrance” is a useful custom entry. Two ACP items at different positions still have independent dimensions, photos and marks.

This selects a location description, not a material type or an automatic measurement. Enter tape measurements separately. Save marking draft preserves unfinished work; Save item checks the required evidence. Changing placement invalidates affected previews so the final image description remains current.

## Sign out

**Sign out** is in the top-right header on desktop, tablet and phone. The header stays visible while scrolling the normal workspace. In full-screen recce/photo capture, first save and return to Jobs, then sign out.

## Implementation and verification

People management uses the existing Identity users and company memberships. MIS is read-only over existing jobs/revisions; no new migration or SQL reset is required. New API routes: admin GET/POST `/api/people`, POST `/api/people/{id}/access`, POST `/api/reports/mis`. Placement suggestions keep the existing placement field and preview invalidation rules.

New tests cover account creation, duplicate/weak credentials, worker-only/company isolation, immediate inactive-session denial, known MIS status/date/area totals, overview card filtering, CSV export, desktop sign-out, widths 320/390/768/1024/1440, and the complete create person → test/approve form → assign job → worker answers/placement flow. Existing media, independent marking, save safety and tenant regressions remain relevant. Actual results are recorded with this change's completion response.

Verified results: API build passed with zero warnings/errors; frontend build and lint passed. All 30 distinct Playwright cases passed across the full regression run and targeted reruns. The initial full run passed 28/30; the final rerun passed the older job-save status check and worker/office chat, then all three new admin cases. The sticky-header/chat-close stacking issue found by regression is fixed; the header stays below dialogs. The existing lazy panorama chunk size warning remains. Current screenshots: `artifacts/screenshots/admin-mis-390.png` and `admin-mis-1440.png`. Tests use fictional accounts/jobs and simulated capture devices, not real field activity.
