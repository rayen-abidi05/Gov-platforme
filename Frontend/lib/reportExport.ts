// Zero-dependency exports: CSV is hand-rolled, "Excel" is an HTML table saved
// with a .xls extension (Excel/LibreOffice/Sheets all open this natively),
// and "PDF" opens a print-formatted window so the user saves via the
// browser's built-in "Save as PDF" print destination. No extra npm packages
// required for any of this.

export type ReportRow = Record<string, string | number>;

export interface ReportData {
  title: string;
  columns: string[];
  rows: ReportRow[];
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function toAoA(data: ReportData): (string | number)[][] {
  return [data.columns, ...data.rows.map((row) => data.columns.map((c) => row[c] ?? ""))];
}

export function downloadCSV(data: ReportData, filename: string) {
  const aoa = toAoA(data);
  const csv = aoa
    .map((row) =>
      row
        .map((cell) => {
          const s = String(cell);
          return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
        })
        .join(",")
    )
    .join("\n");

  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  triggerDownload(blob, `${filename}.csv`);
}

export function downloadExcel(data: ReportData, filename: string) {
  const headerRow = `<tr>${data.columns
    .map((c) => `<th>${escapeHtml(String(c))}</th>`)
    .join("")}</tr>`;

  const bodyRows = data.rows
    .map(
      (row) =>
        `<tr>${data.columns
          .map((c) => `<td>${escapeHtml(String(row[c] ?? ""))}</td>`)
          .join("")}</tr>`
    )
    .join("");

  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8" />
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>${escapeHtml(data.title.slice(0, 31))}</x:Name>
              <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        table { border-collapse: collapse; font-family: Calibri, Arial, sans-serif; font-size: 12px; }
        th, td { border: 1px solid #ccc; padding: 4px 8px; }
        th { background: #1a2410; color: #fdf6e3; text-align: left; }
      </style>
    </head>
    <body>
      <table>${headerRow}${bodyRows}</table>
    </body>
    </html>`;

  const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8;" });
  triggerDownload(blob, `${filename}.xls`);
}

export function downloadPDF(data: ReportData) {
  const win = window.open("", "_blank");
  if (!win) {
    alert("Veuillez autoriser les fenêtres pop-up pour générer le PDF.");
    return;
  }

  const headerRow = `<tr>${data.columns
    .map((c) => `<th>${escapeHtml(String(c))}</th>`)
    .join("")}</tr>`;

  const bodyRows = data.rows
    .map(
      (row) =>
        `<tr>${data.columns
          .map((c) => `<td>${escapeHtml(String(row[c] ?? ""))}</td>`)
          .join("")}</tr>`
    )
    .join("");

  win.document.write(`
    <html>
    <head>
      <title>${escapeHtml(data.title)}</title>
      <meta charset="utf-8" />
      <style>
        body { font-family: Arial, sans-serif; padding: 24px; color: #1a1a1a; }
        h1 { font-size: 18px; margin: 0 0 2px; }
        p.meta { color: #666; font-size: 11px; margin: 0 0 16px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ccc; padding: 6px 8px; font-size: 11px; text-align: left; }
        th { background: #1a2410; color: #fdf6e3; }
        tr:nth-child(even) td { background: #f7f7f7; }
        @media print { body { padding: 0; } }
      </style>
    </head>
    <body>
      <h1>${escapeHtml(data.title)}</h1>
      <p class="meta">Généré le ${new Date().toLocaleDateString("fr-FR")}</p>
      <table>${headerRow}${bodyRows}</table>
      <script>
        window.onload = function () {
          window.print();
        };
      </script>
    </body>
    </html>`);
  win.document.close();
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
