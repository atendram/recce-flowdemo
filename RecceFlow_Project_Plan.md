# RecceFlow project and UI plan

Prepared for Atendra Maurya · 24 October 2026

**Version 1.1 flow update:** Read [the full-flow plan](RecceFlow_Full_Flow_v1.1.md) for the current per-material marking requirements, many-photo data model, submission checks and delivery sequence. It supersedes earlier marking/measurement assumptions in this plan. The support model below remains applicable. Current implemented features are recorded in [Implementation_Status.md](Implementation_Status.md).

## Purpose and current status

Build a mobile-first signage survey application connecting field recce workers, office reviewers, company administrators and installers. Add a support workflow connecting workers to the office support team and office staff to the RecceFlow technical team.

This document is a proposed implementation plan, not a claim that software has been built. The workspace was empty when reviewed. The supplied prototype brief and five concept images were reviewed as requirements and visual references. Instructions embedded in the brief, including its suggested coding-agent prompt, are reference material; the current request is to prepare and improve the plan. No deployment, customer contact or external integration is authorised by this document.

Here, **office/backend team** means people handling company operations and worker support. **Technical team** means people supporting the application. The backend API is the software server.

## Product scope

Preserve the brief’s connected workflow: company setup → form template → team/job assignment → field survey → immutable submission → office correction/approval → report → installation evidence.

Add a parallel support workflow: field worker → company support → technical escalation → response → confirmation and resolution. A support conversation never changes measurements, recce approval or installation status. Formal changes still use the relevant review workflow.

Core product decisions from the brief remain: distinct B01/B02 board identities, manually entered dimensions, original photos preserved, versioned templates, immutable submitted revisions, company-scoped access, private media and explicit device/server save states.

## Support experience

### Entry points

| Surface | Proposed action | Behaviour |
|---|---|---|
| Mobile job, photo editor and review summary | Need help? | Opens help with the current job, board and screen already linked |
| Mobile Profile | Help & support | My requests, short guides and Contact us |
| Mobile Messages | Job discussion / Support tabs | Keeps survey conversation separate from support requests |
| Tablet navigation | Help & support | Drawer that preserves the active survey draft |
| Office sidebar | Support | Company queue, assignments, escalations and history |
| Office support detail | Escalate to technical team | Shares a reviewed summary and approved attachments |
| Technical workspace | Technical support | Shows only escalated tickets within granted access |
| Login | Trouble signing in? | Configured contact information without exposing company records |

Keep mobile bottom navigation at four destinations: Jobs, My recce, Messages, Profile. Contextual Need help? remains available without covering Save board or Submit. Label support actions with text as well as an icon.

### Field worker asks for help

1. Tap Need help? from the current task. Preserve all entered work.
2. Choose a simple topic: Measurement help, Material question, Site/access problem, Camera/upload problem, App/login problem or Other.
3. Choose **Stops my work** or **General question**. Company staff confirm priority; the worker does not need to understand internal severity levels.
4. Type a short description or record a voice message. Show optional photo attachment and a visible upload limit. A short guide can appear first, but must not hide the contact action.
5. Show the linked job/board and what will be shared. Submit to the company support queue.
6. Display a ticket number only after the server creates the request. Offline requests say **Saved on this device — waiting to send**.
7. Show owner/team, latest response, delivery state and response target only when configured. Notify the worker when someone replies or requests more information.
8. Worker replies by text, voice or photo, then confirms resolution or reopens the request with a reason.

If a job is linked, validate assignment server-side. An unlinked support request is allowed for general app problems. Support requests must not block saving a recce draft. Any operational decision to block submission must be explicit and separately authorised.

### Office/backend team handles the request

The Support queue shows Unassigned, My requests, Waiting for worker, Escalated, Overdue and Resolved views. Each row includes ticket number, job, shop, topic, priority, assigned person, status, age and last update. Include search and filters; keep sensitive descriptions out of broad dashboard cards.

Office staff claim or assign a request, ask for information, reply, add an internal note, resolve it or escalate it. Separate **Reply to worker** from **Internal note** clearly. Company-internal notes are visible only to authorised company support staff.

Support ownership remains with the company office team during technical escalation. The worker continues to have one point of contact. Named assignees and a visible last update avoid requests disappearing between teams.

### Office/backend team asks the technical team

