# Share RecceFlow as a web link

30 October 2026. This is the standalone client prototype, with fictional records and local browser storage. It does not connect to the full application's SQL database or sign-in system.

**Live client link:** https://recceflow-client-demo.distinctdigitalads1.chatgpt.site

**Phone/tablet videos:** https://recceflow-client-demo.distinctdigitalads1.chatgpt.site/field-videos.html

Published through Sites with public access, saved version 1. A fresh anonymous Edge session returned HTTP 200, entered the field demo without sign-in on a secure origin, and played all four device videos. Exact Site identity/version/deployment is recorded in `Client_Demo_Hosting_State.json`; reuse that identity for updates rather than creating another Site.

Mobile videos are 1080×1920 and tablet videos 1920×1080. English runs 1:46.23 and Hindi 1:46.27 in both formats. Each file is approximately 2.4 MB. Full media decoding, non-silent audio, browser playback and seeking passed. The hosted layout was checked at 320, 390, 768, 1024 and 1440 pixels; touch drawing and submission were exercised at 390×844 and 1024×768 with simulated GPS.

## Hosting choices checked

| Service | Suitability for this prototype | Current free-plan details |
| --- | --- | --- |
| **Cloudflare Pages** | Best independent free-hosting option for this static demo. Upload the prepared folder/ZIP; the client opens its HTTPS link. | [Official limits](https://developers.cloudflare.com/pages/platform/limits/) list 500 builds/month, 20,000 files and a 25 MiB limit per asset on Free. Our videos are below that per-file limit. Static Pages requires no SQL server. |
| **Netlify** | Simple drag-and-drop alternative for the prepared site folder. | [Official free plan](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/) lists $0 with 300 monthly credits and a hard limit. Hosting/deploy usage consumes allowance, so it is not unlimited. [Drag-and-drop instructions](https://docs.netlify.com/deploy/create-deploys/) explain uploading the built folder and obtaining a URL. |
| **Sites connected in this workspace** | Lets this assistant publish the prepared demo and return a client link. Public access is configured for anonymous viewing at the user's request. | Availability and hosting are tied to the connected workspace/service. No claim is made that this is a separate unlimited free Cloudflare/Netlify account. |

## Upload to your own free Cloudflare Pages account

1. Sign in to your Cloudflare dashboard and choose **Workers & Pages → Create application → Pages → Direct Upload / Upload assets**. UI wording may change; follow the [official Direct Upload guide](https://developers.cloudflare.com/pages/get-started/direct-upload/).
2. Choose a project name such as `recceflow-client-demo` if available.
3. Upload the prepared hosting ZIP (or its extracted contents), with **index.html at the top level**. No build command, framework or environment variables are required. Do not upload the main `recceflow` project, credential files or SQL backups.
4. Deploy and copy the returned `https://…pages.dev` link. Open it in a signed-out/private browser and test the field demo and report export before sending it to a client.
5. To update the demo, upload the revised prepared static output to the same project. Direct Upload projects cannot later switch directly to Git integration; create a separate Git-integrated project if needed.

The final hosted output is prepared under `.cache/sites/recceflow-client-demo/dist` and an independent upload ZIP is retained under `artifacts/client-demo-hosting`. The ordinary client ZIP has a containing directory and an app-first entry page; use the hosting ZIP for a landing-page-first website.

## Client experience

The public starting page offers **Try the field demo**, **Open office dashboard** and **Phone/tablet walkthroughs**. Clients only open the URL; they do not install or run anything. All sample jobs/materials, marking tools, support simulation and reports run in the browser.

Every browser has its own demo data. A job entered by one visitor does not appear on another visitor's device. Real shared submissions, protected multi-user access and support delivery require the full application's backend. Camera/GPS/microphone access still requires user permission and suitable device/browser support; an HTTPS link provides the secure origin those features need.

## Device walkthroughs

Four field videos complement the two existing office overviews: **Mobile English**, **Mobile Hindi** (1080×1920 portrait), **Tablet English** and **Tablet Hindi** (1920×1080 landscape). Each uses tested field screens, fictional records and simulated GPS, with narrated guidance and optional embedded captions. They are edited viewport captures, not a claim of physical-device recording or continuous live interaction.
