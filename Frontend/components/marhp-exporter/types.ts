// Shared domain types for the MARHP exporter space.
// Swap these into your existing types file if you already have equivalents.

export type RegistrationStatus =
  | "envoyee"
  | "en_cours_examen"
  | "approuvee"
  | "rejetee";

export type ExportRequestStatus =
  | "envoyee"
  | "examen_instance"
  | "approuvee"
  | "rejetee";

export type ExporterCategory = "resident" | "non_resident";
export type ExporterListe = "liste_1" | "liste_2" | null;
export type ExportRequestType = "dakhil_hissa" | "kharij_hissa"; // داخل / خارج الحصة
export type ProductForm = "vrac" | "conditionne";

export interface AgrimCertificate {
  reference: string;
  totalKg: number;
  remainingKg: number;
  expiresAt: string; // ISO
}

export interface UploadedDocument {
  id: string;
  name: string;
  kind: "agrim" | "contrat" | "autorisation_ministerielle" | "autre";
  sizeKb: number;
  uploadedAt: string; // ISO
  url?: string;
}

export interface ExportRequestSummary {
  id: string;
  reference: string;
  type: ExportRequestType;
  clientName: string;
  destinationCountry?: string;
  quantityKg: number;
  productForm: ProductForm;
  agrim?: AgrimCertificate;
  status: ExportRequestStatus;
  submittedAt: string; // ISO
}

export interface ExportRequestDetail extends ExportRequestSummary {
  documents: UploadedDocument[];
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  titleAr?: string;
  body: string;
  createdAt: string;
  read: boolean;
}

export interface ExporterProfile {
  companyName: string;
  category: ExporterCategory;
  liste: ExporterListe;
  registrationStatus: RegistrationStatus;
  matriculeFiscal: string;
}
