import { ApiDocument } from "@/types/registration";

export type InspectionStatus =
  | "PENDING_ASSIGNMENT"
  | "ASSIGNED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED";

export type InspectionPriority = "LOW" | "MEDIUM" | "HIGH";

export type InspectionDecisionType = "APPROVED" | "REJECTED";

export interface InspectionExporter {
  id: string;
  commName: string;
  ownerName: string;
  matFisc: string;
  rne: string;
  governorate: string;
  phone?: string;
  email?: string;
}

export interface InspectionStorage {
  address: string;
  city: string;
  governorate: string;
  isRented: boolean;
  capacity?: string;
}

export interface InspectionInspector {
  id: string;
  name: string;
  email: string;
}

export interface InspectionDecision {
  decision: InspectionDecisionType;
  reason?: string;
  comment?: string;
  decidedAt: string;
  inspector: InspectionInspector;
}

export interface ApiInspection {
  id: string;
  status: InspectionStatus;
  priority?: InspectionPriority;
  exporter: InspectionExporter;
  storage: InspectionStorage;
  documents: ApiDocument[];
  assignedInspector?: InspectionInspector;
  assignedBy?: { id: string; name: string };
  assignedAt?: string;
  decision?: InspectionDecision | null;
  createdAt: string;
  updatedAt: string;
}

// Reasons offered in the mandatory rejection select. Kept front-end only
// for now — the backend can expand/own this list once wired up.
export const REJECTION_REASONS: { value: string; label: string }[] = [
  { value: "STORAGE_NON_COMPLIANT", label: "Local de stockage non conforme" },
  { value: "MISSING_DOCUMENTS", label: "Documents manquants ou incomplets" },
  { value: "HYGIENE_ISSUE", label: "Problème d'hygiène constaté" },
  { value: "CAPACITY_MISMATCH", label: "Capacité de stockage insuffisante" },
  { value: "OTHER", label: "Autre motif" },
];

export const APPROVAL_NOTES: { value: string; label: string }[] = [
  { value: "FULLY_COMPLIANT", label: "Conforme sur tous les points" },
  { value: "MINOR_REMARKS", label: "Conforme avec remarques mineures" },
  { value: "OTHER", label: "Autre remarque" },
];
