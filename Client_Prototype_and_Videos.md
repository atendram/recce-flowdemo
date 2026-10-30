# Standalone client demo and bilingual product videos

**Online client experience:** open https://recceflow-client-demo.distinctdigitalads1.chatgpt.site — no download or sign-in. Choose the field demo, office dashboard or [phone/tablet walkthroughs](https://recceflow-client-demo.distinctdigitalads1.chatgpt.site/field-videos.html). These four new English/Hindi device videos run about 1:46 each. See [hosting options and verification](Free_Hosting_Client_Demo.md).

30 October 2026. The standalone source is in `client-demo/`; the client delivery folder is **D:\project_2026\RecceFlow_Client_Prototype**. It is separate from the normal React/.NET/SQL application.

Open its **index.html** in current Edge or Chrome, or double-click **OPEN-DEMO.cmd** on Windows. The client does not install dependencies or enter any credentials. All runtime files are bundled; there is no database connection or API key. The full application's private artifacts and credential files are not part of the delivery.

Send **D:\project_2026\RecceFlow_Client_Prototype.zip** to the client. They extract it first, then open `index.html` or `videos.html`. English video: **1:52.26**; Hindi: **1:52.19**. Each is approximately 3.5 MB. The package includes a ready-to-send `Client_Message.txt`.

The prototype includes a dashboard with clickable metrics, a recce register, manual job creation, a material catalog, repeated material items, Site → Materials → Review, location permission with typed address fallback, site/support voice recording, photo capture/upload, seven icon-labelled marking tools, manual dimensions/rectangle area, multiple views per item, PNG/ZIP downloads, local submission/verification/correction/reassignment, support conversation/status simulation, and configurable report columns/headings/exports.

Excel/CSV import reads the first worksheet, previews new jobs and rejects duplicate IDs before confirmation. A template is included in `examples/`. Genuine XLSX and CSV report export do not embed photos; use the job image ZIP or Print/Save PDF for portable images. Measurements are entered manually; the app does not infer real dimensions from image pixels.

All changes remain in the local browser. Save/restore a JSON backup to move the complete demo dataset, including compressed photos/audio, between devices. Office/Recce view is a presentation switch; there is no production role security. Support and developer escalation are explicitly marked local simulations, with no external message delivery. GPS/camera/microphone depend on device/browser permissions. The new public HTTPS demo is published; no client message was sent.

## Product videos

Open **videos.html** in the delivery folder to watch separate English and Hindi narrated MP4s. Both target 90–120 seconds at 1920×1080, using verified prototype screenshots and gentle motion. This is an animated explainer, not a continuous recording of clicks. The generation script verifies duration, fully decodes video/audio and checks non-silent narration. Actual durations and file sizes are in `videos/manifest.json`. SRT/VTT and optional embedded MP4 subtitles are included; sentence timing is approximate.

Narration uses the fictional scripts only. No production data or credentials are sent for audio generation. The editing/research guide and scene scripts are in `presentation/`.

For a free re-edit, [Clipchamp's current free plan](https://clipchamp.com/en/pricing/) advertises 1080p watermark-free exports and AI voiceovers; its [official instructions](https://support.microsoft.com/en-us/clipchamp/how-to-use-the-text-to-speech-feature) support Hindi and English. [HeyGen's current free plan](https://www.heygen.com/pricing) lists a one-minute limit, so it does not meet the requested single 90–120 second export. See `presentation/Free_Video_Options.md` for Canva/Invideo limitations and a complete assembly prompt.

## Verification and reproduction

The browser checks use an isolated browser and **file://** URLs. Fourteen end-to-end checks passed: no login/network requirement, 320/390/768/1440px layouts, catalog persistence, job creation/metric filtering, visit notes, genuine canvas PNG export, independent repeated-material markings/area, submission/verification/image ZIP, reassignment, reports/print, Excel import and duplicate protection, support replies/status, backup validation and phone captures. Additional checks passed for normal DEFLATE-compressed Excel and CSV import. Python independently verified ZIP CRCs, XLSX XML/no formulas, PNG signatures and PDF format. No production SQL state is involved.

Further browser checks verified voice-only support with a simulated microphone, successful backup restore, rejection of unsafe record identifiers, and direct-file playback/seeking of both 1920×1080 MP4s with no browser exceptions. Full media decoding and non-silent audio were checked independently of browser playback.

These are the maintainer's commands from the main project; the client only opens the packaged files:

```powershell
node tools/client-demo/prepare.mjs
node tools/client-demo/verify.mjs
C:\Users\atend\AppData\Local\Programs\Python\Python310\python.exe tools/client-demo/verify-files.py
node tools/client-demo/verify-import.mjs
node tools/client-demo/render-frames.mjs
C:\Users\atend\AppData\Local\Programs\Python\Python310\python.exe tools/client-demo/narrate.py
C:\Users\atend\AppData\Local\Programs\Python\Python310\python.exe tools/client-demo/render-video.py
node tools/client-demo/verify-media.mjs
node tools/client-demo/finalize.mjs
C:\Users\atend\AppData\Local\Programs\Python\Python310\python.exe tools/client-demo/package.py
```

Browser tooling reuses the main project's Playwright installation and Edge. Video generation uses isolated Python packages in `.cache/client-demo-python` (`edge-tts`, `imageio-ffmpeg`); generation needs internet for speech, but playback does not. Build-time scripts are retained under `tools/client-demo/`, not required by the client. Physical-phone capture/recording, other browsers and native Excel acceptance remain manual checks.
