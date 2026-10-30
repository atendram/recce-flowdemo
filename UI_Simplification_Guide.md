# Simpler RecceFlow workspaces

Updated 28 October 2026 using your tabbed-card sketch as the layout reference. Refresh `http://localhost:5173` with **Ctrl+F5**. Existing accounts, jobs, approved forms and image evidence continue to use the same backend; this update needs no SQL migration.

## Where to find things

| Main menu | Tabs / contents |
| --- | --- |
| Overview | Status cards, then Summary / People / Projects / Job report |
| Jobs | Jobs / Filters / Columns / Report |
| Company setup | People / Forms / Materials |
| Reports | Filters / Columns / Report / Jobs |
| Messages | Job conversations |
| Support | Help requests |

The admin sidebar now has six main entries. The mobile menu uses the same groups. **Company setup** replaces the separate People, Forms and Materials sidebar links. Switching between its three tabs preserves an open form draft while you remain in Company setup.

Titles have an underline, selected tabs have a clear accent, and cards use smaller headings and consistent spacing. Teal identifies main actions, violet identifies creation/setup, blue identifies lists, green identifies verified/active work, amber identifies pending/review work and coral identifies corrections. Status text remains visible alongside colour.

## People and materials

The **Add** card spans the page. Its fields use short rows on desktop and stack on mobile. The complete list is underneath, not beside the form. Click the add-card heading to collapse or reopen it.

Lists have search, status tabs and ten-row pages. People show identity/contact/workload/access in one row; materials show measurement mode, default area and active/archive state. Archive/reactivate and activate/deactivate controls retain their existing behaviour.

## Digital forms

Within Company setup → Forms:

1. **Create form:** import the CSV or add questions. Question settings are collapsible; long imported field lists can be expanded for editing.
2. **Saved forms:** search existing versions, copy, delete or restore them. Lists use ten-row pages.
3. **Test & approve:** saving/selecting a version opens its preview here. Complete the test and approve it. Feedback stays with the actions.

The selected definition and preview remain separate from a new form draft. Copy opens Create form. Form approval still makes a template available for job creation; office recce verification remains a separate workflow.

## Reports: filters → columns → report

Open **Reports**. Its Filters tab is the starting point:

1. Search a job/shop/client and choose status, client, project, person and due dates. **Today**, **This week** and **This month** fill the date range; **Any date** clears it. Week starts on Monday and date ranges use the browser's local dates.
2. Click **Next: choose columns**. Basic report and Measurements presets provide short starting selections. Use field search and checkboxes to choose data, then the numbered list to set column order. Up/down arrows change the serial order. Maximum 100 columns.
3. Click **Preview report**. The Report tab shows real data in the selected column order, with readable status tags. It shows up to 50 material rows; a job without material still gets a row.
4. **Download CSV for Excel** downloads all material rows for the selected scope (maximum 500 jobs). CSV status values retain the existing backend codes such as Assigned/Submitted/Approved; the screen shows their readable labels. Use **Refresh report** for an updated preview.

Column choices/order stay intact when switching tabs and refreshing the same workspace. A loading/new filter scope cannot export the old matching IDs. The **Jobs** tab allows row selection for a subset; otherwise all matching jobs are used. Returning to a different main workspace starts that workspace's own scope.

## Compact jobs and recce review

Jobs starts with search, coloured status filters and shorter table rows. **View** opens the job. The adjacent **More actions** control contains Chat, Images ZIP and Delete; it expands only that row. Individual/all marked-image downloads remain available on the job detail page.

The review page uses **Visit**, **Materials & images**, **Form answers** and **Verification** tabs. Location/times/notes are in Visit. Before and marked photos are in Materials & images. Review notes, approve and correction actions are in Verification. **Verify submission** jumps directly to that tab for a submitted recce.

Worker job lists have status filters with real counts. Search stays visible; secondary filters are under More filters. The survey keeps its three Site / Materials / Review steps with clearer icons, saved-state strip and compact spacing. GPS permission, photos, measurements and marking checks are unchanged.

## Platform owner

Platform login opens **Companies** and **Activity** tabs. Company creation is full width above the register. Selecting a company opens **Company details** / **Administrators** sub-tabs. Administrator editors are collapsible rows so account management does not fill the whole page at once. One-time credential display, first-login password changes, company access controls and reset safeguards are unchanged.

## See the screens

- [Screenshot gallery](../artifacts/ui-refresh/index.html)
- [Overview — desktop](../artifacts/screenshots/ui-overview-1440.png)
- [People — desktop](../artifacts/screenshots/ui-people-1440.png)
- [Materials — desktop](../artifacts/screenshots/ui-materials-1440.png)
- [Create form — desktop](../artifacts/screenshots/ui-form-create-1440.png)
- [Report filters — desktop](../artifacts/screenshots/ui-report-filters-1440.png)
- [Report columns and order — desktop](../artifacts/screenshots/ui-report-columns-1440.png)
- [Reports — desktop](../artifacts/screenshots/ui-report-1440.png)
- [Company setup — mobile](../artifacts/screenshots/ui-setup-390.png)
- [Report preview — mobile](../artifacts/screenshots/ui-report-390.png)
- [Worker survey — mobile](../artifacts/screenshots/ui-worker-site-390.png)
- [Platform owner — desktop](../artifacts/screenshots/ui-platform-1440.png)

Screenshots contain fictional verification records. Browser checks cover 320, 390, 768 and 1440-pixel widths, keyboard tab navigation, draft preservation, date filters, ordered previews/exports and the existing field/review flows. Wide tables scroll inside their card on a phone; the page itself stays within the device width. Native camera/GPS permissions still need real-device acceptance testing.
