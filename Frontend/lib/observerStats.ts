import { ExportRequest } from "@/types/exportRequest";

const MONTHS_FR = [
  "Jan", "Fév", "Mar", "Avr", "Mai", "Jun",
  "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc",
];

export function filterByMonthYear(
  requests: ExportRequest[],
  month: string,
  year: string
) {
  return requests.filter((r) => {
    const d = new Date(r.submittedAt);
    if (year !== "ALL" && d.getFullYear() !== Number(year)) return false;
    if (month !== "ALL" && d.getMonth() + 1 !== Number(month)) return false;
    return true;
  });
}

export function computeKpis(requests: ExportRequest[]) {
  const total = requests.length;
  const sent = requests.filter((r) => r.status === "SENT").length;
  const underReview = requests.filter((r) => r.status === "UNDER_COMMITTEE_REVIEW").length;
  const pending = sent + underReview;
  const approved = requests.filter((r) => r.status === "APPROVED").length;
  const rejected = requests.filter((r) => r.status === "REJECTED").length;
  const totalVolumeKg = requests
    .filter((r) => r.status === "APPROVED")
    .reduce((sum, r) => sum + r.requestedKg, 0);

  return { total, sent, underReview, pending, approved, rejected, totalVolumeKg };
}

export function computeMonthlyExports(requests: ExportRequest[]) {
  const byMonth = new Map<string, { month: string; count: number; volumeKg: number }>();

  requests.forEach((r) => {
    const d = new Date(r.submittedAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = `${MONTHS_FR[d.getMonth()]} ${d.getFullYear()}`;
    const entry = byMonth.get(key) ?? { month: label, count: 0, volumeKg: 0 };
    entry.count += 1;
    if (r.status === "APPROVED") entry.volumeKg += r.requestedKg;
    byMonth.set(key, entry);
  });

  return Array.from(byMonth.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, v]) => v);
}

export function computeApprovalVsRejection(requests: ExportRequest[]) {
  const decided = requests.filter((r) => r.status === "APPROVED" || r.status === "REJECTED");
  const approved = decided.filter((r) => r.status === "APPROVED").length;
  const rejected = decided.filter((r) => r.status === "REJECTED").length;
  return [
    { name: "Approuvées", value: approved },
    { name: "Rejetées", value: rejected },
  ];
}

export function computeTopExporters(requests: ExportRequest[], limit = 5) {
  const byCompany = new Map<string, { name: string; volumeKg: number; count: number }>();

  requests.forEach((r) => {
    const name = r.company?.commName ?? r.client;
    const entry = byCompany.get(name) ?? { name, volumeKg: 0, count: 0 };
    entry.count += 1;
    entry.volumeKg += r.requestedKg;
    byCompany.set(name, entry);
  });

  return Array.from(byCompany.values())
    .sort((a, b) => b.volumeKg - a.volumeKg)
    .slice(0, limit);
}

export function computeVolumeByGovernorate(requests: ExportRequest[]) {
  const byGov = new Map<string, number>();

  requests.forEach((r) => {
    const gov = r.company?.governorate ?? "Non renseigné";
    byGov.set(gov, (byGov.get(gov) ?? 0) + r.requestedKg);
  });

  return Array.from(byGov.entries())
    .map(([name, volumeKg]) => ({ name, volumeKg }))
    .sort((a, b) => b.volumeKg - a.volumeKg);
}

export function computeExportTypeDistribution(requests: ExportRequest[]) {
  const byType = new Map<string, number>();

  requests.forEach((r) => {
    const type = r.company?.exportType
      ? r.company.exportType === "liste1"
        ? "Liste 1"
        : "Liste 2"
      : "Non renseigné";
    byType.set(type, (byType.get(type) ?? 0) + 1);
  });

  return Array.from(byType.entries()).map(([name, value]) => ({ name, value }));
}

export function computeAvgProcessingDays(requests: ExportRequest[]) {
  const decided = requests.filter((r) => r.reviewedAt);
  if (decided.length === 0) return 0;

  const totalDays = decided.reduce((sum, r) => {
    const submitted = new Date(r.submittedAt).getTime();
    const reviewed = new Date(r.reviewedAt as string).getTime();
    return sum + (reviewed - submitted) / (1000 * 60 * 60 * 24);
  }, 0);

  return Math.round((totalDays / decided.length) * 10) / 10;
}

export function computeProcessingTimeSeries(requests: ExportRequest[]) {
  return requests
    .filter((r) => r.reviewedAt)
    .map((r) => {
      const submitted = new Date(r.submittedAt).getTime();
      const reviewed = new Date(r.reviewedAt as string).getTime();
      const days = Math.round(((reviewed - submitted) / (1000 * 60 * 60 * 24)) * 10) / 10;
      return { id: r.agrimReference || r.id.slice(0, 6), days };
    })
    .slice(-15);
}

export function computeStatusDistribution(requests: ExportRequest[]) {
  const labels: Record<ExportRequest["status"], string> = {
    SENT: "Envoyée",
    UNDER_COMMITTEE_REVIEW: "En examen",
    APPROVED: "Approuvée",
    REJECTED: "Rejetée",
  };
  const order: ExportRequest["status"][] = [
    "SENT", "UNDER_COMMITTEE_REVIEW", "APPROVED", "REJECTED",
  ];

  return order.map((status) => ({
    name: labels[status],
    status,
    value: requests.filter((r) => r.status === status).length,
  }));
}

export function getAvailableYears(requests: ExportRequest[]) {
  const years = new Set(requests.map((r) => new Date(r.submittedAt).getFullYear()));
  return Array.from(years).sort((a, b) => b - a);
}
