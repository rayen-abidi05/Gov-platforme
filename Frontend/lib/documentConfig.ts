export type DocType =
  | "RNE"
  | "TAXREALTED"
  | "DIWAN"
  | "QUITTANCE"
  | "EXISTANCEDECLARATION"
  | "RENTEDDECLARATION"
  | "CERTIFICATIONOWNERSHIP"
  | "LABDOC";

export const DOCUMENT_LABELS: Record<DocType, { fr: string; ar: string }> = {
  RNE: { fr: "Registre National des Entreprises", ar: "السجل الوطني للمؤسسات" },
  TAXREALTED: { fr: "Attestation fiscale", ar: "شهادة جبائية" },
  DIWAN: { fr: "Document Diwan / Douane", ar: "وثيقة الديوانة" },
  QUITTANCE: { fr: "Quittance", ar: "وصل الخلاص" },
  EXISTANCEDECLARATION: { fr: "Déclaration d'existence", ar: "تصريح بالوجود" },
  RENTEDDECLARATION: { fr: "Déclaration de location", ar: "تصريح الكراء" },
  CERTIFICATIONOWNERSHIP: { fr: "Certificat de propriété", ar: "شهادة الملكية" },
  LABDOC: { fr: "Document du laboratoire", ar: "وثيقة المخبر" },
};

export function getRequiredDocTypes(isRented: boolean): DocType[] {
  const base: DocType[] = [
    "RNE",
    "TAXREALTED",
    "DIWAN",
    "QUITTANCE",
    "EXISTANCEDECLARATION",
    "LABDOC",
  ];
  return isRented ? [...base, "RENTEDDECLARATION"] : [...base, "CERTIFICATIONOWNERSHIP"];
}