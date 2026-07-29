export type ExportRequestStatus =
  | "SENT"                  
  | "UNDER_COMMITTEE_REVIEW" 
  | "APPROVED"               
  | "REJECTED";               

export interface AgrimInfo {
  reference: string;  
  limitKg: number;     
  consumedKg: number;  
  requestedKg: number; 
}

export interface ExportRequestDocument {
  id: string;
  label: "AGRIM" | "CONTRACT" | "MINISTERIAL_LETTER";
  fileName: string;
  fileUrl: string;
}

export interface ExportRequest {
  id: string;
  client: string;
  agrim: AgrimInfo;
  documents: ExportRequestDocument[];
  status: ExportRequestStatus;
  submittedAt: string;

}

export const EXPORT_STATUS_LABELS: Record<ExportRequestStatus, { fr: string; ar: string }> = {
  SENT: { fr: "Envoyée", ar: "أرسلت" },
  UNDER_COMMITTEE_REVIEW: { fr: "Examen par l'instance", ar: "قيد نظر الهيئة" },
  APPROVED: { fr: "Approuvée", ar: "موافق عليها" },
  REJECTED: { fr: "Rejetée", ar: "مرفوضة" },
};