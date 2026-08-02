export type InspectionStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ApiInspectionCompany {
  commName: string;
  governorate: string;
}

export interface ApiInspection {
  id: string;
  status: InspectionStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  inspectedAt: string | null;
  registrationRequest: {
    id: string;
    company: ApiInspectionCompany;
  };
}

export const INSPECTION_STATUS_LABELS: Record<InspectionStatus, string> = {
  PENDING: "En attente",
  APPROVED: "Approuvée",
  REJECTED: "Rejetée",
};