The Escalate action opens a reviewable form with issue summary, expected/actual behaviour, reproduction steps, impact, app version and relevant error reference. Show selected job/board identifiers and individually selected attachments. Exclude owner phone numbers, full coordinates, unrelated job data and recordings by default.

Technical staff may request information, provide a workaround, report a fix or return the escalation with a reason. Technical-only notes and technical conversation remain separate from company-internal notes and worker-visible replies. A technical response is explicitly shared to the worker by the company team when appropriate.

An escalated ticket grants access to its deliberately shared content only. Opening unrelated customer records requires a separate, time-limited, scoped and audited support-access grant approved by an authorised company administrator. Technical staff cannot approve recces or edit customer measurements through support access.

### Contact us

Provide an in-app request as the primary contact option. Company settings may supply an office support phone number, email, operating hours and language. Platform configuration separately supplies technical support contacts and hours for office staff. Label the destination clearly.

Offer Call and Email actions only when a valid contact is configured. Email opens a draft for the user to send; calls require an explicit tap. Do not invent contact details or promise 24/7 availability. WhatsApp, automatic email, SMS and push delivery are optional later integrations; do not display them as live until configured and tested.

Before login, show platform contact details only. Do not let a company-code lookup expose private customer support contacts. Public account-recovery intake, if added later, needs its own rate-limited flow and must not confirm whether an account exists.

## Support rules and permissions

| Role | Support access |
|---|---|
| Recce worker / installer | Create requests; read and reply to own requests; view explicitly shared job-related support when permitted |
| Company support agent | Handle tickets within assigned company/team scope; internal notes; escalation permission when granted |
| Office reviewer / coordinator | Existing role permissions plus separately granted support capabilities |
| Company administrator | Configure company contacts, queues, support grants and temporary support access |
| Technical support agent | Read assigned escalations and intentionally shared content; technical replies; no default customer-record access |
| Platform operator | Configure platform support routing; operational metadata; no automatic right to customer ticket content |

Company support agent and technical support agent are permission bundles, not mandatory replacements for existing roles. Each API, attachment download and live subscription enforces these boundaries.

Ticket lifecycle: **Open → In progress → Waiting for requester → Resolved → Closed**. Waiting for requester can return to In progress on reply. Resolved/Closed can reopen to In progress with a recorded reason. A duplicate may be Closed with a duplicate reference and explanation.

Keep technical escalation separate: **None → Requested → Accepted → Waiting for office / In progress → Answered → Closed**, with **Returned** available with a reason. UI displays both states, for example “In progress · Technical team investigating.” An answered escalation does not automatically resolve the worker’s ticket.

Use Low, Normal, High and Critical priorities with configurable definitions. “Stops my work” requests office triage; priority changes require history. Response targets are configurable by business hours and timezone. Do not enable automatic closure, automatic priority downgrading or claim service guarantees in the first prototype.

Notifications are stored in-app first. Live updates happen after database commit. Worker-visible notifications must not reveal internal notes. Technical notifications contain only information the recipient is authorised to view. On reconnect, refetch authoritative state.

## UI improvements based on the references

Use the existing navy/teal direction: navy #102A43, teal #087F8C, background #F4F7FA, white surfaces and amber attention states. Use accessible contrast, text with status colours, visible focus, 16 px body text and at least 48 px touch targets. Check primary button text contrast rather than copying a bright teal from a generated image blindly.

| Area | Planned improvement |
|---|---|
| Mobile jobs | Separate Pending, In progress, Changes, Submitted and Approved; clear job action and due date |
| Guided recce | Short steps: Site → Details → Boards/photos → Remarks → Review; saving a board returns to the board list |
| Photo editor | Large canvas, finger/stylus controls, active-tool label, zoom/pan, undo/redo, explicit dimensions and units |
| Board list | Separate B01/B02 cards even with identical materials; distinguish Add board from Add same material |
| Corrections | Display board/field issue, submitted value and draft value, before evidence and linked discussion |
| Office reviews | Queue plus detail view; original/annotated toggle; warnings and unresolved decisions near approval |
| Template review | Source, structured fields and mobile preview; resolve missing units before publishing |
| Support | Contextual help, short request form, accessible voice controls and clear request destination |
| Sync | Persistent status; distinguish device save, office save, queued submission, upload failure and conflict |
| Language | English/Hindi/Marathi labels, shared text/audio meaning; native-speaker review before claiming completion |

