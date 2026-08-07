export type ExportRequestStatus =
  | "SENT"                  
  | "UNDER_COMMITTEE_REVIEW" 
  | "APPROVED"               
  | "REJECTED";               

export interface AgrimInfo {
  id:string;
  reference:string;
  limitKg:number;
  consumedKg:number;
  remainingKg:number;
}
export interface ExportRequestDocument {
  id: string;
  DocType: "AGRIM" | "CONTRACT" | "MINISTERIAL_LETTER";
  fileName: string;
  fileUrl: string;
}



export interface CompanyInfo {
  id: string;
  commName: string;
  city?: string;
  governorate?: string;
  nationality?: string;
  exportType?: "liste1" | "liste2";
}

export interface ExportRequest {
  id: string;
  client: string;
  agrimReference: string;
  requestedKg: number;
  agrim: AgrimInfo | null; 
  documents: ExportRequestDocument[];
  status: ExportRequestStatus;
  submittedAt: string;
  reviewedAt?: string | null;
  company?: CompanyInfo;
}
export const EXPORT_STATUS_LABELS = {
  SENT: {
    fr: "Envoyée",
  },

  UNDER_COMMITTEE_REVIEW: {
    fr: "En examen par l'instance",
  },

  APPROVED: {
    fr: "Approuvée",
  },

  REJECTED: {
    fr: "Rejetée",
  },
} as const;