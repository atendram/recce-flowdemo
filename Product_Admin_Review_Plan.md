# Product administration and recce review

Implementation scope, 28 October 2026.

## Access and company onboarding

- Platform owner (SuperAdmin) has a separate login. It manages company records and company-admin access; it does not receive implicit access to tenant survey/media endpoints.
- The initial platform owner is provisioned from a local command, never from public signup. Existing company admins cannot promote themselves.
- Company creation and its first administrator are committed together. Generated credentials are shown once for manual sharing. Passwords are hashed in Identity; company admins must change their temporary password on first login. Reset invalidates existing sessions.
- Company access can be paused/reactivated. Platform actions are audited. This is the foundation for a product; billing, domain hosting and automated invitations are separate work.

## Office job register and review

- Start with a paginated, searchable table: recce ID, shop, client, project, worker, due date, material count, review status, seen/unseen and actions.
- Each admin has independent submission read state. Unseen submissions sort first, newest submission first. Viewing a submission marks only that submission as seen; a resubmission becomes unseen again. Seen does not mean approved.
- A job detail screen shows known start/submission timestamps, captured GPS accuracy and address/exception, form answers, material measurements, before photos, current marked views, written/voice remarks and job conversation.
- Download a current marked view individually or all current marked views for one job in a ZIP. Downloads enforce company and job access. Historical or unfinished previews are not presented as current evidence.
- Review requires a submitted revision and its current version. Approve makes it verified/read-only. Request corrections requires a comment and reopens the worker draft; an immutable review record retains the submitted evidence and decision. Worker pages display pending, in-progress, awaiting review, correction and verified states.

## Removal, exports and MIS

- Delete removes a job/form from active lists, with explicit confirmation and restore. Evidence, assignments and approved form definitions remain stored so historical recce validation is not broken. Deleted forms cannot be selected for new jobs; existing assigned jobs retain their definition.
- Reports allow column inclusion and serial order. Add client, worker, start/submission/review timestamps, coordinates, read state and decision details. Exports respect current filters and the company boundary.
- Overview includes verified and correction counts with clickable detail filters. Status labels use colour and text so colour is not the only signal.

## Verification

Back up and verify the database before applying the additive schema migration. Check tenant/platform isolation, forced password changes/reset, duplicate onboarding, review version conflicts, resubmission/read state, evidence downloads, deletion/restore, export ordering and desktop/mobile layouts. Real-device camera/GPS and production deployment remain separate acceptance checks.