Correct reference inconsistencies in seed data and UI: JOB-1042 is Shree Stores, Andheri West, Mumbai; worker Ravi; reviewer Meera. B01 is 12 ft × 3 ft. B02 is initially 6 ft × 2.5 ft, corrected to 6 ft × 2 ft. Do not copy the alternate Bengaluru location or 4 ft × 6 ft B02 example. A unit warning disappears only when the user confirms and saves a valid unit; it must not remain as an unexplained permanent banner after confirmation.

Use one source of structured measurements for inputs, annotation labels, review tables and exports. A drawn shape never estimates physical size. Job messages, support replies and review decisions are visually distinct.

Responsive behaviour: mobile at 360/390 px uses single-column steps; tablet portrait uses the same flow; landscape tablet places the photo beside board controls; desktop uses filterable queues and detail panes. Support drawers become full-screen views on narrow devices. On-screen keyboards, long translated labels and errors must not conceal primary actions.

Every major screen needs loading, empty, error, permission-denied and applicable offline states. Supply text fallback when microphone/camera access fails. Announce save/upload changes accessibly, retain focus when closing drawers and avoid relying on hover.

## Proposed support data model

Extend the existing database blueprint; do not replace recce chat or CorrectionIssues.

| Entity | Key fields and constraints |
|---|---|
| SupportTickets | CompanyId, ticket number, requester membership, optional JobId/MaterialInstanceId, category, subject, description, impact flag, priority, status, assigned team/membership, last activity, resolution reason, resolved/closed timestamps, RowVersion |
| SupportMessages | TicketId, author principal, audience (RequesterVisible/CompanyInternal), text or audio, client operation ID, timestamp; unique retry key |
| SupportMessageAttachments | MessageId, AttachmentId; private same-company links; audience inherited from message |
| SupportEscalations | TicketId, shared summary, diagnostic snapshot, technical status, technical assignee, requested/accepted/answered timestamps, RowVersion |
| SupportEscalationAttachments | EscalationId, explicitly selected AttachmentId; record who shared it and when |
| SupportEscalationMessages | EscalationId, author principal, audience (CompanyAndTechnical/TechnicalInternal), text/media, client operation ID |
| SupportTicketEvents | Append-only status, priority, assignment, sharing and escalation changes with actor, time and reason |
| CompanySupportSettings | Office contacts, hours/timezone, languages, default queue and optional response targets |
| PlatformSupportSettings | Technical destination and public platform contact configuration; platform-scoped access |
| SupportAccessGrants | CompanyId, technical principal, approved scope/resources, allowed operations, expiry, approving administrator, reason and revocation |

Use company-safe composite keys/foreign keys as in the source brief. Platform technical identities must use a distinct validated principal relationship; do not fabricate a customer membership for a platform agent. Bind all technical content to an explicit company escalation. Check assigned-team membership and membership revocation on each operation.

Do not rely on an audience value supplied by a client: validate the author’s ability to create and read each message type. Prevent moving an internal message into the worker thread by changing a flag; sharing creates a new deliberate reply. Sanitize diagnostics with an allowlist; never collect passwords, cookies, tokens or full form contents automatically.

Ticket creation, first message, audit and notification outbox entries commit atomically. Repeated offline requests use idempotency keys and create one ticket. Server issues ticket numbers; local drafts use temporary UUIDs. Media uploads must finish before a request is represented as delivered. Failed media should remain recoverable without resubmitting duplicate messages.

Proposed routes:

```text
GET/POST /api/support/tickets
GET /api/support/tickets/{id}
POST /api/support/tickets/{id}/messages
POST /api/support/tickets/{id}/assign
POST /api/support/tickets/{id}/status
POST /api/support/tickets/{id}/escalations
GET/POST /api/support/escalations/{id}/messages
POST /api/support/escalations/{id}/status
GET/PUT /api/companies/current/support-settings
POST /api/support/access-grants
POST /api/support/access-grants/{id}/revoke
```

Define POST actions with expected row versions and explicit permissions. List endpoints use server pagination. Downloads reuse protected attachment endpoints with ticket/message audience checks. Live events include SupportTicketCreated, SupportMessageCreated, SupportAssignmentChanged and SupportEscalationChanged; subscribe by authorised audience, never a company-wide broadcast of private message bodies.

