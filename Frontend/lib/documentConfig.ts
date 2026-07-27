import { DocType } from "@/types/registration";

export const DOCUMENT_LABELS: Record<DocType, { fr: string; ar: string }> = {
  RNE: { fr: "Registre National des Entreprises", ar: "السجل الوطني للمؤسسات" },
  TAXREALTED: { fr: "Attestation fiscale", ar: "شهادة جبائية" },
  DIWAN: { fr: "Identifiant Diwani / Douane", ar: "معرف الديواني" },
  QUITTANCE: { fr: "Quittance", ar: "وصل الخلاص" },
  EXISTANCEDECLARATION: { fr: "Déclaration d'existence", ar: "تصريح بالوجود" },
  RENTEDDECLARATION: { fr: "Déclaration de location", ar: "تصريح الكراء" },
  CERTIFICATIONOWNERSHIP: { fr: "Certificat de propriété", ar: "شهادة الملكية" },
  LABDOC: { fr: "Document du laboratoire", ar: "وثيقة المخبر" },
  MARKETCONTROLDECLARATION: {
    fr: "Déclaration d'activité auprès du bureau de contrôle des performances",
    ar: "تصريح بالنشاط لدى مكتب مراقبة الأداءات",
  },
};

export function getRequiredDocTypes(isRented: boolean, isResident: boolean): DocType[] {
  const base: DocType[] = ["RNE","DIWAN", "TAXREALTED", "LABDOC"];

  const withResidency : DocType[] = isResident
    ? [...base,"QUITTANCE","EXISTANCEDECLARATION"]
    : [...base, "MARKETCONTROLDECLARATION"];

  return isRented
    ? [...withResidency, "RENTEDDECLARATION"]
    : [...withResidency, "CERTIFICATIONOWNERSHIP"];
}