# Test materials, CSV forms and approval

Updated 28 October 2026. The app now supports a company material catalog, typed CSV imports, multiple-selection checkbox groups, nearby approval feedback and an anonymous session-status check.

## Load the changes

The local database was backed up and verified before adding the `CompanyMaterials` table. Existing recce JSON hashes and job/form counts were unchanged. The local migration has already been applied and the API restarted. For another checkout, source `tools/environment.ps1`, build the API and run it with `--migrate` before starting it normally. Preserve the current database; do not seed/reset it to obtain these features.

Save any work in the old browser tab, then use Ctrl+F5. Open http://localhost:5173. Sign into company `DEMO` as `meera` using the local password file. Use a separate browser profile/incognito context for `ravi`, since admin and worker tabs otherwise share the same login cookie.

## Add a material

1. Open **Materials** in the admin navigation.
2. Enter a name, for example **Acrylic lightbox**.
3. Choose **Width and height**, **Length** or **Count**. For width/height, choose no default area, rectangular area or a bounding-box estimate.
4. Click **Add material**. A confirmation and catalog entry appear.
5. On the worker's Materials step, use **Refresh materials** or reopen the survey. Select the new material and Add material. Capture/upload a photo, choose placement, mark it and confirm the required measurements.

The mode and name stay unchanged after creation to preserve historical meaning. Create another named material for a different measurement method. **Archive** removes a custom material from new selections; an existing item still keeps its definition and can be completed. Reactivate it for new use. The five built-in types remain available. Names must be unique within the company, including archived names; other companies have independent catalogs.

Each physical instance remains separate, including repeated materials. New custom materials use the same original-photo, marking, preview, confirmation and submission checks as built-in materials. The API determines the measurement keys; a client cannot change an area material into Count by editing JSON. Area comes from entered dimensions, not image pixels.

## Which CSV should I use?

Download **typed CSV template** from Forms, or open:

- `docs/examples/RecceFlow_Form_Template.csv`: a small example with all normal field behaviours.
- `docs/examples/Signage_Survey_v3_RecceFlow.csv`: a normalized version of your supplied v3 file.

Your original `D:\Download\signage_field_labels_v3.csv` has not been changed. It can also be imported directly now. Its `Default_Label`, `Field_Type`, `Field_ID`, `Section`, `Custom_Label` and `Description` columns are recognized. The converted version produces **44 answer fields with 15 checkbox groups**. Headings are not counted as answer fields, including four rows described as table column headers. Twenty-five conversion notes explain choices that need review.

The standard definition format is **UTF-8 CSV** with this header:

```csv
id,label,type,required,options,section,description
mounting,Mounting surface,choice,true,Concrete|Brick|Glass,Site details,Choose one surface.
equipment,Access equipment,multiselect,false,Step ladder|Scaffolding|Boom lift,Installation,Tick all needed equipment.
checked,Site details checked,checkbox,true,,Verification,Confirm this check.
```

| Column | Meaning |
| --- | --- |
| `id` | Stable unique field ID, up to 80 characters. Omit values to generate IDs. |
| `label` | Worker-facing question, up to 160 characters. |
| `type` | `text`, `textarea`, `number`, `date`, `checkbox`, `choice`, `multiselect`. |
| `required` | `true` or `false`; yes/no and 1/0 are also accepted. Blank means optional. |
| `options` | For choice/multiselect, separate values with `|`. Use 1–40 unique options, up to 160 characters each. |
| `section` | Optional group heading, up to 120 characters. |
| `description` | Optional help text, up to 1,000 characters. |

Use up to 80 answer fields and a file under 100 KB. Quoted cells support commas, escaped quotes and multiline text. A template import defines questions; it does not import completed survey answers or create shop jobs.

**Checkbox** means one confirmation box; when required it must be ticked. **Choice** means exactly one selected answer. **Multiselect** means several independent boxes; required means select at least one. For example, available/not available or 230 V/415 V should normally be **choice**, while multiple signage types or access equipment may be **multiselect**. Review the converted v3 questions before approval rather than assuming all printed boxes have the same meaning.

Printed `[ ]` groups in the v3 file become actual multiselect controls. Recognizable preceding header-label rows become the group's question, not another empty input. CSV header/title/section rows are not imported as answer fields. Imported `signature` rows become typed-name fields with a warning; a typed name is not a drawn or electronic signature. `sketch_box` becomes notes; use the existing material image-marking workflow for drawings. Write-in blanks inside an option need a separate text/number question. Dates use the browser date picker and are stored as YYYY-MM-DD.

For material dimensions, use the material's width/height, length or count controls. Avoid creating another unrelated Width/Height question unless you deliberately need a separate site-level measurement with an explicit unit.

## Import → test → approve → assign

1. Open Forms, import the CSV and check its conversion notes. Review labels, types, options, sections and Required flags. Importing an existing unsaved field list asks before replacing it.
2. Enter the form name and click **Save draft**. The saved version opens in Worker preview. Saved versions can be searched; the version list scrolls instead of pushing the preview below every old form.
3. Fill the preview. Tick multiple choices where appropriate and complete required answers. Click **Test completed form**.
4. Once the test passes, click **Approve form**. Progress says Approving form, then the same action area shows the green approval result and the next Jobs step. These controls/feedback stay together for a long form. An approved preview is read-only.
5. Open Jobs → Create job. Select that exact form under **Approved digital form**, assign a worker, then save the job. Approving a template does not automatically alter older jobs.
6. The assigned worker starts the job, allows location or records an exception, completes Site questions, adds/marks materials, reviews and submits.

Use **Copy** to change an approved definition for future jobs. Form approval publishes a template; office approval of a completed recce is a separate action in [the recce review workflow](Product_Admin_Review_Test_Guide.md). Multiselect answers are stored as validated JSON arrays inside the answer value and exported as readable `option A | option B` text.

## About the console messages

The old initial session lookup requested protected `/api/me` even when no one was signed in, producing expected 401 responses. Initial and foreground checks now use `/api/auth/session`, which returns HTTP 200 with an authenticated flag; `/api/me` remains protected. After an authenticated session expires or another tab switches accounts, the recovery dialog preserves open work in this tab and asks for the same account. Failed actions are not automatically replayed. A network/permission error is handled separately from expiry.

A 401 still correctly occurs for an invalid login or a protected request whose cookie is no longer valid. Never change protected endpoints to public merely to silence the console. A new favicon SVG is included. The original unspecified 404 cannot be assigned a cause from the status code alone; check its full Request URL in Network if it persists. The tested new routes and template downloads should return 200.

Requests now have a bounded wait: normal requests 30 seconds, photo/file requests 120 seconds. On timeout the message asks you to check saved state before retrying, since a server may have completed a write after the connection stalled. Subtle hover borders/shadows, keyboard focus outlines, progress indicators and reduced-motion support have been added.

## Verification

Tests cover the supplied CSV parser and full browser import, malformed/duplicate definitions, grouped selections, approval feedback, custom-material creation and marking/submission, server rule validation, catalog isolation, archiving/history, readable answer exports and the anonymous session check. Existing session recovery, assigned-form and recce validation checks are also run. Browser verification uses Edge with fictional jobs and simulated GPS; no paid extraction or geocoding provider is called.

For API research, prices and setup boundaries, see [Extraction and location API options](Extraction_Location_API_Options.md).
