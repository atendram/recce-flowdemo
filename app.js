/* RecceFlow standalone client prototype. All records are fictional and local. */
(() => {
  "use strict";
  const { escape: h, save: download, workbook, csv, zip } = window.DemoFiles;
  const $ = (selector, root = document) => root.querySelector(selector);
  const key = "recceflow-client-demo-v1";
  const paths = {
    dashboard:
      '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    jobs: '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V3h8v4M3 12h18M10 12v3h4v-3"/>',
    materials:
      '<path d="m12 3 10 5-10 5L2 8Zm-10 9 10 5 10-5M2 16l10 5 10-5"/>',
    reports: '<path d="M4 21V10h4v11M10 21V3h4v18M16 21V7h4v14"/>',
    support:
      '<path d="M4 14v-3a8 8 0 0 1 16 0v3M4 12H2v7h4v-7Zm16 0h2v7h-4v-7ZM18 19c0 3-3 3-6 3"/>',
    plus: '<path d="M12 4v16M4 12h16"/>',
    arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
    download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
    upload: '<path d="M12 16V4m-5 5 5-5 5 5M4 16v5h16v-5"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="m7 12 3 3 7-7"/>',
    image:
      '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8" cy="8" r="2"/><path d="m3 17 5-5 4 4 4-7 5 8"/>',
    camera:
      '<path d="M3 7h4l2-4h6l2 4h4v14H3Z"/><circle cx="12" cy="13" r="4"/>',
    mic: '<rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3M8 22h8"/>',
    rectangle: '<rect x="3" y="5" width="18" height="14" rx="1"/>',
    ellipse: '<ellipse cx="12" cy="12" rx="10" ry="7"/>',
    polygon: '<path d="m12 2 10 8-4 12H6L2 10Z"/>',
    line: '<path d="M3 21 21 3"/>',
    draw: '<path d="M3 17c9-16 15-13 9-5s-1 13 9-4"/>',
    select: '<path d="m4 3 16 9-8 2-4 7Z"/>',
    undo: '<path d="m8 3-5 5 5 5M3 8h11a7 7 0 0 1 0 14"/>',
    edit: '<path d="m15 3 6 6-12 12H3v-6ZM12 6l6 6"/>',
    trash: '<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7"/>',
    file: '<path d="M14 2H4v20h16V8ZM14 2v6h6M8 12h8M8 16h8"/>',
  };
  const icon = (name) =>
    `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${paths[name] || paths.file}</svg>`;
  const uid = () =>
    crypto.randomUUID
      ? crypto.randomUUID()
      : Date.now().toString(36) + Math.random().toString(36).slice(2);
  const now = () => new Date().toISOString();
  const pretty = (value) =>
    value === "InProgress"
      ? "In progress"
      : value === "NeedsCorrection"
        ? "Needs correction"
        : value;
  const tag = (value) =>
    `<span class="status-tag status-${String(value).toLowerCase()}">${h(pretty(value))}</span>`;
  const button = (action, text, glyph = "", cls = "", extra = "") =>
    `<button type="button" class="${cls}" data-action="${action}" ${extra}>${glyph ? icon(glyph) : ""}${text}</button>`;
  const statuses = [
    "Assigned",
    "InProgress",
    "Submitted",
    "NeedsCorrection",
    "Verified",
  ];
  const modes = {
    area: "Width × height",
    length: "Length",
    count: "Count / pieces",
  };
  function item(material = "ACP fascia", mode = "area", code = "B01") {
    return {
      id: uid(),
      code,
      material,
      mode,
      width: 12,
      height: 3,
      length: 6,
      quantity: 1,
      unit: "ft",
      placement: "Front fascia",
      notes: "",
      views: [],
    };
  }
  const sampleView = (marked = true) => ({
    id: uid(),
    name: "Front view",
    source: window.DemoSamplePhoto,
    preview: "",
    marks: marked
      ? [
          {
            id: uid(),
            type: "rectangle",
            x: 110 / 1200,
            y: 208 / 800,
            w: 890 / 1200,
            height: 150 / 800,
            points: [],
            color: "#11b6a0",
          },
        ]
      : [],
  });
  function initialState() {
    const create = (
      number,
      shop,
      client,
      location,
      status,
      assignee,
      width,
    ) => {
      const first = item();
      first.width = width;
      first.views.push(sampleView(status !== "Assigned"));
      return {
        id: uid(),
        number,
        shop,
        client,
        address: location + ", Mumbai",
        assignee,
        due: new Date().toISOString().slice(0, 10),
        status,
        seen: status !== "Submitted",
        contact: "",
        notes: "",
        location: null,
        startedAt: status === "Assigned" ? null : now(),
        items: [first],
        history: [{ at: now(), text: "Fictional sample job created" }],
      };
    };
    return {
      schema: 1,
      catalog: [
        { name: "ACP fascia", mode: "area" },
        { name: "Acrylic lightbox", mode: "area" },
        { name: "Flex banner", mode: "area" },
        { name: "LED strip", mode: "length" },
        { name: "Vinyl lettering", mode: "area" },
        { name: "Standee", mode: "count" },
      ],
      jobs: [
        create(
          "RF-1001",
          "Shree Stores",
          "Greenleaf Retail",
          "Andheri West",
          "Assigned",
          "Ravi",
          12,
        ),
        create(
          "RF-1002",
          "Patel Electricals",
          "Brightside Group",
          "Borivali East",
          "InProgress",
          "Asha",
          10,
        ),
        create(
          "RF-1003",
          "City Mart",
          "Greenleaf Retail",
          "Powai",
          "Submitted",
          "Ravi",
          14,
        ),
        create(
          "RF-1004",
          "Metro Pharmacy",
          "Wellcare",
          "Bandra West",
          "Verified",
          "Asha",
          8,
        ),
      ],
      tickets: [
        {
          id: uid(),
          ref: "SUP-1001",
          subject: "Confirm fascia measurement",
          jobNumber: "RF-1002",
          raisedBy: "Asha",
          team: "Office",
          status: "Pending",
          description:
            "The old fascia has a curved edge. Please confirm the measurement method.",
          events: [
            {
              at: now(),
              actor: "Recce person",
              text: "Please confirm the measurement method before I complete this item.",
            },
          ],
        },
      ],
    };
  }
  let state;
  try {
    const saved = JSON.parse(localStorage.getItem(key) || "null");
    state = saved?.schema === 1 ? saved : initialState();
  } catch {
    state = initialState();
  }
  let page = "overview",
    perspective = new URLSearchParams(location.search).get("view") === "field" ? "field" : "office",
    statusFilter = "",
    search = "",
    reportStatus = "",
    reportJob = "",
    supportStatus = "",
    reportTab = "filters",
    period = "Week";
  let reportHeading = "Site recce report",
    reportNote = "",
    selectedColumns = [
      "number",
      "shop",
      "client",
      "assignee",
      "status",
      "material",
      "placement",
      "dimensions",
      "area",
      "notes",
    ];
  let activeJob = null,
    step = 0,
    editor = null,
    thread = null,
    imported = null;
  const modal = $("#modal"),
    main = $("#main");
  let unsaved = false,
    toastTimer;
  function toast(text, error = false) {
    const target = $("#toast");
    target.textContent = text;
    target.className = "show" + (error ? " error" : "");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (target.className = ""), 4500);
  }
  function persist() {
    try {
      localStorage.setItem(key, JSON.stringify(state));
      unsaved = false;
      return true;
    } catch {
      unsaved = true;
      toast(
        "Browser storage is full or unavailable. Save a demo backup before closing this page.",
        true,
      );
      return false;
    }
  }
  window.addEventListener("beforeunload", (e) => {
    if (unsaved) {
      e.preventDefault();
      e.returnValue = "";
    }
  });
  const panel = (title, desc, content, extra = "") =>
    `<section class="panel ${extra}"><div class="panel-heading"><div><h2>${title}</h2>${desc ? `<p>${desc}</p>` : ""}</div></div>${content}</section>`;
  const heading = (title, desc, actions = "") =>
    `<div class="page-heading"><div><span class="eyebrow">${perspective === "field" ? "Field workspace" : "Office workspace"}</span><h1>${title}</h1><p>${desc}</p></div><div class="row">${actions}</div></div>`;
  function navigation() {
    $("#navigation").innerHTML = [
      ["overview", "Overview", "dashboard"],
      ["jobs", perspective === "field" ? "My recce" : "Recce jobs", "jobs"],
      ["materials", "Materials", "materials"],
      ["reports", "Reports", "reports"],
      ["support", "Support", "support"],
    ]
      .map(
        ([id, title, glyph]) =>
          `<a class="nav-link ${page === id ? "active" : ""}" href="#${id}" ${page === id ? 'aria-current="page"' : ""}>${icon(glyph)}${title}${id === "support" ? `<span class="count-bubble">${state.tickets.filter((t) => t.status !== "Resolved").length}</span>` : ""}</a>`,
      )
      .join("");
    $("#breadcrumb").textContent =
      page === "jobs" ? "Recce jobs" : page[0].toUpperCase() + page.slice(1);
  }
  function render() {
    navigation();
    ({
      overview: renderOverview,
      jobs: renderJobs,
      materials: renderMaterials,
      reports: renderReports,
      support: renderSupport,
    })[page]();
  }
  function renderOverview() {
    const total = state.jobs.length,
      waiting = state.jobs.filter((j) =>
        ["Assigned", "NeedsCorrection"].includes(j.status),
      ).length,
      submitted = state.jobs.filter((j) => j.status === "Submitted").length,
      verified = state.jobs.filter((j) => j.status === "Verified").length;
    const metrics = [
      ["Total recce jobs", total, "All your site work", "jobs", ""],
      [
        "Ready for a visit",
        waiting,
        "Assigned or needs correction",
        "clock",
        "Assigned",
      ],
      [
        "Awaiting review",
        submitted,
        "New submissions from the field",
        "file",
        "Submitted",
      ],
      [
        "Verified recce",
        verified,
        "Checked and ready for handoff",
        "check",
        "Verified",
      ],
    ];
    const grouped = new Map();
    for (const job of state.jobs) {
      const date = new Date(job.due + "T12:00:00");
      const label =
        period === "Day"
          ? job.startedAt
            ? "Started"
            : "Scheduled"
          : period === "Month"
            ? date.toLocaleDateString("en", { month: "short" })
            : date.toLocaleDateString("en", { weekday: "short" });
      grouped.set(label, (grouped.get(label) || 0) + 1);
    }
    const groups = [...grouped.entries()],
      max = Math.max(1, ...groups.map((v) => v[1]));
    main.innerHTML =
      heading(
        perspective === "field"
          ? "A good day starts with a clear plan."
          : "Your fieldwork, in focus.",
        "Every site, material and measurement — together in one workspace.",
        button("new-job", "Create recce", "plus", "primary"),
      ) +
      `<div class="intro-banner"><div class="row"><div class="intro-icon">${icon("materials")}</div><div><h2>From the first visit to the final board.</h2><p>Try a recce, mark a material and turn the details into a report.</p></div></div>${button("open-first", "Try the field journey", "arrow")}</div>` +
      `<section class="metrics" aria-label="Job summary">${metrics.map(([title, value, note, glyph, filter]) => `<button class="metric" data-action="metric" data-value="${filter}"><span class="metric-top">${title}${icon(glyph)}</span><strong>${value}</strong><small>${note}</small></button>`).join("")}</section>` +
      `<div class="overview-grid"><section class="panel"><div class="panel-heading"><div><h2>Work at a glance</h2><p>Jobs grouped by scheduled date · ${total} records</p></div><div class="segmented" aria-label="Activity grouping">${["Day", "Week", "Month"].map((p) => button("period", p, "", p === period ? "active" : "", `data-value="${p}" aria-pressed="${p === period}"`)).join("")}</div></div><div class="chart-area" aria-label="Scheduled jobs chart">${groups.map(([label, count]) => `<div class="chart-bar" style="height:${Math.max(12, (count / max) * 100)}%"><b>${count}</b><span>${h(label)}</span></div>`).join("")}</div><div class="chart-legend"><span><i class="swatch"></i>Scheduled recce jobs</span><span>From the current demo records</span></div></section>` +
      panel(
        "Progress that is easy to read",
        "Click a summary card above to open its jobs.",
        statuses
          .map((s) => {
            const count = state.jobs.filter((j) => j.status === s).length;
            return `<div class="status-line"><span>${pretty(s)}</span><div class="status-track"><i style="width:${total ? (count / total) * 100 : 0}%"></i></div><strong>${count}</strong></div>`;
          })
          .join(""),
      ) +
      `</div>` +
      panel(
        "Recent site work",
        "Unseen submissions appear first in the recce register.",
        jobsTable(
          state.jobs
            .slice()
            .sort((a, b) => Number(a.seen) - Number(b.seen))
            .slice(0, 5),
        ),
      ) +
      `<div class="notice">This is a client demonstration. Import your own spreadsheet or use the sample jobs. Changes stay in this browser; use Save demo backup to move a complete copy, including photos, to another device.</div>`;
  }
  function jobsTable(jobs) {
    if (!jobs.length)
      return `<div class="empty">${icon("jobs")}<h3>No matching jobs</h3><p>Change the filters or create your first recce.</p></div>`;
    const actions = (j) =>
      button(
        "open-job",
        perspective === "field"
          ? j.status === "Assigned"
            ? "Start recce"
            : "Open recce"
          : "View recce",
        "arrow",
        "",
        `data-id="${j.id}"`,
      );
    return `<div class="table-wrap desktop-job-list"><table><thead><tr><th>Recce ID</th><th>Shop / site</th><th>Client</th><th>Recce person</th><th>Materials</th><th>Status</th><th>Action</th></tr></thead><tbody>${jobs.map((j) => `<tr class="${j.status === "Submitted" && !j.seen ? "unseen" : ""}"><td><strong>${h(j.number)}</strong><small>${!j.seen ? "● Unseen submission" : "Seen"}</small></td><td><div class="shop-cell"><img src="assets/storefront.svg" alt=""><span><strong>${h(j.shop)}</strong><small>${h(j.address)}</small></span></div></td><td>${h(j.client)}</td><td>${h(j.assignee)}</td><td>${j.items.length} items</td><td>${tag(j.status)}</td><td><div class="job-actions">${actions(j)}</div></td></tr>`).join("")}</tbody></table></div><div class="mobile-job-list">${jobs.map((j) => `<article class="mobile-job ${!j.seen ? "unseen" : ""}"><div class="row between"><small>${h(j.number)} · ${h(j.client)}</small>${tag(j.status)}</div><h3>${h(j.shop)}</h3><p>${h(j.address)}<br>${h(j.assignee)} · ${j.items.length} material items${!j.seen ? " · Unseen" : ""}</p><div class="row">${actions(j)}</div></article>`).join("")}</div>`;
  }
  function filteredJobs() {
    return state.jobs
      .filter(
        (j) =>
          (!statusFilter || j.status === statusFilter) &&
          `${j.number} ${j.shop} ${j.client} ${j.assignee} ${j.address}`
            .toLowerCase()
            .includes(search.toLowerCase()),
      )
      .sort((a, b) => Number(a.seen) - Number(b.seen));
  }
  function renderJobs() {
    const jobs = filteredJobs();
    main.innerHTML =
      heading(
        perspective === "field"
          ? "Your recce, step by step."
          : "Recce register",
        "Start a visit, review the evidence or hand work to another person.",
        button("import", "Import Excel / CSV", "upload") +
          button("new-job", "Create recce", "plus", "primary"),
      ) +
      `<section class="panel"><div class="toolbar"><label class="search">Search jobs<input id="job-search" placeholder="Shop, recce ID, client or person" value="${h(search)}"></label><label>Status<select id="job-filter"><option value="">All statuses</option>${statuses.map((s) => `<option value="${s}" ${statusFilter === s ? "selected" : ""}>${pretty(s)}</option>`).join("")}</select></label>${button("template", "Import template", "download")}</div><div id="job-results">${jobsTable(jobs)}</div><p class="pagination-note" id="job-count">${jobs.length} matching jobs · local demo records</p></section>`;
  }
  function renderMaterials() {
    main.innerHTML =
      heading(
        "A material for every detail.",
        "Keep the catalog simple. Each physical item gets its own photos, dimensions and marking.",
      ) +
      panel(
        "Add a material",
        "Choose the measurement type once. Use it on any recce job.",
        `<form id="material-form"><div class="form-grid"><label>Material name<input name="name" maxlength="80" required placeholder="e.g. Acrylic hanging sign"></label><label>Measurement type<select name="mode">${Object.entries(
          modes,
        )
          .map(([v, t]) => `<option value="${v}">${t}</option>`)
          .join(
            "",
          )}</select></label><label>What it measures<input value="Each board or physical item separately" disabled></label></div><div class="form-actions">${button("", "Add material", "plus", "primary", 'id="add-material-button"')}</div></form>`,
      ) +
      panel(
        "Material catalog",
        `${state.catalog.length} available materials · repeated materials keep independent measurements`,
        `<div class="materials-catalog">${state.catalog.map((m) => `<article class="catalog-item"><div class="catalog-icon">${icon(m.mode === "count" ? "materials" : m.mode === "length" ? "line" : "rectangle")}</div><h3>${h(m.name)}</h3><p>${modes[m.mode]}</p></article>`).join("")}</div>`,
      );
    $("#add-material-button").type = "submit";
  }
  function openModal(title, kicker, body) {
    $("#modal-title").textContent = title;
    $("#modal-kicker").textContent = kicker;
    $("#modal-body").innerHTML = body;
    if (!modal.open) modal.showModal();
    modal.scrollTop = 0;
  }
  function closeModal() {
    if (recording) {
      toast("Stop recording before closing this screen.", true);
      return;
    }
    if (editor?.dirty && !confirm("Discard the changes to this image marking?"))
      return;
    if (activeJob) persist();
    editor = null;
    activeJob = null;
    thread = null;
    modal.close();
    render();
  }
  function newJob() {
    openModal(
      "Create a recce job",
      "Plan the site visit",
      `<form id="job-form"><div class="form-grid two"><label>Shop / site name<input name="shop" required maxlength="100" placeholder="e.g. Shree Stores"></label><label>Client name<input name="client" required maxlength="100" placeholder="e.g. Greenleaf Retail"></label><label>Recce person<input name="assignee" required maxlength="80" value="Ravi" list="people"></label><datalist id="people"><option>Ravi</option><option>Asha</option><option>Vikram</option></datalist><label>Due date<input name="due" type="date" value="${new Date().toISOString().slice(0, 10)}" required></label><label class="span-all">Site address<textarea name="address" required maxlength="400" placeholder="Shop number, street, locality and city"></textarea></label><label>Site contact<input name="contact" maxlength="80" placeholder="Name / phone (optional)"></label><label>Work instructions<input name="instructions" maxlength="400" placeholder="What should the recce person check?"></label></div><div class="notice">No account is created. The recce-person name is a manual assignment for this demonstration.</div><div class="form-actions">${button("close", "Cancel")}<button class="primary" type="submit">${icon("plus")}Create job</button></div></form>`,
    );
  }
  function audit(j, text) {
    j.history.push({ at: now(), text });
  }
  function isLocked(j) {
    return ["Submitted", "Verified"].includes(j.status);
  }
  function openJob(id) {
    activeJob = state.jobs.find((j) => j.id === id);
    if (!activeJob) return;
    step = 0;
    if (perspective === "office") activeJob.seen = true;
    if (perspective === "field" && activeJob.status === "Assigned") {
      activeJob.status = "InProgress";
      activeJob.startedAt = now();
      audit(activeJob, "Site visit started in the client demo");
      persist();
      renderJob();
      captureLocation();
    } else renderJob();
  }
  function renderJob() {
    const j = activeJob;
    if (!j) return;
    const locked = isLocked(j),
      disable = locked ? "disabled" : "";
    const tabs = `<div class="steps" aria-label="Recce steps">${["Site details", "Materials & marking", "Review & submit"].map((t, n) => button("step", `${n + 1}. ${t}`, "", n === step ? "active" : "", `data-step="${n}" aria-pressed="${n === step}"`)).join("")}</div>`;
    let body = `${tabs}<div class="row between" style="margin-bottom:17px">${tag(j.status)}<span class="save-state">${unsaved ? "Save backup before closing" : "Changes saved on this device"}</span></div>`;
    if (locked)
      body += `<div class="notice">${j.status === "Verified" ? "This recce is verified." : "This recce is waiting for office review."} To edit, the office can request a correction.</div>`;
    if (step === 0)
      body += `<section class="panel"><h3 class="section-title">The place and the plan</h3><div class="form-grid two"><label>Shop / site name<input data-job-field="shop" value="${h(j.shop)}" ${disable} required maxlength="100"></label><label>Client<input data-job-field="client" value="${h(j.client)}" ${disable} maxlength="100"></label><label class="span-all">Site address<textarea data-job-field="address" ${disable} maxlength="400">${h(j.address)}</textarea></label><label>Recce person<input data-job-field="assignee" value="${h(j.assignee)}" disabled></label><label>Site contact<input data-job-field="contact" value="${h(j.contact)}" ${disable} maxlength="80"></label></div><div class="notice" id="location-status">${j.location ? `${icon("pin")} Location captured: ${j.location.latitude.toFixed(5)}, ${j.location.longitude.toFixed(5)} · accuracy ±${Math.round(j.location.accuracy)} m` : "Location is not captured. You can use the address above if device permission is unavailable."}</div>${!locked ? button("location", "Capture current location", "pin") : ""}${j.startedAt ? `<p class="hint" style="margin-top:12px">Visit started ${h(new Date(j.startedAt).toLocaleString())}. Device GPS is an estimate; it does not measure signage dimensions.</p>` : ""}<label style="margin-top:18px">Site notes<textarea data-job-field="notes" ${disable} maxlength="1500" placeholder="Access, mounting surface, power availability or other observations">${h(j.notes)}</textarea></label>${!locked ? voiceTools("site") : ""}${j.audio ? `<audio controls src="${safeAudio(j.audio)}" style="width:100%"></audio>` : ""}<div class="notice muted-panel">${h(j.instructions || "Check each physical material separately. Add a photo and enter the measurements you took on site.")}</div></section>`;
    if (step === 1)
      body += `<div class="panel-heading"><div><h2>One card for each physical item</h2><p>Two ACP boards? Add two items. Photos and measurements stay independent.</p></div>${!locked ? button("add-item", "Add material item", "plus", "primary") : ""}</div>${j.items.length ? j.items.map((i) => materialCard(i, locked)).join("") : `<div class="empty">${icon("materials")}<h3>Start with the first material</h3><p>Add a board, banner, light strip or any other physical item.</p></div>`}`;
    if (step === 2) {
      const totalArea = j.items.reduce((sum, i) => sum + area(i), 0);
      body += `<section class="panel"><div class="row between"><div><h2>${h(j.shop)}</h2><p class="muted">${h(j.address)}</p></div>${button("job-report", "Material report", "reports")}</div><div class="summary-metrics"><div><strong>${j.items.length}</strong><span>Material items</span></div><div><strong>${j.items.reduce((n, i) => n + i.views.filter((v) => v.marks.length).length, 0)}</strong><span>Marked views</span></div><div><strong>${totalArea.toFixed(2)} m²</strong><span>Measured rectangular area</span></div></div><div class="review-list">${j.items.map((i) => `<article><span class="material-code">${h(i.code)}</span><h3>${h(i.material)}</h3><p>${h(dimensions(i))} · ${h(i.placement || "Placement not entered")}</p>${i.views.length ? `<img class="review-image" src="${safeImage(i.views[0].preview || i.views[0].source)}" alt="${h(i.material)} ${i.views[0].preview ? "marked" : "source"} view">` : "<small>No photo added</small>"}<p>${i.views.some((v) => v.preview && v.marks.length) ? "✓ Marked image ready" : "Marking needs attention"}</p></article>`).join("")}</div><p style="margin-top:18px"><strong>Site notes:</strong> ${h(j.notes || "No notes added")}</p>${j.audio ? `<audio controls src="${safeAudio(j.audio)}"></audio>` : ""}<div class="row">${button("download-all", "Download all marked images", "download")}${button("raise-job-support", "Ask for support", "support")}</div></section><details class="panel"><summary>Visit & change history</summary><ol class="timeline">${j.history.map((e) => `<li><small>${h(new Date(e.at).toLocaleString())}</small><p>${h(e.text)}</p></li>`).join("")}</ol></details>`;
    }
    body += `<div class="step-footer"><div class="row">${step ? button("step", "Back", "", "", `data-step="${step - 1}"`) : button("close", "Close")}${perspective === "office" && !locked ? button("reassign", "Reassign job", "jobs") : ""}</div><small>${locked ? "Read-only submitted evidence" : "Measurements are entered manually, never estimated from pixels."}</small><div class="row">${perspective === "office" && locked ? button("correction", "Request correction") + (j.status === "Submitted" ? button("verify", "Verify recce", "check", "primary") : "") : ""}${step < 2 ? button("step", "Continue", "arrow", "primary", `data-step="${step + 1}"`) : !locked ? button("submit-recce", "Submit recce for review", "check", "primary") : ""}</div></div>`;
    openModal(`${j.number} · ${j.shop}`, "Site → materials → review", body);
  }
  function area(i) {
    const factor = i.unit === "ft" ? 0.3048 : i.unit === "cm" ? 0.01 : 1;
    return i.mode === "area"
      ? Number(i.width || 0) *
          Number(i.height || 0) *
          factor ** 2 *
          Number(i.quantity || 1)
      : 0;
  }
  function dimensions(i) {
    return i.mode === "area"
      ? `${i.width} × ${i.height} ${i.unit} · ${i.quantity} item(s)`
      : i.mode === "length"
        ? `${i.length} ${i.unit} · ${i.quantity} run(s)`
        : `${i.quantity} pieces`;
  }
  function safeImage(src) {
    return typeof src === "string" &&
      (/^data:image\/(jpeg|png|webp);base64,[a-z0-9+/=]+$/i.test(src) ||
        src === window.DemoSamplePhoto ||
        src === "assets/storefront.svg")
      ? src
      : window.DemoSamplePhoto;
  }
  function safeAudio(src) {
    return typeof src === "string" &&
      /^data:audio\/(webm|mp4|ogg|wav)(;codecs=[a-z0-9.-]+)?;base64,[a-z0-9+/=]+$/i.test(
        src,
      )
      ? src
      : "";
  }
  function materialCard(i, locked) {
    const disabled = locked ? "disabled" : "";
    const measure = (field, title, min = 0.001) =>
      `<label>${title}<input type="number" min="${min}" max="100000" step="any" data-item-id="${i.id}" data-item-field="${field}" value="${h(i[field])}" ${disabled}></label>`;
    return `<article class="material-card" data-card-id="${i.id}"><div class="material-card-heading"><div><span class="material-code">${h(i.code)}</span><h3>${h(i.material)}</h3><small>${modes[i.mode]}</small></div>${!locked ? button("remove-item", "Remove", "trash", "text-button danger", `data-id="${i.id}"`) : ""}</div><div class="form-grid">${i.mode === "area" ? measure("width", "Width") + measure("height", "Height") : i.mode === "length" ? measure("length", "Length") : ""}${measure("quantity", i.mode === "count" ? "Number of pieces" : "Quantity", 1)}${i.mode !== "count" ? `<label>Unit<select data-item-id="${i.id}" data-item-field="unit" ${disabled}>${["ft", "m", "cm"].map((u) => `<option ${u === i.unit ? "selected" : ""}>${u}</option>`).join("")}</select></label>` : ""}</div>${i.mode === "area" ? `<div class="material-total" id="area-${i.id}">Total rectangular area: ${area(i).toFixed(2)} m² · based on entered dimensions</div>` : ""}<label>Placement — choose or write your own<input list="placement-list" data-item-id="${i.id}" data-item-field="placement" maxlength="160" value="${h(i.placement)}" placeholder="e.g. Left pillar facing the road" ${disabled}></label><datalist id="placement-list"><option>Front fascia</option><option>Indoor wall</option><option>Side board</option><option>Glass entrance</option><option>Above shutter</option></datalist><label>Material remark<textarea data-item-id="${i.id}" data-item-field="notes" maxlength="800" rows="2" ${disabled}>${h(i.notes)}</textarea></label><div class="row">${!locked ? uploadLabel(i.id, "camera", "Capture photo", "camera") + uploadLabel(i.id, "upload", "Upload photo", "upload") + button("sample-photo", "Use sample", "image", "", `data-id="${i.id}"`) : ""}</div><div class="view-grid">${i.views.map((v) => `<button data-action="mark-photo" data-item="${i.id}" data-view="${v.id}"><img src="${safeImage(v.preview || v.source)}" alt="${h(i.material)} ${h(v.name)}"><strong>${h(v.name)}</strong><span>${v.marks.length ? (v.preview ? "Edit marking" : "Refresh marking") : "Mark image"} · ${v.marks.length} mark(s)</span></button>`).join("")}</div>${!i.views.length ? '<p class="photo-hint">Add a site photo, then select Mark image. You can add up to four independently marked views per item.</p>' : ""}</article>`;
  }
  function uploadLabel(id, kind, title, glyph) {
    return `<label class="upload-label">${icon(glyph)}${title}<input type="file" accept="image/jpeg,image/png,image/webp" ${kind === "camera" ? 'capture="environment"' : ""} data-photo-item="${id}"></label>`;
  }
  function voiceTools(target) {
    return `<div class="row note-actions">${button("record-voice", "Speak a note", "mic", "", `data-target="${target}"`)}<small>Records audio; it does not transcribe your speech. You can also type above.</small></div>`;
  }
  async function captureLocation() {
    if (!activeJob || isLocked(activeJob)) return;
    if (!navigator.geolocation) {
      toast("Location is unavailable. Enter the site address instead.", true);
      return;
    }
    const j = activeJob;
    toast("Waiting for device location. Please allow location access.");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        j.location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          at: now(),
        };
        audit(j, "Device location captured for this demo visit");
        persist();
        if (activeJob?.id === j.id && !editor) renderJob();
        toast("Device location saved. Check the address is correct.");
      },
      () =>
        toast(
          "Location permission is unavailable. Continue using the typed site address.",
          true,
        ),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
    );
  }
  function addItem() {
    const j = activeJob;
    if (!j || isLocked(j)) return;
    if (j.items.length >= 20) {
      toast("This demo supports 20 material items per job.", true);
      return;
    }
    const select = document.createElement("select");
    select.innerHTML = state.catalog
      .map(
        (m, n) =>
          `<option value="${n}">${h(m.name)} · ${modes[m.mode]}</option>`,
      )
      .join("");
    openModal(
      "Add a material item",
      j.number,
      `<div class="notice">Choose a material. Repeated materials create separate cards and independent photos.</div><label>Material<select id="new-item-material">${select.innerHTML}</select></label><div class="form-actions">${button("return-job", "Back")}${button("confirm-item", "Add item", "plus", "primary")}</div>`,
    );
  }
  async function readPhoto(file) {
    if (
      !file ||
      file.size > 10 * 1024 * 1024 ||
      !["image/jpeg", "image/png", "image/webp"].includes(file.type)
    )
      throw Error("Choose a JPEG, PNG or WebP photo under 10 MB.");
    const source = URL.createObjectURL(file);
    try {
      const image = await loadImage(source);
      const canvas = document.createElement("canvas"),
        ratio = Math.min(1, 1200 / Math.max(image.width, image.height));
      canvas.width = Math.round(image.width * ratio);
      canvas.height = Math.round(image.height * ratio);
      canvas
        .getContext("2d")
        .drawImage(image, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL("image/jpeg", 0.8);
    } finally {
      URL.revokeObjectURL(source);
    }
  }
  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(Error("Could not open this photo."));
      image.src = src;
    });
  }
  async function startMarking(itemId, viewId) {
    const i = activeJob?.items.find((v) => v.id === itemId),
      view = i?.views.find((v) => v.id === viewId);
    if (!i || !view) return;
    editor = {
      item: i,
      view,
      marks: structuredClone(view.marks),
      tool: "rectangle",
      color: "#11b6a0",
      dirty: false,
      draft: null,
      selected: null,
      polygon: [],
    };
    const locked = isLocked(activeJob);
    openModal(
      `${i.code} · ${i.material}`,
      "Image marking · manually measured dimensions",
      `<div class="editor-layout"><div><div class="canvas-wrap"><canvas id="mark-canvas" width="1200" height="800" aria-label="Image marking canvas"></canvas><div class="drawing-tools">${["select", "rectangle", "ellipse", "arrow", "line", "polygon", "draw"].map((t) => button("tool", t[0].toUpperCase() + t.slice(1), t, t === "rectangle" ? "active" : "", `data-tool="${t}" ${locked ? "disabled" : ""}`)).join("")}</div></div><p class="hint" style="margin-top:12px">Drag to draw. Polygon: tap at least three points, then Finish polygon. Select a mark to remove it. Dimensions are entered manually; pixels are not a scale.</p></div><aside class="editor-side"><h3>${h(i.material)}</h3><span class="material-code">${h(i.code)}</span><p>${h(dimensions(i))}</p>${i.mode === "area" ? `<div class="material-total">${area(i).toFixed(2)} m² total</div>` : ""}<label>Mark colour<input id="mark-color" type="color" value="#11b6a0" ${locked ? "disabled" : ""}></label><div class="row">${button("undo-mark", "Undo", "undo", "", locked ? "disabled" : "")}${button("finish-polygon", "Finish polygon", "polygon", "", locked ? "disabled" : "")}</div><div id="shape-list" class="shape-list"></div>${button("delete-mark", "Delete selected", "trash", "danger full", locked ? "disabled" : "")}<small style="margin-top:12px">Marks belong only to this material item and this view.</small></aside></div><div class="form-actions">${button("return-job", "Back to materials")}${button("download-mark", "Download PNG", "download")}${!locked ? button("save-mark", "Save marked image", "check", "primary") : ""}</div>`,
    );
    try {
      editor.image = await loadImage(safeImage(view.source));
      const canvas = $("#mark-canvas");
      canvas.height = Math.round(
        (canvas.width * editor.image.height) / editor.image.width,
      );
      setupCanvas(canvas);
      redraw();
    } catch (e) {
      toast(e.message, true);
    }
  }
  function paint(canvas, image, marks, i, selection = null, draft = null) {
    const ctx = canvas.getContext("2d"),
      W = canvas.width,
      H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(image, 0, 0, W, H);
    for (const m of [...marks, ...(draft ? [draft] : [])]) {
      const x = m.x * W,
        y = m.y * H,
        w = m.w * W,
        height = m.height * H;
      ctx.beginPath();
      ctx.strokeStyle = m.color;
      ctx.fillStyle = m.color;
      ctx.lineWidth = Math.max(3, W / 300);
      ctx.lineJoin = "round";
      if (m.type === "rectangle") ctx.rect(x, y, w, height);
      else if (m.type === "ellipse")
        ctx.ellipse(
          x + w / 2,
          y + height / 2,
          Math.abs(w / 2),
          Math.abs(height / 2),
          0,
          0,
          Math.PI * 2,
        );
      else if (m.type === "arrow" || m.type === "line") {
        ctx.moveTo(x, y);
        ctx.lineTo(x + w, y + height);
        if (m.type === "arrow") {
          const a = Math.atan2(height, w),
            n = W / 60;
          ctx.moveTo(
            x + w - n * Math.cos(a - 0.5),
            y + height - n * Math.sin(a - 0.5),
          );
          ctx.lineTo(x + w, y + height);
          ctx.lineTo(
            x + w - n * Math.cos(a + 0.5),
            y + height - n * Math.sin(a + 0.5),
          );
        }
      } else {
        m.points.forEach((p, n) =>
          n ? ctx.lineTo(p.x * W, p.y * H) : ctx.moveTo(p.x * W, p.y * H),
        );
        if (m.type === "polygon") ctx.closePath();
      }
      ctx.stroke();
      if (
        m.type === "rectangle" ||
        m.type === "ellipse" ||
        m.type === "polygon"
      ) {
        ctx.globalAlpha = 0.08;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      if (m.id === selection) {
        ctx.save();
        ctx.setLineDash([8, 5]);
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.strokeRect(
          Math.min(x, x + w) - 4,
          Math.min(y, y + height) - 4,
          Math.abs(w) + 8,
          Math.abs(height) + 8,
        );
        ctx.restore();
      }
      const text = `${i.code} · ${i.material} · ${i.mode === "area" ? `${i.width} × ${i.height} ${i.unit}` : i.mode === "length" ? `${i.length} ${i.unit}` : `${i.quantity} pcs`}`;
      ctx.font = `600 ${Math.max(17, W / 65)}px Arial`;
      const tx = Math.max(
          5,
          Math.min(W - ctx.measureText(text).width - 24, Math.min(x, x + w)),
        ),
        ty = Math.max(33, Math.min(H - 8, Math.min(y, y + height) - 8));
      ctx.fillStyle = "#123f37";
      ctx.fillRect(
        tx,
        ty - 27,
        Math.min(W - tx, ctx.measureText(text).width + 20),
        32,
      );
      ctx.fillStyle = "white";
      ctx.fillText(text, tx + 10, ty - 5);
    }
  }
  function redraw() {
    if (!editor?.image) return;
    const canvas = $("#mark-canvas");
    paint(
      canvas,
      editor.image,
      editor.marks,
      editor.item,
      editor.selected,
      editor.draft,
    );
    $("#shape-list").innerHTML =
      editor.marks
        .map((m, n) =>
          button(
            "select-mark",
            `${n + 1}. ${h(m.type)} ${m.id === editor.selected ? "✓" : ""}`,
            m.type,
            "",
            `data-id="${m.id}"`,
          ),
        )
        .join("") ||
      "<small>No marks yet. Choose a shape and draw on the image.</small>";
  }
  function setupCanvas(canvas) {
    let origin = null;
    const point = (e) => {
      const r = canvas.getBoundingClientRect();
      return {
        x: Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)),
        y: Math.max(0, Math.min(1, (e.clientY - r.top) / r.height)),
      };
    };
    canvas.addEventListener("pointerdown", (e) => {
      if (!editor || isLocked(activeJob)) return;
      e.preventDefault();
      canvas.setPointerCapture(e.pointerId);
      const p = point(e);
      if (editor.tool === "select") {
        const hit = [...editor.marks]
          .reverse()
          .find(
            (m) =>
              p.x >= Math.min(m.x, m.x + m.w) - 0.02 &&
              p.x <= Math.max(m.x, m.x + m.w) + 0.02 &&
              p.y >= Math.min(m.y, m.y + m.height) - 0.02 &&
              p.y <= Math.max(m.y, m.y + m.height) + 0.02,
          );
        editor.selected = hit?.id || null;
        redraw();
        return;
      }
      if (editor.tool === "polygon") {
        editor.polygon.push(p);
        editor.draft = polygonMark(editor.polygon);
        redraw();
        return;
      }
      origin = p;
      editor.draft = {
        id: uid(),
        type: editor.tool,
        x: p.x,
        y: p.y,
        w: 0,
        height: 0,
        points: [p],
        color: editor.color,
      };
      redraw();
    });
    canvas.addEventListener("pointermove", (e) => {
      if (!origin || !editor?.draft) return;
      const p = point(e),
        m = editor.draft;
      m.w = p.x - origin.x;
      m.height = p.y - origin.y;
      if (m.type === "draw") m.points.push(p);
      redraw();
    });
    canvas.addEventListener("pointerup", () => {
      if (!origin || !editor?.draft) return;
      const m = editor.draft;
      if (m.type === "draw" && m.points.length > 1) bounds(m);
      if (Math.abs(m.w) > 0.004 || Math.abs(m.height) > 0.004) {
        editor.marks.push(m);
        editor.dirty = true;
      }
      editor.draft = null;
      origin = null;
      redraw();
    });
    canvas.addEventListener("pointercancel", () => {
      origin = null;
      if (editor && editor.tool !== "polygon") editor.draft = null;
      redraw();
    });
  }
  function bounds(m) {
    const xs = m.points.map((p) => p.x),
      ys = m.points.map((p) => p.y);
    m.x = Math.min(...xs);
    m.y = Math.min(...ys);
    m.w = Math.max(...xs) - m.x;
    m.height = Math.max(...ys) - m.y;
    return m;
  }
  function polygonMark(points) {
    return bounds({
      id: uid(),
      type: "polygon",
      x: 0,
      y: 0,
      w: 0,
      height: 0,
      points: [...points],
      color: editor.color,
    });
  }
  async function markedData(i, v) {
    const canvas = document.createElement("canvas"),
      image = await loadImage(safeImage(v.source));
    canvas.width = 1200;
    canvas.height = Math.round((1200 * image.height) / image.width);
    paint(canvas, image, v.marks, i);
    return canvas;
  }
  async function saveMark() {
    if (!editor || isLocked(activeJob)) return;
    if (editor.draft) {
      toast("Finish the current polygon or choose Undo before saving.", true);
      return;
    }
    editor.view.marks = structuredClone(editor.marks);
    const canvas = await markedData(editor.item, editor.view);
    editor.view.preview = canvas.toDataURL("image/jpeg", 0.8);
    editor.dirty = false;
    if (persist()) toast("Marked image saved for this material item.");
    editor = null;
    renderJob();
  }
  function reportRows() {
    return state.jobs
      .filter(
        (j) =>
          (!reportStatus || j.status === reportStatus) &&
          (!reportJob || j.id === reportJob),
      )
      .flatMap((j) =>
        (j.items.length ? j.items : [null]).map((i) => ({
          number: j.number,
          shop: j.shop,
          client: j.client,
          assignee: j.assignee,
          status: pretty(j.status),
          address: j.address,
          material: i?.material || "",
          placement: i?.placement || "",
          dimensions: i ? dimensions(i) : "",
          area: i?.mode === "area" ? area(i).toFixed(2) + " m²" : "",
          notes: [j.notes, i?.notes].filter(Boolean).join(" · "),
          before: i?.views[0]?.source || "",
          marked:
            i?.views.find((v) => v.preview && v.marks.length)?.preview || "",
        })),
      );
  }
  const columns = {
    number: "Recce ID",
    shop: "Shop / site",
    client: "Client",
    assignee: "Recce person",
    status: "Status",
    address: "Site address",
    material: "Material",
    placement: "Placement",
    dimensions: "Dimensions",
    area: "Total area",
    notes: "Remarks",
    before: "Before image",
    marked: "Marked image",
  };
  function reportTable(rows) {
    return `<div class="table-wrap report-preview"><table><thead><tr>${selectedColumns.map((c) => `<th>${columns[c]}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr>${selectedColumns.map((c) => `<td>${["before", "marked"].includes(c) && r[c] ? `<img src="${safeImage(r[c])}" alt="${columns[c]}">` : h(r[c] || "—")}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  }
  function renderReports() {
    const rows = reportRows();
    let content;
    if (reportTab === "filters")
      content = `<div class="form-grid two"><label>Job status<select id="report-status"><option value="">All statuses</option>${statuses.map((s) => `<option value="${s}" ${s === reportStatus ? "selected" : ""}>${pretty(s)}</option>`).join("")}</select></label><label>Recce job<select id="report-job"><option value="">All jobs</option>${state.jobs.map((j) => `<option value="${j.id}" ${j.id === reportJob ? "selected" : ""}>${h(j.number)} · ${h(j.shop)}</option>`).join("")}</select></label><label>Report heading<input id="report-heading" maxlength="120" value="${h(reportHeading)}"></label><label>Subtitle / note<input id="report-note" maxlength="200" value="${h(reportNote)}" placeholder="e.g. Prepared for Greenleaf Retail"></label></div><div class="notice">${rows.length} material rows match. Choose your columns and their order, then preview or export.</div><div class="form-actions">${button("report-tab", "Choose columns", "arrow", "primary", 'data-tab="columns"')}</div>`;
    else if (reportTab === "columns")
      content = `<h3 class="section-title">Include the details your client needs</h3><div class="report-columns">${Object.entries(
        columns,
      )
        .map(
          ([k, title]) =>
            `<label class="checkbox"><input type="checkbox" data-report-column="${k}" ${selectedColumns.includes(k) ? "checked" : ""}>${title}</label>`,
        )
        .join(
          "",
        )}</div><h3 style="margin-top:22px">Column order</h3><div class="stack">${selectedColumns.map((c, n) => `<div class="row between"><span>${n + 1}. ${columns[c]}</span><span class="row">${button("column-up", "↑", "", "", `data-column="${c}" aria-label="Move ${columns[c]} up" ${n === 0 ? "disabled" : ""}`)}${button("column-down", "↓", "", "", `data-column="${c}" aria-label="Move ${columns[c]} down" ${n === selectedColumns.length - 1 ? "disabled" : ""}`)}</span></div>`).join("")}</div><div class="form-actions">${button("report-tab", "Preview report", "arrow", "primary", 'data-tab="preview"')}</div>`;
    else
      content = `<div class="report-heading"><span class="print-brand">RecceFlow</span><h2 style="margin-top:16px">${h(reportHeading || "Site recce report")}</h2><p>${h(reportNote)}</p><small>${rows.length} material rows · client prototype · ${h(new Date().toLocaleDateString())}</small></div>${reportTable(rows)}<div class="form-actions no-print">${button("export-csv", "CSV", "download")}${button("export-xlsx", "Excel .xlsx", "download")}${button("print-report", "Print / Save PDF", "reports", "primary")}</div><p class="hint no-print" style="margin-top:14px">Excel/CSV photo columns explain how to obtain the files; image bytes are not embedded. Marked images download separately from the job. Print / Save PDF includes visible photos. Measurements are manually entered.</p>`;
    main.innerHTML =
      heading(
        "Reports, ready for the next step.",
        "Filter, choose the details, then share a clear material report.",
      ) +
      `<section class="panel"><div class="tabs" aria-label="Report sections">${[
        ["filters", "1. Filters & heading"],
        ["columns", "2. Columns & order"],
        ["preview", "3. Report & export"],
      ]
        .map(([id, title]) =>
          button(
            "report-tab",
            title,
            "",
            reportTab === id ? "active" : "",
            `data-tab="${id}" aria-pressed="${reportTab === id}"`,
          ),
        )
        .join("")}</div>${content}</section>`;
  }
  function exportReport(kind) {
    if (!selectedColumns.length) {
      toast("Choose at least one report column.", true);
      return;
    }
    const rows = reportRows().map((r) =>
      selectedColumns.map((c) =>
        ["before", "marked"].includes(c)
          ? r[c]
            ? c === "before"
              ? "Source photo included in the complete JSON demo backup"
              : "Marked image available in the job's marked-images ZIP"
            : ""
          : r[c],
      ),
    );
    const names = selectedColumns.map((c) => columns[c]);
    download(
      kind === "xlsx"
        ? workbook(names, rows, reportHeading, reportNote)
        : new Blob(
            [
              csv([
                ...(reportHeading ? [[reportHeading]] : []),
                ...(reportNote ? [[reportNote]] : []),
                names,
                ...rows,
              ]),
            ],
            { type: "text/csv;charset=utf-8" },
          ),
      `RecceFlow-report.${kind}`,
    );
    toast("Report downloaded. Images can be downloaded from each job.");
  }
  function renderSupport() {
    const tickets = state.tickets.filter(
      (t) => !supportStatus || t.status === supportStatus,
    );
    main.innerHTML =
      heading(
        "A little help, right when it matters.",
        "Raise a question, track the reply and keep the visit moving.",
        button("new-support", "Ask for support", "plus", "primary"),
      ) +
      `<div class="notice warning">Local simulation: these requests and replies stay in this demo browser. Nothing is sent to your office, developer or WhatsApp.</div><section class="panel"><div class="panel-heading"><div><h2>Support requests</h2><p>Try Office or Developer in a request to demonstrate the handoff.</p></div></div><div class="support-filter">${["", "Pending", "Processing", "Resolved"].map((s) => button("support-filter", s || "All requests", "", s === supportStatus ? "active" : "", `data-value="${s}"`)).join("")}</div>${tickets.map((t) => `<article class="support-card ${t.status.toLowerCase()}"><div><small>${h(t.ref)} · ${h(t.jobNumber || "General support")} · ${h(t.raisedBy)}</small><h3 style="margin-top:8px">${h(t.subject)}</h3><p>${h(t.description)} · With ${h(t.team)}</p></div><div class="row">${tag(t.status)}${button("open-support", "View / track", "support", "", `data-id="${t.id}"`)}</div></article>`).join("") || '<div class="empty">No requests match this status.</div>'}</section>`;
  }
  function newSupport(jobNumber = "") {
    thread = null;
    openModal(
      "How can we help?",
      "Local support demonstration",
      `<form id="support-form"><div class="notice warning">Demo only. A saved issue will appear locally; it is not delivered to a real team.</div><div class="form-grid two"><label>Related job<select name="jobNumber"><option value="">General question</option>${state.jobs.map((j) => `<option value="${h(j.number)}" ${j.number === jobNumber ? "selected" : ""}>${h(j.number)} · ${h(j.shop)}</option>`).join("")}</select></label><label>Send to<select name="team"><option>Office</option><option ${perspective === "office" ? "selected" : ""}>Developer</option></select></label><label class="span-all">Short subject<input name="subject" maxlength="100" required placeholder="What do you need help with?"></label><label class="span-all">Describe the issue<textarea name="description" maxlength="1500" placeholder="Type the issue, record a voice note, or use both"></textarea></label></div>${voiceTools("support")}<div id="support-audio"></div><div class="form-actions">${button("close", "Cancel")}<button type="submit" class="primary">${icon("support")}Save demo request</button></div></form>`,
    );
    supportAudio = "";
  }
  function openSupport(id) {
    thread = state.tickets.find((t) => t.id === id);
    if (!thread) return;
    openModal(
      thread.subject,
      `${thread.ref} · local simulation`,
      `${tag(thread.status)}<p class="muted" style="margin-top:14px">${h(thread.description)}</p>${thread.audio ? `<audio controls src="${safeAudio(thread.audio)}" style="width:100%"></audio>` : ""}<ol class="timeline">${thread.events.map((e) => `<li><small>${h(e.actor)} · ${h(new Date(e.at).toLocaleString())}</small><p>${h(e.text)}</p></li>`).join("")}</ol><form id="support-update" class="support-compose"><div class="form-grid two"><label>Reply as<select name="actor"><option>Recce person</option><option>Office</option><option>Developer</option></select></label><label>Issue status<select name="status">${["Pending", "Processing", "Resolved"].map((s) => `<option ${s === thread.status ? "selected" : ""}>${s}</option>`).join("")}</select></label><label class="span-all">Reply / resolution note<textarea name="text" required maxlength="1500" placeholder="Explain progress or how the issue was resolved"></textarea></label></div><div class="form-actions">${thread.team === "Office" ? button("escalate-demo", "Escalate to developer", "support") : ""}<button type="submit" class="primary">Save demo update</button></div></form>`,
    );
  }
  let recording = null,
    supportAudio = "";
  async function recordVoice(target, btn) {
    if (recording) {
      recording.recorder.stop();
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      toast(
        "Microphone recording needs a current browser and localhost/HTTPS. You can type the note instead.",
        true,
      );
      return;
    }
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const chunks = [],
        recorder = new MediaRecorder(stream),
        job = activeJob;
      recording = { recorder, stream };
      btn.textContent = "Stop recording";
      recorder.ondataavailable = (e) => chunks.push(e.data);
      const stopTimer = setTimeout(() => {
        if (recorder.state === "recording") recorder.stop();
      }, 45000);
      recorder.onstop = async () => {
        clearTimeout(stopTimer);
        stream.getTracks().forEach((t) => t.stop());
        recording = null;
        const blob = new Blob(chunks, { type: recorder.mimeType });
        if (blob.size > 1000000) {
          toast("This recording is too large. Try a shorter note.", true);
          btn.textContent = "Speak a note";
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          if (target === "site" && job) {
            job.audio = reader.result;
            persist();
            renderJob();
          } else {
            supportAudio = reader.result;
            const subject = $('#support-form [name="subject"]');
            if (subject) subject.required = false;
            if ($("#support-audio"))
              $("#support-audio").innerHTML =
                `<audio controls src="${safeAudio(supportAudio)}" style="width:100%"></audio>`;
            btn.textContent = "Record again";
          }
          toast("Voice note recorded. Listen before submitting.");
        };
        reader.readAsDataURL(blob);
      };
      recorder.start();
      toast("Recording… press Stop when you finish (maximum 45 seconds).");
    } catch {
      stream?.getTracks().forEach((t) => t.stop());
      recording = null;
      toast(
        "Microphone permission is unavailable. You can type your note instead.",
        true,
      );
    }
  }
  async function importFile(file) {
    if (!file || file.size > 5 * 1024 * 1024)
      throw Error("Choose an Excel/CSV file under 5 MB.");
    toast("Reading spreadsheet on this device…");
    const rows = /\.xlsx$/i.test(file.name)
      ? await window.DemoFiles.readXlsx(file)
      : window.DemoFiles.parseCSV(await file.text());
    if (rows.length < 2 || rows.length > 201)
      throw Error("Use the import template with 1–200 jobs and a header row.");
    const fields = rows[0].map((c) =>
      c.trim().toLowerCase().replace(/[ -]+/g, "_"),
    );
    if (new Set(fields).size !== fields.length)
      throw Error("The import has duplicate column headings.");
    for (const field of ["shop_name", "client_name", "site_address"])
      if (!fields.includes(field))
        throw Error(`Missing column: ${field}. Download the import template.`);
    const exists = new Set(state.jobs.map((j) => j.number)),
      importedIds = new Set();
    imported = rows.slice(1).map((row, n) => {
      const get = (name) =>
        String(row[fields.indexOf(name)] || "")
          .trim()
          .slice(0, 400);
      const number =
        get("recce_id") || `RF-IMP-${Date.now().toString().slice(-5)}-${n + 1}`;
      if (exists.has(number) || importedIds.has(number))
        throw Error(
          `Recce ID ${number} already exists. Use a new unique ID; existing jobs are not overwritten.`,
        );
      importedIds.add(number);
      const shop = get("shop_name"),
        client = get("client_name"),
        address = get("site_address");
      if (!shop || !client || !address)
        throw Error(
          `Row ${n + 2}: shop_name, client_name and site_address are required.`,
        );
      return {
        id: uid(),
        number,
        shop,
        client,
        address,
        assignee: get("recce_person") || "Unassigned",
        due: /^\d{4}-\d{2}-\d{2}$/.test(get("due_date"))
          ? get("due_date")
          : new Date().toISOString().slice(0, 10),
        contact: get("contact"),
        instructions: get("instructions"),
        status: "Assigned",
        seen: true,
        notes: "",
        location: null,
        startedAt: null,
        items: [],
        history: [{ at: now(), text: "Created from local spreadsheet import" }],
      };
    });
    openModal(
      "Review spreadsheet import",
      "Nothing is saved until you confirm",
      `<div class="notice">${imported.length} new jobs. All start as Assigned; photos and materials are added during the site visit. Only the first worksheet is read. Dates should use YYYY-MM-DD text.</div><div class="import-preview"><table><thead><tr><th>ID</th><th>Shop</th><th>Client</th><th>Recce person</th></tr></thead><tbody>${imported.map((j) => `<tr><td>${h(j.number)}</td><td>${h(j.shop)}</td><td>${h(j.client)}</td><td>${h(j.assignee)}</td></tr>`).join("")}</tbody></table></div><div class="form-actions">${button("close", "Cancel")}${button("confirm-import", `Import ${imported.length} jobs`, "upload", "primary")}</div>`,
    );
  }
  const importHeaders = [
    "recce_id",
    "shop_name",
    "client_name",
    "site_address",
    "recce_person",
    "due_date",
    "contact",
    "instructions",
  ];
  function exportTemplate() {
    download(
      workbook(importHeaders, [
        [
          "RF-2001",
          "Example Shop",
          "Example Client",
          "Andheri West, Mumbai",
          "Ravi",
          new Date().toISOString().slice(0, 10),
          "",
          "Measure front fascia and side board",
        ],
      ]),
      "RecceFlow-job-import-template.xlsx",
    );
  }
  function demoHelp() {
    openModal(
      "Welcome to the RecceFlow demo",
      "No login. No installation. Just try the flow.",
      `<div class="stack"><div class="notice">This is a local, single-device prototype. No credentials, customer records or database connections are included.</div><div><h3>1. Plan the work</h3><p>Create a recce job or import the Excel/CSV template. Switch between Office view and Recce view at the top.</p><h3>2. Visit and record</h3><p>Open a job. Capture device location or type its address, add site notes, then add individual material items.</p><h3>3. Make the evidence clear</h3><p>Upload/capture a photo, select Mark image, choose a shape and enter the measurements you took. Save each marked view.</p><h3>4. Review and share</h3><p>Submit the recce, verify it in Office view, download the marked images, and export a material report. Support status/replies are simulated locally.</p></div><div class="row">${button("backup", "Save demo backup", "download")}${button("restore", "Restore demo backup", "upload")}${button("reset", "Reset sample data", "undo", "danger")}</div><small>Browser data is not shared between devices. Photo/audio storage is limited; export a JSON backup to keep a portable copy. For camera/microphone on a phone, use a trusted HTTPS host; copying a localhost address from another computer will not work.</small></div>`,
    );
  }
  async function allImages(j) {
    const files = {},
      manifest = [];
    for (const i of j.items)
      for (let n = 0; n < i.views.length; n++) {
        const v = i.views[n];
        if (!v.marks.length) continue;
        const canvas = await markedData(i, v),
          blob = await new Promise((resolve) =>
            canvas.toBlob(resolve, "image/png"),
          );
        const path = `${fileName(j.number)}-${fileName(i.code)}-view-${n + 1}.png`;
        files[path] = new Uint8Array(await blob.arrayBuffer());
        manifest.push([path, i.material, dimensions(i), i.placement]);
      }
    if (!manifest.length)
      throw Error("Add and save at least one marked view first.");
    files["material-images.csv"] = csv([
      ["File", "Material", "Dimensions", "Placement"],
      ...manifest,
    ]);
    download(zip(files), `${fileName(j.number)}-marked-images.zip`);
    toast("Marked images and material index downloaded.");
  }
  const fileName = (value) =>
    String(value)
      .replace(/[^a-z0-9_-]/gi, "-")
      .slice(0, 80);
  async function act(action, el) {
    const j = activeJob;
    if (action === "close") return closeModal();
    if (action === "new-job") return newJob();
    if (action === "metric") {
      statusFilter = el.dataset.value;
      search = "";
      location.hash = "jobs";
      render();
      return;
    }
    if (action === "period") {
      period = el.dataset.value;
      return renderOverview();
    }
    if (action === "open-first") {
      perspective = "field";
      $("#perspective").value = perspective;
      openJob(state.jobs.find((j) => !isLocked(j))?.id || state.jobs[0]?.id);
      return;
    }
    if (action === "open-job") return openJob(el.dataset.id);
    if (action === "step") {
      if (!j) return;
      persist();
      step = Number(el.dataset.step);
      return renderJob();
    }
    if (action === "location") return captureLocation();
    if (action === "add-item") return addItem();
    if (action === "confirm-item") {
      const m = state.catalog[Number($("#new-item-material").value)];
      const max = Math.max(
        0,
        ...j.items.map((i) => Number(i.code.slice(1)) || 0),
      );
      j.items.push(
        item(m.name, m.mode, "B" + String(max + 1).padStart(2, "0")),
      );
      persist();
      step = 1;
      return renderJob();
    }
    if (action === "return-job") {
      if (editor?.dirty && !confirm("Discard changes to this marking?")) return;
      editor = null;
      return renderJob();
    }
    if (action === "remove-item") {
      if (
        !isLocked(j) &&
        confirm("Remove this material item and its demo photos?")
      ) {
        j.items = j.items.filter((i) => i.id !== el.dataset.id);
        persist();
        renderJob();
      }
      return;
    }
    if (action === "sample-photo") {
      const i = j.items.find((i) => i.id === el.dataset.id);
      if (i.views.length >= 4)
        throw Error("This demo supports four views per material item.");
      i.views.push(sampleView(false));
      persist();
      return renderJob();
    }
    if (action === "mark-photo")
      return startMarking(el.dataset.item, el.dataset.view);
    if (action === "tool") {
      if (!editor) return;
      if (editor.polygon.length && !confirm("Discard the unfinished polygon?"))
        return;
      editor.tool = el.dataset.tool;
      editor.draft = null;
      editor.polygon = [];
      $(".drawing-tools")
        .querySelectorAll("button")
        .forEach((b) => b.classList.toggle("active", b === el));
      return redraw();
    }
    if (action === "finish-polygon") {
      if (editor.polygon.length < 3)
        throw Error("Tap at least three points on the image first.");
      editor.marks.push(polygonMark(editor.polygon));
      editor.polygon = [];
      editor.draft = null;
      editor.dirty = true;
      return redraw();
    }
    if (action === "undo-mark") {
      if (editor.polygon.length) {
        editor.polygon = [];
        editor.draft = null;
      } else {
        editor.marks.pop();
        editor.dirty = true;
      }
      return redraw();
    }
    if (action === "select-mark") {
      editor.selected = el.dataset.id;
      return redraw();
    }
    if (action === "delete-mark") {
      editor.marks = editor.marks.filter((m) => m.id !== editor.selected);
      editor.selected = null;
      editor.dirty = true;
      return redraw();
    }
    if (action === "save-mark") return saveMark();
    if (action === "download-mark") {
      const v = { ...editor.view, marks: editor.marks };
      const canvas = await markedData(editor.item, v);
      canvas.toBlob((blob) =>
        download(
          blob,
          `${fileName(j.number)}-${fileName(editor.item.code)}-${fileName(v.name)}.png`,
        ),
      );
      return;
    }
    if (action === "submit-recce") {
      const issues = [];
      if (!j.shop.trim() || !j.address.trim())
        issues.push("shop name and site address");
      if (!j.items.length) issues.push("at least one material item");
      for (const i of j.items) {
        if (!i.placement.trim()) issues.push(`${i.code} placement`);
        if (
          !(i.quantity > 0) ||
          (i.mode === "area" && (!(i.width > 0) || !(i.height > 0))) ||
          (i.mode === "length" && !(i.length > 0)) ||
          !Number.isInteger(Number(i.quantity))
        )
          issues.push(`${i.code} valid measurements and whole-number quantity`);
        if (!i.views.some((v) => v.marks.length && v.preview))
          issues.push(`${i.code} a saved marked photo`);
      }
      if (issues.length)
        throw Error("Please complete: " + issues.join("; ") + ".");
      j.status = "Submitted";
      j.seen = false;
      audit(j, "Recce submitted for office review (local demo)");
      persist();
      renderJob();
      return toast(
        "Recce submitted locally. Switch to Office view to review it.",
      );
    }
    if (action === "verify") {
      j.status = "Verified";
      audit(j, "Office verified the recce (local demo)");
      persist();
      renderJob();
      return toast("Recce verified. It is now read-only.");
    }
    if (action === "correction") {
      const note = prompt("What should the recce person correct?");
      if (!note?.trim()) return;
      j.status = "NeedsCorrection";
      audit(j, "Correction requested: " + note.trim());
      persist();
      renderJob();
      return;
    }
    if (action === "reassign") {
      const person = prompt(
        "Assign this job to which recce person?",
        j.assignee,
      );
      if (!person?.trim()) return;
      const reason = prompt(
        "Why is the job being reassigned?",
        "Original person unavailable",
      );
      if (!reason?.trim()) return;
      audit(
        j,
        `Reassigned from ${j.assignee} to ${person.trim()}: ${reason.trim()}`,
      );
      j.assignee = person.trim().slice(0, 80);
      persist();
      renderJob();
      return toast(
        "Assignment updated. Existing photos and notes were preserved.",
      );
    }
    if (action === "download-all") return allImages(j);
    if (action === "job-report") {
      reportJob = j.id;
      reportStatus = "";
      reportTab = "filters";
      closeModal();
      location.hash = "reports";
      return render();
    }
    if (action === "report-tab") {
      reportTab = el.dataset.tab;
      return renderReports();
    }
    if (action === "column-up" || action === "column-down") {
      const n = selectedColumns.indexOf(el.dataset.column),
        to = n + (action === "column-up" ? -1 : 1);
      if (to >= 0 && to < selectedColumns.length)
        [selectedColumns[n], selectedColumns[to]] = [
          selectedColumns[to],
          selectedColumns[n],
        ];
      return renderReports();
    }
    if (action === "export-csv") return exportReport("csv");
    if (action === "export-xlsx") return exportReport("xlsx");
    if (action === "print-report") {
      if (!selectedColumns.length)
        throw Error("Choose at least one report column first.");
      return window.print();
    }
    if (action === "new-support") return newSupport();
    if (action === "raise-job-support") {
      const number = j.number;
      closeModal();
      return newSupport(number);
    }
    if (action === "open-support") return openSupport(el.dataset.id);
    if (action === "support-filter") {
      supportStatus = el.dataset.value;
      return renderSupport();
    }
    if (action === "escalate-demo") {
      thread.team = "Developer";
      thread.status = "Pending";
      thread.events.push({
        at: now(),
        actor: "Office",
        text: "Escalated to developer (local demonstration)",
      });
      persist();
      return openSupport(thread.id);
    }
    if (action === "record-voice") return recordVoice(el.dataset.target, el);
    if (action === "import") {
      $("#import-file").value = "";
      $("#import-file").click();
      return;
    }
    if (action === "template") return exportTemplate();
    if (action === "confirm-import") {
      if (!imported) return;
      if (state.jobs.length + imported.length > 200)
        throw Error(
          "This demo supports up to 200 jobs. Save a backup and reset sample data to start a new set.",
        );
      state.jobs.push(...imported);
      imported = null;
      persist();
      closeModal();
      location.hash = "jobs";
      render();
      return toast(
        "Spreadsheet jobs imported. You can start the site visits now.",
      );
    }
    if (action === "backup") {
      download(
        new Blob([JSON.stringify(state, null, 2)], {
          type: "application/json",
        }),
        "RecceFlow-demo-backup.json",
      );
      return toast(
        "Demo backup downloaded, including photos and recorded notes.",
      );
    }
    if (action === "restore") {
      $("#restore-file").value = "";
      $("#restore-file").click();
      return;
    }
    if (action === "reset") {
      if (
        confirm(
          "Replace all data in this demo with the original samples? Save a backup first if you want to keep changes.",
        )
      ) {
        state = initialState();
        persist();
        closeModal();
        render();
        toast("Fictional sample data restored.");
      }
      return;
    }
  }
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-action]");
    if (el && el.dataset.action && !el.disabled) {
      e.preventDefault();
      Promise.resolve(act(el.dataset.action, el)).catch((error) =>
        toast(error.message || "Could not complete that action.", true),
      );
    }
  });
  document.addEventListener("input", (e) => {
    const el = e.target;
    if (el.id === "job-search") {
      search = el.value;
      $("#job-results").innerHTML = jobsTable(filteredJobs());
      $("#job-count").textContent =
        `${filteredJobs().length} matching jobs · local demo records`;
    }
    if (el.dataset.jobField && activeJob && !isLocked(activeJob)) {
      activeJob[el.dataset.jobField] = el.value;
      persist();
    }
    if (el.dataset.itemField && activeJob && !isLocked(activeJob)) {
      const i = activeJob.items.find((i) => i.id === el.dataset.itemId);
      const field = el.dataset.itemField;
      i[field] = ["width", "height", "length", "quantity"].includes(field)
        ? Number(el.value)
        : el.value;
      if (["width", "height", "length", "quantity", "unit"].includes(field))
        i.views.forEach((v) => (v.preview = ""));
      if ($("#area-" + i.id))
        $("#area-" + i.id).textContent =
          `Total rectangular area: ${area(i).toFixed(2)} m² · refresh markings after dimension changes`;
      persist();
    }
    if (el.id === "report-heading") reportHeading = el.value;
    if (el.id === "report-note") reportNote = el.value;
    if (el.id === "mark-color" && editor) editor.color = el.value;
  });
  document.addEventListener("change", async (e) => {
    const el = e.target;
    try {
      if (el.id === "perspective") {
        perspective = el.value;
        render();
        if (activeJob && !editor) renderJob();
      }
      if (el.id === "job-filter") {
        statusFilter = el.value;
        renderJobs();
      }
      if (el.id === "report-status") {
        reportStatus = el.value;
        renderReports();
      }
      if (el.id === "report-job") {
        reportJob = el.value;
        renderReports();
      }
      if (el.dataset.reportColumn) {
        if (el.checked) selectedColumns.push(el.dataset.reportColumn);
        else
          selectedColumns = selectedColumns.filter(
            (c) => c !== el.dataset.reportColumn,
          );
        renderReports();
      }
      if (el.dataset.photoItem) {
        const i = activeJob.items.find((i) => i.id === el.dataset.photoItem);
        if (isLocked(activeJob)) return;
        if (i.views.length >= 4)
          throw Error("This demo supports four views per material item.");
        if (!el.files[0]) return;
        const source = await readPhoto(el.files[0]);
        i.views.push({
          id: uid(),
          name: "Photo " + (i.views.length + 1),
          source,
          preview: "",
          marks: [],
        });
        persist();
        renderJob();
        toast("Photo added. Open it to mark this material.");
      }
      if (el.id === "import-file") await importFile(el.files[0]);
      if (el.id === "restore-file") {
        const file = el.files[0];
        if (!file) return;
        if (file.size > 8 * 1024 * 1024)
          throw Error("Choose a demo backup under 8 MB.");
        const data = JSON.parse(await file.text());
        validateBackup(data);
        if (
          confirm("Replace this browser's demo data with the selected backup?")
        ) {
          state = data;
          persist();
          closeModal();
          render();
          toast("Demo backup restored on this device.");
        }
      }
    } catch (error) {
      toast(error.message, true);
    }
  });
  document.addEventListener("submit", (e) => {
    const form = e.target;
    if (
      !["job-form", "material-form", "support-form", "support-update"].includes(
        form.id,
      )
    )
      return;
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    try {
      if (form.id === "job-form") {
        if (state.jobs.length >= 200)
          throw Error(
            "Maximum 200 demo jobs. Save a backup before starting another set.",
          );
        const number =
          "RF-" +
          (Math.max(
            1000,
            ...state.jobs.map((j) =>
              /^RF-\d+$/.test(j.number) ? Number(j.number.slice(3)) : 1000,
            ),
          ) +
            1);
        const j = {
          ...data,
          id: uid(),
          number,
          shop: data.shop.trim(),
          client: data.client.trim(),
          address: data.address.trim(),
          status: "Assigned",
          seen: true,
          notes: "",
          location: null,
          startedAt: null,
          items: [],
          history: [
            { at: now(), text: "Manually created in the client prototype" },
          ],
        };
        if (!j.shop || !j.client || !j.address)
          throw Error("Shop, client and address are required.");
        state.jobs.unshift(j);
        persist();
        closeModal();
        location.hash = "jobs";
        render();
        toast(`${j.number} created. Switch to Recce view to start the visit.`);
      }
      if (form.id === "material-form") {
        const name = data.name.trim();
        if (!name) throw Error("Enter a material name.");
        if (
          state.catalog.some((m) => m.name.toLowerCase() === name.toLowerCase())
        )
          throw Error(
            "This material already exists. Choose it when adding a job item.",
          );
        state.catalog.push({ name, mode: data.mode });
        persist();
        renderMaterials();
        toast("Material added to this demo catalog.");
      }
      if (form.id === "support-form") {
        if (recording)
          throw Error("Stop the recording before saving the request.");
        if (!data.description.trim() && !supportAudio)
          throw Error("Type the issue or record a voice note.");
        const t = {
          id: uid(),
          ref: "SUP-" + (1001 + state.tickets.length),
          subject: data.subject.trim() || "Voice support request",
          description: data.description.trim(),
          jobNumber: data.jobNumber,
          raisedBy: perspective === "office" ? "Demo admin" : "Recce person",
          team: data.team,
          status: "Pending",
          audio: supportAudio,
          events: [
            {
              at: now(),
              actor: perspective === "office" ? "Office" : "Recce person",
              text: data.description.trim() || "Voice request recorded",
            },
          ],
        };
        state.tickets.unshift(t);
        persist();
        closeModal();
        location.hash = "support";
        render();
        toast("Demo issue saved locally. It has not been sent to a real team.");
      }
      if (form.id === "support-update") {
        if (!data.text.trim()) throw Error("Enter a reply or resolution note.");
        thread.status = data.status;
        thread.events.push({
          at: now(),
          actor: data.actor,
          text: data.text.trim(),
        });
        const id = thread.id;
        persist();
        openSupport(id);
        toast("Support status and reply updated in the local demo.");
      }
    } catch (error) {
      toast(error.message, true);
    }
  });
  function validateBackup(data) {
    if (
      data?.schema !== 1 ||
      !Array.isArray(data.jobs) ||
      data.jobs.length > 200 ||
      !Array.isArray(data.catalog) ||
      data.catalog.length > 200 ||
      !Array.isArray(data.tickets) ||
      data.tickets.length > 500
    )
      throw Error("This is not a supported RecceFlow demo backup.");
    const str = (v) => typeof v === "string" && v.length < 6000,
      identifier = (v) => str(v) && /^[a-z0-9-]{8,80}$/i.test(v),
      finite = (n) => Number.isFinite(n) && Math.abs(n) <= 100000;
    for (const m of data.catalog)
      if (!m || !str(m.name) || !Object.hasOwn(modes, m.mode))
        throw Error("Invalid material in backup.");
    for (const j of data.jobs) {
      if (!j || !identifier(j.id)) throw Error("Invalid job identifier in backup.");
      if (
        ![
          j.id,
          j.number,
          j.shop,
          j.client,
          j.address,
          j.assignee,
          j.notes,
        ].every(str) ||
        !statuses.includes(j.status) ||
        !Array.isArray(j.items) ||
        j.items.length > 20 ||
        !Array.isArray(j.history) ||
        j.history.some((e) => !str(e.text) || !str(e.at))
      )
        throw Error("Invalid job in backup.");
      if (
        j.location &&
        ![j.location.latitude, j.location.longitude, j.location.accuracy].every(
          finite,
        )
      )
        throw Error("Invalid backup location.");
      if (j.audio && !safeAudio(j.audio))
        throw Error("Invalid audio in backup.");
      for (const i of j.items) {
        if (!i || !identifier(i.id)) throw Error("Invalid material identifier in backup.");
        if (
          ![i.id, i.code, i.material, i.placement, i.notes].every(str) ||
          !Object.hasOwn(modes, i.mode) ||
          ![i.width, i.height, i.length, i.quantity].every(finite) ||
          !["ft", "m", "cm"].includes(i.unit) ||
          !Array.isArray(i.views) ||
          i.views.length > 4
        )
          throw Error("Invalid material item in backup.");
        for (const v of i.views) {
          if (
            !v || !identifier(v.id) ||
            !str(v.name) ||
            typeof v.source !== "string" ||
            safeImage(v.source) !== v.source ||
            (v.preview && safeImage(v.preview) !== v.preview) ||
            !Array.isArray(v.marks) ||
            v.marks.length > 500
          )
            throw Error("Invalid photo in backup.");
          for (const m of v.marks)
            if (
              !m || !identifier(m.id) ||
              ![
                "rectangle",
                "ellipse",
                "arrow",
                "line",
                "polygon",
                "draw",
              ].includes(m.type) ||
              !/^#[a-f0-9]{6}$/i.test(m.color) ||
              ![m.x, m.y, m.w, m.height].every(
                (n) => Number.isFinite(n) && Math.abs(n) <= 1,
              ) ||
              !Array.isArray(m.points) ||
              m.points.length > 20000 ||
              m.points.some(
                (p) =>
                  ![p.x, p.y].every(
                    (n) => Number.isFinite(n) && n >= 0 && n <= 1,
                  ),
              )
            )
              throw Error("Invalid image marking in backup.");
        }
      }
    }
    for (const t of data.tickets)
      if (
        !t || !identifier(t.id) ||
        ![t.id, t.ref, t.subject, t.description, t.raisedBy, t.team].every(
          str,
        ) ||
        !["Pending", "Processing", "Resolved"].includes(t.status) ||
        (t.audio && !safeAudio(t.audio)) ||
        !Array.isArray(t.events) ||
        t.events.some((e) => !str(e.actor) || !str(e.text) || !str(e.at))
      )
        throw Error("Invalid support request in backup.");
  }
  $("#close-modal").addEventListener("click", closeModal);
  modal.addEventListener("cancel", (e) => {
    e.preventDefault();
    closeModal();
  });
  $("#help-button").addEventListener("click", demoHelp);
  $("#backup-button").addEventListener("click", () => act("backup"));
  window.addEventListener("hashchange", () => {
    page = ["overview", "jobs", "materials", "reports", "support"].includes(
      location.hash.slice(1),
    )
      ? location.hash.slice(1)
      : "overview";
    render();
  });
  page = ["overview", "jobs", "materials", "reports", "support"].includes(
    location.hash.slice(1),
  )
    ? location.hash.slice(1)
    : "overview";
  $("#perspective").value = perspective;
  persist();
  render();
})();