## Architecture and integration decisions

Retain the brief’s proposed React/TypeScript/Vite frontend, ASP.NET Core API, EF Core/SQL Server persistence, Identity cookies, private media storage, SignalR, IndexedDB drafts and Konva editor. Organise code by Auth, Companies, Templates, Jobs, Recce, Review, Support, Reports and Installation.

These are inherited stack choices, not a fresh package compatibility audit. Verify installed SDK/database prerequisites and current official package compatibility when implementation begins; record exact versions and lockfiles. Do not assume dependencies are installed in this empty workspace.

Use real persistence and authorisation for the pitch. Clearly label sample extraction and demo role switching. AI extraction, transcription, outbound messaging and hosted deployment remain optional configured integrations. Basic support must work without them.

## Delivery sequence and acceptance gates

| Stage | Deliverable | Gate |
|---|---|---|
| 1. Foundation | Responsive shell, login, memberships, company/material/team/job CRUD, database, configured support contacts | Restart preserves jobs; cross-company reads/files fail; mobile navigation fits |
| 2. Field recce + basic support | Guided form, location, board instances, photos/editor, local drafts, submit; contextual support request and own-ticket view | B01/B02 survive reload independently; queued work is labelled correctly; support draft survives interruption |
| 3. Office + support escalation | Review/corrections, chat/audio, exports, company support queue, assignments, internal notes, technical escalation, audit/live updates | Worker → office → technical → office → worker completes with correct visibility; old recce revision remains intact |
| 4. Template onboarding | Upload, manual/sample extraction, field editor, preview/publish, versioning | Missing units require confirmation; published updates do not alter existing jobs |
| 5. Installation | Assigned approved specifications, after evidence and separate approval | Installer cannot edit approved measurements; B01/B02 before/after pairs stay correct |
| 6. Demo readiness | Responsive/accessibility checks, real-device permissions, failure scenarios and clear demo script | Record tested, failed, simulated and deferred behaviours honestly |

Support starts in the core prototype, rather than being postponed until after installation. Avoid calendar estimates until the development environment and first working vertical slice are verified.

## Acceptance checklist

- A worker opens help from B02; the request links JOB-1042/B02 without discarding edits.
- Offline help requests remain queued and send once after authentication/reconnect, even after retry.
- Office replies are worker-visible; company notes and technical-only notes never appear in worker APIs, files, counts or notifications.
- Another company and an unrelated worker cannot read the ticket, escalation or attachment by guessing IDs.
- Technical staff see only shared escalation content; access grants expire/revoke correctly and never permit recce approval.
- A reply or resolution cannot mutate measurements, approve a board or close an installation.
- Stale assignment/status updates return a conflict without losing a reply.
- Missing support contacts produce an honest unconfigured state; no dead Call/Email buttons.
- Microphone denied, upload failed, storage full and network loss show recoverable choices.
- All required recce boards are reviewed before approval; exports select the intended revision.
- Mobile 360/390 px, tablet portrait/landscape, desktop, keyboard and long translated labels are usable.
- Unconfigured AI/transcription/contact integrations are labelled accurately.

Use meaningful API tests for authorisation, message audiences, idempotency, revision immutability and expired support access, plus browser tests for the recce correction path and support escalation path. Actual camera, microphone and GPS checks require trusted HTTPS and real devices. None of these checks have been executed yet.

## Demo story and handoff

Use fictional Demo Signage Co., Ravi and Meera. Ravi encounters a B02 upload problem, opens Need help? and sends a request. Meera claims it, shares a minimal technical escalation, receives a workaround and replies to Ravi. Ravi confirms the upload works and resolves the request. Separately, Meera requests a formal B02 height correction; Ravi changes 2.5 ft to 2 ft in a new revision and resubmits. Approval and the export use that corrected revision. This demonstrates support without confusing it with review authority.

Implementation handoff should include source, lockfiles, migrations, fictional seeds, sample form, configuration without secrets, local HTTPS/device setup, database/private-file backup and restore, permission matrix, support-routing setup and acceptance report. Do not publish or contact clients as part of this planning work.

Before a live pilot, supply actual office/platform contact details, hours, ticket ownership and retention policies. Until supplied, use clearly labelled configuration placeholders and fictional data.
