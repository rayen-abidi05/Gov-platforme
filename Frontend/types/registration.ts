export type RequestStatus = "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";

export type DocType =
  | "RNE"
  | "TAXREALTED"
  | "DIWAN"
  | "QUITTANCE"
  | "EXISTANCEDECLARATION"
  | "RENTEDDECLARATION"
  | "CERTIFICATIONOWNERSHIP"
  | "LABDOC";

export interface ApiDocument {
  id: string;
  DocType: DocType; 
  fileName: string;
  fileType: string;
  fileUrl: string; 
  size: number;
  uploadedAt: string;
}

// add to existing file
export type OliveListe = "liste1" | "liste2";

export const OLIVE_LISTE_LABELS: Record<OliveListe, { fr: string; ar: string; description: string }> = {
  liste1: {
    fr: "Liste 1 — Toutes espèces",
    ar: "القائمة 1 — جميع الأنواع",
    description: "Exportation de toutes les huiles d'olive",
  },
  liste2: {
    fr: "Liste 2 — Huile en conserve",
    ar: "القائمة 2 — معلبات",
    description: "Exportation d'huile d'olive en conserve uniquement",
  },
};


export interface ApprovedExporter {
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
  user: {
    name: string;
    email: string;
  };
  approvedAt: string;
}

export interface ApiRegistrationRequest {
  id: string;
  status: RequestStatus;
  notes: string | null;
  submittedAt: string;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
  company: ApiCompany;
  documents: ApiDocument[];
}
export type Role = "EXPORTER" | "ADMIN" | "OBSERVATOR" | "DIWAN_MEMBER"

export interface ApiNotification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
export interface ApiCompany {
  commName: string;
  rne: string; 
  matFisc: string;
  governorate: string;
  isRented: boolean;
  user: {
    name: string;
    email: string;
  };
}