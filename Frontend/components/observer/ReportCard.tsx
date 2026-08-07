"use client";

import { FileText, FileSpreadsheet, FileDown } from "lucide-react";
import { ReportData, downloadCSV, downloadExcel, downloadPDF } from "@/lib/reportExport";

interface Props {
  title: string;
  description: string;
  filename: string;
  getData: () => ReportData;
  rowCount: number;
}

export default function ReportCard({ title, description, filename, getData, rowCount }: Props) {
  const disabled = rowCount === 0;

  return (
    <div className="rounded-xl border border-cream-50/10 bg-olive-950/40 backdrop-blur-md p-5">
      <h3 className="text-sm font-medium text-cream-50/90">{title}</h3>
      <p className="mt-1 text-xs text-cream-50/50">{description}</p>
      <p className="mt-2 text-xs text-cream-50/40">{rowCount} ligne(s) disponible(s)</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          disabled={disabled}
          onClick={() => downloadPDF(getData())}
          title="Ouvre un aperçu imprimable — utilisez « Enregistrer en PDF » dans la fenêtre d'impression"
          className="inline-flex items-center gap-1.5 rounded-lg border border-gold-300/30 bg-gold-300/10 px-3 py-1.5 text-xs font-medium text-gold-300 transition-all duration-200 hover:bg-gold-300/20 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <FileText className="h-3.5 w-3.5" />
          PDF
        </button>
        <button
          disabled={disabled}
          onClick={() => downloadExcel(getData(), filename)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-green-400/30 bg-green-400/10 px-3 py-1.5 text-xs font-medium text-green-300 transition-all duration-200 hover:bg-green-400/20 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <FileSpreadsheet className="h-3.5 w-3.5" />
          Excel
        </button>
        <button
          disabled={disabled}
          onClick={() => downloadCSV(getData(), filename)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-blue-400/30 bg-blue-400/10 px-3 py-1.5 text-xs font-medium text-blue-300 transition-all duration-200 hover:bg-blue-400/20 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <FileDown className="h-3.5 w-3.5" />
          CSV
        </button>
      </div>
    </div>
  );
}
