# Camera, voice, panorama and office discussion

For the latest approved forms, job filters, automatic location capture, message notifications and report export, see [Admin Forms and Reports Guide](Admin_Forms_Reports_Guide.md). Messages now lists existing conversations; start a new one from a job's Job discussion action.

Updated 26 October 2026. Open http://localhost:5173 and refresh with Ctrl+F5. The usual DEMO / ravi and DEMO / meera accounts still apply; use the local password file. Existing records were retained by the JobConversations migration.

## Take a photo with the device camera

Open a recce → Materials & photos → Add material → **Open device camera**. Allow camera access, frame the shop, tap **Take photo**, inspect the preview and choose **Use this photo**. Retake keeps the selected camera; Switch camera requests front/rear facing mode when supported. Closing the dialog or accepting a shot stops its camera stream.

**Upload before photo** remains a separate option. Take another photo and Add another marked photo appear on existing item cards. Original and marked images stay separate. Camera captures are saved as JPEGs with a maximum 2560 px width; normal uploads accept JPEG/PNG up to 10 MB.

Camera and microphone APIs work on localhost or trusted HTTPS. A phone opening a plain HTTP LAN address cannot use these APIs reliably; phone hosting needs trusted HTTPS. Device emulation is a screen-size check, not a physical camera test. If access is denied or unavailable, the UI explains how to use upload/typing instead.

## Mark several materials on one photo

Create B01, capture/upload its original and mark it. Add same material or Add different material to create B02. Explicitly reuse the existing original photo, then enter B02's own size and save its marking. **View all materials on this photo** opens their combined overlay and a separate size/area entry for each item. Selecting an entry opens that item's own editor.

Each differently sized region must be a distinct material instance. Several arrows, outlines or strokes within one item describe that same item; they do not create independently measured pieces. Quantity is for intentionally identical pieces. Editing B02 must not modify B01.

## Calculate size and area

Enter physical measurements from a tape or measuring device. In the editor, choose an area rule:

- Rectangle: width × height. ACP fascia and flex default to this for new items.
- Bounding-box estimate: explicitly labelled estimate for an irregular outline.
- No area calculation: appropriate when width × height is not a valid area rule.

Area labels show the entered square unit and square metres, plus a total when quantity is greater than one. Server-derived area is stored with the saved item; clients cannot supply an authoritative calculated area. Length-based LED and count-based letter items have their own measurement fields and no width × height area.

Changing measured dimensions, units, area rule or quantity invalidates affected marked previews. Save them again before submitting. Drawn pixel distances never become physical sizes automatically. Separate feet-and-inches entry and irregular polygon physical-area calculation remain outside this slice.

## Explore a 360° panorama

In Materials & photos, find Site overview → **Upload 360° panorama**. Use a genuine full equirectangular JPEG/PNG with approximately 2:1 width-to-height ratio, at least 512 × 256 px, at most 16,384 px wide, and no more than 10 MB.

This can come from an existing panorama workflow or 360° camera. An ordinary photo or a narrow phone panorama is not a full sphere. The application does not stitch a sequence of camera shots into a 360° panorama; stretching a normal photo would not create real 360° evidence.

Drag to look around, choose the material for the next marker, tap **Place material marker**, then tap its position in the view. This creates a separate B01/B02/etc. with the panorama as its source and opens its measured-size editor. Enter and confirm size, adjust the image marking as needed, then save. Return to the panorama to see the marker's material, dimensions and applicable area.

Repeat for additional materials on the same panorama. Saved markers and the legend open their individual items. Markers locate items in spherical coordinates; editable evidence and readable previews are saved against the original panorama image. This is spherical point tagging with item-level image marking, not an automatic geometry-measurement or spherical polygon-area tool.

The interactive viewer requires WebGL. If it cannot open, the original is retained and the UI offers a clear explanation; use the normal material photo editor instead. The panorama libraries load only when needed.

## Type or speak remarks

Every material card has a typed remark and a voice recorder. Review & send also provides typed site remarks and a site voice remark.

Tap **Record voice**, allow microphone access, then **Stop recording**. Listen to the preview and choose **Use voice note**, or discard and record again. Voice notes are limited to 90 seconds and 2 MB. The browser chooses a supported audio format; the server accepts validated WebM/Ogg/MP4/WAV audio. No transcription service is connected: spoken notes remain playable audio, not invented text.

Use Save draft or Continue after attaching a remark; final submission also saves before validating. Audio references are part of the submitted snapshot. Recording stops microphone tracks when stopped or the component is closed. Unsaved browser work is not an offline backup.

## Talk to the office about a job

Use **Messages** → select a job → **Job discussion**, or use the discussion action on a job card, inside the recce or in the marking editor. The editor's **Discuss with office** action keeps its unsaved markings mounted and links the material item. The office signs in as Meera and opens the same job discussion to reply.

Send typed text, a recorded voice note, a photo or a small PDF. Use up to three attachments per message; JPEG/PNG/PDF files are capped at 5 MB each and voice notes at 2 MB / 90 seconds. Add a file or recording first, then tap Send message. Uploaded attachments alone do not constitute a sent message.

Messages are saved before delivery is displayed, include sender/time, survive refresh and refresh every five seconds while the discussion is open. Earlier history can be loaded. Retries use stable operation IDs; changed retry payloads are rejected. Read receipts, push notifications, background delivery and automatic offline sending are not implemented.

Job, recce and conversation timestamps are emitted as UTC with an explicit timezone and displayed in your device timezone. Existing UTC database values were retained; the formatting fix prevents an extra timezone shift after refresh.

Job assignment/company permissions protect both conversation endpoints and file downloads. Office staff and assigned field workers can discuss the job after submission, but a message or file never changes its locked measurements or approval state. Technical-platform escalation and internal-only support notes remain later work; job discussion is the company office/field conversation.

## Interface and device checks

The interface uses a plain system font stack, regular heading weights, restrained spacing and touch-sized controls. Navigation includes Overview, Jobs, My recce, Messages and Support. Mobile sign-out is available in the top bar; office tables switch to cards when their available width is narrow. Active field work has its own layout.

Test each role at 320/390 px, tablet portrait/landscape and desktop. Browser checks use simulated camera/microphone devices and a visibly synthetic panorama/photo; they do not verify a real phone's hardware or genuine site attendance. See Implementation_Status.md for the actual automated verification results and remaining device checks.

## Run, upgrade and backups

Use the existing start-api.ps1 and start-web.ps1 scripts. On this machine the new migration has been applied. On another checkout, stop the API, install locked dependencies (stop Vite before npm ci), run tools/migrate.ps1, and restart both servers.

Back up SQL Server and artifacts/uploads together: messages, remark references, photo originals, audio and marked previews depend on both. No destructive cleanup of previous jobs or evidence was performed. C: remains full on this machine; project tools use D: caches/temp directories. Avoid publishing artifacts or the demo password.
