import { ExportRequest, EXPORT_STATUS_LABELS } from "@/types/exportRequest";
import { ReportData } from "@/lib/reportExport";
import { computeMonthlyExports, computeTopExporters } from "@/lib/observerStats";

function statusLabel(status: ExportRequest["status"]) {
  return EXPORT_STATUS_LABELS[status]?.fr ?? status;
}

export function buildExportRequestsReport(requests: ExportRequest[]): ReportData {
  return {
    title: "Demandes d'exportation",
    columns: [
      "Référence AGRIM",
      "Client",
      "Exportateur",
      "Gouvernorat",
      "Quantité (kg)",
      "Statut",
      "Soumise le",
      "Décidée le",
    ],
    rows: requests.map((r) => ({
      "Référence AGRIM": r.agrimReference,
      "Client": r.client,
      "Exportateur": r.company?.commName ?? "—",
      "Gouvernorat": r.company?.governorate ?? "—",
      "Quantité (kg)": r.requestedKg,
      "Statut": statusLabel(r.status),
      "Soumise le": new Date(r.submittedAt).toLocaleDateString("fr-FR"),
      "Décidée le": r.reviewedAt ? new Date(r.reviewedAt).toLocaleDateString("fr-FR") : "—",
    })),
  };
}

export function buildMonthlyExportsReport(requests: ExportRequest[]): ReportData {
  const monthly = computeMonthlyExports(requests);
  return {
    title: "Rapport mensuel des exportations",
    columns: ["Mois", "Nombre de demandes", "Volume approuvé (kg)"],
    rows: monthly.map((m) => ({
      "Mois": m.month,
      "Nombre de demandes": m.count,
      "Volume approuvé (kg)": m.volumeKg,
    })),
  };
}

export function buildCompanyReport(requests: ExportRequest[]): ReportData {
  const byCompany = computeTopExporters(requests, requests.length || 1);
  return {
    title: "Rapport par exportateur",
    columns: ["Exportateur", "Nombre de demandes", "Volume total (kg)"],
    rows: byCompany.map((c) => ({
      "Exportateur": c.name,
      "Nombre de demandes": c.count,
      "Volume total (kg)": c.volumeKg,
    })),
  };
}
