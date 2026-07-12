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

export interface ApiCompany {
  commName: string;
  matFisc: string;
  governorate: string;
  isRented: boolean;
  user: {
    name: string;
    email: string;
  };
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
 
// add to existing file
export interface ApiNotification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}