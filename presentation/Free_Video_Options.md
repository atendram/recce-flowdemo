# Free English/Hindi product video options

Researched 30 October 2026 using vendor sources. Availability and quotas can change; check the export screen before committing to a workflow.

| Platform | Fit for these 90–120 second videos | Current free-plan limits to consider |
| --- | --- | --- |
| **Microsoft Clipchamp — recommended** | Import the supplied demo screenshots or MP4, arrange a timeline and create Hindi/English voiceovers. | Its [official pricing page](https://clipchamp.com/en/pricing/) says free accounts can export at up to 1080p without watermarks and include AI voiceovers. Use your own/free assets; premium assets can require payment. |
| **Canva** | Good for branded presentation-style video using supplied screenshots, text and voice. | [Canva's voice feature](https://www.canva.com/features/ai-voice-generator/) offers free voices/previews and paid options. Its [Hindi page](https://www.canva.com/hi_in/features/ai-voice-generator/) states up to 1,000 characters per conversion, so split the narration by scene. Free voice quota and any paid assets must be checked in your account. |
| **HeyGen** | Useful if you specifically want an avatar presenter. | The [current pricing page](https://www.heygen.com/pricing) lists three free videos per month, watermarked, up to **one minute each**. This does not fit a single 90–120 second free export. Some older/help pages mention different limits; use the account's current allowance. |
| **Invideo AI** | Can assemble a script-led video, but inspect the generation and export screen first. | Its [current free-plan help article](https://help.invideo.io/en/articles/9380226-can-i-use-invideo-ai-for-free) confirms limited weekly credits without a card; it does not guarantee this complete two-language export for free. Do not assume that older advertised minute/export allowances still apply. |

## Re-edit these videos in Clipchamp

1. Open [Clipchamp](https://clipchamp.com/) and create a 16:9 project using its personal/free editor.
2. Import the screenshots in `presentation/screenshots/`, or import the finished MP4 if you only want to trim/add branding.
3. Follow the nine scenes in `scenes.json` and `Narration_Scripts.md`. Add one screenshot per scene with a simple zoom/fade and readable heading. Keep the total between 90 and 120 seconds.
4. Under Record & create, open Text to speech. Pick English (India) for one version and Hindi for the other. Paste each scene's script and generate its audio. The [official voiceover instructions](https://support.microsoft.com/en-us/clipchamp/how-to-use-the-text-to-speech-feature) describe language, voice, pace, preview and save controls.
5. Adjust image durations to match the narration. Use only your own/free assets, preview spelling and pronunciation, then export 1080p. Duplicate the project for the other language.

## Prompt for a video editor or AI assembly tool

Create a 100–115 second, 16:9 RecceFlow product walkthrough using only the supplied screenshots and narration. Make two separate exports, one in English and one in Hindi. Use a calm, clear Indian voice, readable captions, gentle motion and a restrained forest-green/cream brand palette. Show the actual UI. Cover job creation/Excel import; site location and typed/voice notes; separate material items and manual dimensions; image shapes/colours/freehand; review/correction/reassignment; configurable Excel/CSV/print reports; and local simulated support status. End with “Request a personalised demo.” Do not invent automatic measurement, live support delivery, cloud synchronisation or production authentication for this portable prototype. Preserve the explicit local-demo limitations. Use `scenes.json` as the source of truth and do not substitute generic business stock footage for the product screens.

## Videos made with this package

The supplied videos use screenshot-based motion graphics, not generative footage or a live continuous screen recording. Narration was generated from the fictional scripts using the open-source [edge-tts client](https://github.com/rany2/edge-tts), which accesses Edge's online speech service. No paid generation API key was used. This is a generation-time online dependency; the finished MP4s play locally. Only the supplied product script was sent for narration, not production data or credentials. Optional subtitles use approximate sentence timing; review them before a final public campaign. Actual file durations and full-decode checks are recorded in `videos/manifest.json`.
