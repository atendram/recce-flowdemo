# RecceFlow v2 implementation checklist

Source brief: `D:\Download\RecceFlow_GitHub_Review_and_Codex_Prompt_v2.md`, version 2.0. Compared against local commit `1c78b9e`; working tree was clean. The brief is the requested specification, not evidence that proposed features already exist.

## Phase 1 — implemented

| Current finding confirmed in source | Target |
| --- | --- |
| Save response replaces all form content | Serialized saves; edits made during a request remain unsaved and visible until acknowledged |
| Create and assign are separate requests | One atomic create/assignment with persistent operation ID and identical-retry recovery |
| Three tabs but four-step labels; worker lands on Overview | Site → Materials → Review; worker lands on My jobs |
| Panorama first; all cards expanded | Routine capture first, advanced tools under More, completed items collapsed |
| Lookup button shown without setup; no job or usage limits | Secret-free capabilities; unavailable action hidden; job binding and explicit cost controls |
| Unit switch relabels numbers | Explicit conversion versus new-unit entry; feet/inches controls; server canonical dimensions |
| Marking cannot save before confirmation | Partial drawing draft saves; ready/submission retains stronger checks |
| Large duplicate labels and tutorial copy | Compact dimension-linked movable labels; contextual replayable help |

Preserve company/assignment checks, CSRF, rowversion, submitted evidence, item IDs, originals, media and existing SQL. No deployment, push, paid-provider enablement or database reset is part of this work.

## Persistent backlog — later phases

Follow-up requested by the user: basic recce-person account creation/activation, admin overview MIS/exports, placement suggestions, visible sign-out and the form handoff guide are now implemented. This completes that subset of organisation setup; it does not mark all of Phase 2 complete. Invitations/recovery, typed teams, material catalogue, template families, routes and the other gates below remain pending. See [the follow-up guide](Admin_People_MIS_Form_Guide.md).

2. Organisation/settings/invitations, named permissions, typed teams, projects/sites/batches, company materials and pinned rule versions; editable template families/versions, standard-field mappings, proper CSV preview, real routes and role navigation. Gate: two shops assigned to a team/batch using published form/material rules, company isolation verified.
3. Add revision numbers/history without replacing existing IDs; update all single-revision readers. Review queue, linked corrections, new draft/resubmission, exact-revision approval, audit and pinned evidence reports. Gate: B02 changes from 6 × 2.5 ft to 6 × 2 ft in revision 2 while revision 1 stays intact. XLSX needs dependency/license review.
4. Scoped IndexedDB drafts and upload queue, explicit sync/conflicts, staged uploads, trusted preview rendering, event notifications, hosted HTTPS/limits/backup restoration and real-device tests. Gate: no silently lost acknowledged drafts or false submission on network loss; revoked access blocks sync.
5. Private blank PDF/image sources, extraction queue and visible uncertainty, field/units mapping, explicit review/test/publication and familiar print layout. Manual builder stays available without providers. No OCR claim until tested with actual representative forms.
6. Optional artwork proof decisions, released production orders pinned to approved evidence, QC/partial quantities/dispatch, installation tasks and after-photo review; authenticated QR only if needed. Recce-only jobs remain supported.

Phase gates and detailed requirements remain in the supplied brief. Later phases are not silently included in Phase 1 or described as implemented.

## Verification record

Delayed-save typing/reload; identical/concurrent job retries and changed-payload conflicts; invalid initial assignment leaves no job; partial marking save/reopen and final blockers; explicit unit conversion and feet/inches; repeated ACP independence; unavailable geocoding/job denial/quotas; current regressions and responsive screens. Record commands/results, migrations, before/after screenshots and limitations at phase completion.


Phase 1 implementation and migration verification are complete. Five focused tests pass; the existing regression cases pass across the full run and targeted reruns after correcting the old Site overview expectation and an interrupted reload check. Quota/dedup guards pass separately with a fake key and zero quota. Final build/lint and screenshots are recorded in [the test guide](RecceFlow_v2_Phase1_Test_Guide.md). No push/merge or paid integration enablement was performed. Phase 2 is the next backlog entry; it has not been started.
