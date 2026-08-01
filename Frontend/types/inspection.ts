import { ApiDocument, OliveListe } from "@/types/registration";

export type InspectionStatus =
  | "PENDING_ASSIGNMENT"
  | "ASSIGNED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED";

export type InspectionPriority = "LOW" | "MEDIUM" | "HIGH";

export type InspectionDecisionValue = "APPROVED" | "REJECTED";

export interface ApiInspectionCompany {
  id: string;
  commName: string;
  rne: string;
  matFisc: string;
  activity: string;
  governorate: string;
  city: string;
  address: string;
  phone: string;
  nationality: string;
  isResident: boolean;
  isRented: boolean;
  labName: string;
  exportType?: OliveListe;
  user: { name: string; email: string };
  registrationRequests: {
    id: string;
    documents: ApiDocument[];
  }[];
}

export interface ApiInspectionPerson {
  id: string;
  name: string;
  email: string;
}

export interface ApiInspectionAssignment {
  id: string;
  inspector: ApiInspectionPerson;
  assignedBy: ApiInspectionPerson;
  assignedAt: string;
}

export interface ApiInspectionDecision {
  id: string;
  decision: InspectionDecisionValue;
  comment: string | null;
  decidedAt: string;
}

export interface ApiInspection {
  id: string;
  status: InspectionStatus;
  priority: InspectionPriority | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  company: ApiInspectionCompany;
  createdBy: ApiInspectionPerson;
  assignment: ApiInspectionAssignment | null;
  decision: ApiInspectionDecision | null;
}

export const INSPECTION_STATUS_LABELS: Record<InspectionStatus, string> = {
  PENDING_ASSIGNMENT: "En attente d'assignation",
  ASSIGNED: "Assignée",
  UNDER_REVIEW: "En cours d'examen",
  APPROVED: "Approuvée",
  REJECTED: "Rejetée",
};

export const INSPECTION_PRIORITY_LABELS: Record<InspectionPriority, string> = {
  LOW: "Basse",
  MEDIUM: "Moyenne",
  HIGH: "Haute",
};
