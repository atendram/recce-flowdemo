/* Standalone spreadsheet helpers. No CDN, account, upload or server is used. */
(() => {
  "use strict";
  const enc = new TextEncoder(),
    dec = new TextDecoder();
  const escape = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const xml = (value) =>
    escape(
      Array.from(String(value ?? "")).filter(c => {
        const code = c.charCodeAt(0);
        return code >= 32 || code === 9 || code === 10 || code === 13;
      }).join(""),
    );
  const crcTable = Array.from({ length: 256 }, (_, n) => {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    return c >>> 0;
  });
  const crc = (data) => {
    let c = 0xffffffff;
    for (const b of data) c = crcTable[(c ^ b) & 255] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  };
  function zip(files, type = "application/zip") {
    const chunks = [],
      directory = [];
    let offset = 0;
    for (const [path, value] of Object.entries(files)) {
      const name = enc.encode(path),
        data = typeof value === "string" ? enc.encode(value) : value;
      const head = new Uint8Array(30 + name.length),
        h = new DataView(head.buffer),
        checksum = crc(data);
      h.setUint32(0, 0x04034b50, true);
      h.setUint16(4, 20, true);
      h.setUint16(6, 0x800, true);
      h.setUint32(14, checksum, true);
      h.setUint32(18, data.length, true);
      h.setUint32(22, data.length, true);
      h.setUint16(26, name.length, true);
      head.set(name, 30);
      const central = new Uint8Array(46 + name.length),
        d = new DataView(central.buffer);
      d.setUint32(0, 0x02014b50, true);
      d.setUint16(4, 20, true);
      d.setUint16(6, 20, true);
      d.setUint16(8, 0x800, true);
      d.setUint32(16, checksum, true);
      d.setUint32(20, data.length, true);
      d.setUint32(24, data.length, true);
      d.setUint16(28, name.length, true);
      d.setUint32(42, offset, true);
      central.set(name, 46);
      chunks.push(head, data);
      directory.push(central);
      offset += head.length + data.length;
    }
    const end = new Uint8Array(22),
      e = new DataView(end.buffer);
    e.setUint32(0, 0x06054b50, true);
    e.setUint16(8, directory.length, true);
    e.setUint16(10, directory.length, true);
    e.setUint32(
      12,
      directory.reduce((n, d) => n + d.length, 0),
      true,
    );
    e.setUint32(16, offset, true);
    return new Blob([...chunks, ...directory, end], { type });
  }
  const col = (n) => {
    let v = "";
    for (n++; n; n = Math.floor((n - 1) / 26))
      v = String.fromCharCode(65 + ((n - 1) % 26)) + v;
    return v;
  };
  function workbook(headers, rows, heading = "", subtitle = "") {
    const preamble = [
      ...(heading ? [[heading]] : []),
      ...(subtitle ? [[subtitle]] : []),
    ];
    const all = [...preamble, headers, ...rows],
      headerRow = preamble.length + 1;
    const sheet = all
      .map(
        (r, index) =>
          `<row r="${index + 1}">${r.map((v, n) => `<c r="${col(n)}${index + 1}" t="inlineStr" s="${index === headerRow - 1 ? 1 : 0}"><is><t xml:space="preserve">${xml(v)}</t></is></c>`).join("")}</row>`,
      )
      .join("");
    return zip(
      {
        "[Content_Types].xml":
          '<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>',
        "_rels/.rels":
          '<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>',
        "xl/workbook.xml":
          '<?xml version="1.0"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="RecceFlow" sheetId="1" r:id="rId1"/></sheets></workbook>',
        "xl/_rels/workbook.xml.rels":
          '<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>',
        "xl/styles.xml":
          '<?xml version="1.0"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF147D68"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="49" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="49" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>',
        "xl/worksheets/sheet1.xml": `<?xml version="1.0"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"><pane ySplit="${headerRow}" topLeftCell="A${headerRow + 1}" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols><col min="1" max="${headers.length}" width="25" customWidth="1"/></cols><sheetData>${sheet}</sheetData><autoFilter ref="A${headerRow}:${col(headers.length - 1)}${all.length}"/></worksheet>`,
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
  }
  function csv(rows) {
    return (
      "\ufeff" +
      rows
        .map((r) =>
          r
            .map(
              (v) =>
                '"' +
                String(v ?? "")
                  .replace(/^[=+@\-\t\r]/, (s) => "'" + s)
                  .replaceAll('"', '""') +
                '"',
            )
            .join(","),
        )
        .join("\r\n")
    );
  }
  function parseCSV(text) {
    const result = [];
    let row = [],
      field = "",
      quoted = false,
      closed = false;
    text = text.replace(/^\ufeff/, "");
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (quoted) {
        if (c === '"') {
          if (text[i + 1] === '"') {
            field += '"';
            i++;
          } else {
            quoted = false;
            closed = true;
          }
        } else field += c;
      } else if (c === '"' && !field && !closed) quoted = true;
      else if (c === "," || c === "\n" || c === "\r") {
        row.push(field);
        field = "";
        closed = false;
        if (c !== ",") {
          if (row.some((v) => v.trim())) result.push(row);
          row = [];
          if (c === "\r" && text[i + 1] === "\n") i++;
        }
      } else {
        if (closed || c === '"')
          throw Error(
            "Invalid CSV quoting. Save as CSV UTF-8 from Excel and retry.",
          );
        field += c;
      }
    }
    if (quoted) throw Error("Unclosed quote in CSV.");
    row.push(field);
    if (row.some((v) => v.trim())) result.push(row);
    return result;
  }
  async function readXlsx(file) {
    const bytes = new Uint8Array(await file.arrayBuffer()),
      v = new DataView(bytes.buffer);
    let end = bytes.length - 22;
    while (
      end >= Math.max(0, bytes.length - 65557) &&
      v.getUint32(end, true) !== 0x06054b50
    )
      end--;
    if (end < 0 || v.getUint32(end, true) !== 0x06054b50)
      throw Error("Invalid Excel workbook. Use .xlsx or CSV UTF-8.");
    const count = v.getUint16(end + 10, true);
    let at = v.getUint32(end + 16, true),
      size = 0;
    if (count > 1000)
      throw Error(
        "Workbook is too complex. Export the Jobs sheet as CSV instead.",
      );
    const entries = new Map();
    for (let i = 0; i < count; i++) {
      if (at + 46 > bytes.length || v.getUint32(at, true) !== 0x02014b50)
        throw Error("Invalid workbook directory.");
      const length = v.getUint16(at + 28, true),
        name = dec.decode(bytes.slice(at + 46, at + 46 + length));
      const compressed = v.getUint32(at + 20, true),
        unpacked = v.getUint32(at + 24, true),
        local = v.getUint32(at + 42, true),
        method = v.getUint16(at + 10, true);
      size += unpacked;
      if (
        size > 20 * 1024 * 1024 ||
        local + 30 > bytes.length ||
        v.getUint16(at + 8, true) & 1
      )
        throw Error(
          "Workbook is encrypted or exceeds the demo's 20 MB expanded limit.",
        );
      const start =
        local +
        30 +
        v.getUint16(local + 26, true) +
        v.getUint16(local + 28, true);
      if (start + compressed > bytes.length)
        throw Error("Workbook contains an invalid entry.");
      entries.set(name, {
        data: bytes.slice(start, start + compressed),
        method,
        unpacked,
      });
      at +=
        46 + length + v.getUint16(at + 30, true) + v.getUint16(at + 32, true);
    }
    async function read(path) {
      const e = entries.get(path);
      if (!e) return null;
      let data = e.data;
      if (e.method === 8) {
        if (!window.DecompressionStream)
          throw Error(
            "Use current Edge/Chrome for .xlsx, or import CSV instead.",
          );
        const reader = new Blob([data])
          .stream()
          .pipeThrough(new DecompressionStream("deflate-raw"))
          .getReader();
        const parts = [];
        let total = 0;
        while (true) {
          const part = await reader.read();
          if (part.done) break;
          total += part.value.length;
          if (total > e.unpacked || total > 20 * 1024 * 1024) {
            await reader.cancel();
            throw Error("Workbook entry exceeds its declared size.");
          }
          parts.push(part.value);
        }
        data = new Uint8Array(total);
        let n = 0;
        for (const part of parts) {
          data.set(part, n);
          n += part.length;
        }
      } else if (e.method !== 0)
        throw Error("Unsupported Excel compression. Save as CSV UTF-8.");
      const doc = new DOMParser().parseFromString(
        dec.decode(data),
        "application/xml",
      );
      if (doc.querySelector("parsererror")) throw Error("Invalid Excel XML.");
      return doc;
    }
    const workbook = await read("xl/workbook.xml"),
      rels = await read("xl/_rels/workbook.xml.rels");
    const sheet = workbook?.getElementsByTagName("sheet")[0];
    const relationId = sheet?.getAttribute("r:id");
    const relation = Array.from(
      rels?.getElementsByTagName("Relationship") || [],
    ).find((r) => r.getAttribute("Id") === relationId);
    const target = relation?.getAttribute("Target");
    if (!target)
      throw Error("No worksheet found. Import a simple .xlsx workbook.");
    const path = target.startsWith("/")
      ? target.slice(1)
      : new URL(target, "https://local.invalid/xl/").pathname.slice(1);
    const shared = await read("xl/sharedStrings.xml");
    const strings = Array.from(shared?.getElementsByTagName("si") || []).map(
      (si) =>
        Array.from(si.getElementsByTagName("t"))
          .map((t) => t.textContent)
          .join(""),
    );
    const doc = await read(path);
    if (!doc) throw Error("First worksheet not found.");
    return Array.from(doc.getElementsByTagName("row"))
      .map((row) => {
        const cells = [];
        for (const cell of row.getElementsByTagName("c")) {
          const letters = (cell.getAttribute("r") || "A1").replace(
            /[0-9]/g,
            "",
          );
          let index = 0;
          for (const c of letters) index = index * 26 + c.charCodeAt(0) - 64;
          if (index > 100)
            throw Error(
              "Too many worksheet columns. Use the Jobs import template.",
            );
          const type = cell.getAttribute("t"),
            value = cell.getElementsByTagName("v")[0]?.textContent || "";
          cells[index - 1] =
            type === "s"
              ? strings[Number(value)] || ""
              : type === "inlineStr"
                ? Array.from(cell.getElementsByTagName("t"))
                    .map((t) => t.textContent)
                    .join("")
                : value;
        }
        return Array.from({ length: cells.length }, (_, n) => cells[n] || "");
      })
      .filter((r) => r.some((v) => v.trim()));
  }
  function save(blob, name) {
    const a = document.createElement("a"),
      url = URL.createObjectURL(blob);
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }
  window.DemoFiles = { escape, zip, workbook, csv, parseCSV, readXlsx, save };
})();
