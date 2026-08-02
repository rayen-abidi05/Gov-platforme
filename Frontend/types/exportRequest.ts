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
  label: "AGRIM" | "CONTRACT" | "MINISTERIAL_LETTER";
  fileName: string;
  fileUrl: string;
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