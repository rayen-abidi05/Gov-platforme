import {  DocType } from "@/types/registration";

const ALL_DOC_TYPES: DocType[] = [
  "RNE",
  "TAXREALTED",
  "DIWAN",
  "QUITTANCE",
  "EXISTANCEDECLARATION",
  "LABDOC",
];

function makeDocs(id: string, isRented: boolean, count: number) {
  const types = [...ALL_DOC_TYPES, isRented ? "RENTEDDECLARATION" : "CERTIFICATIONOWNERSHIP"] as DocType[];
  return types.slice(0, count).map((type, i) => ({
    id: `${id}-doc-${i}`,
    type,
    fileName: `${type.toLowerCase()}.pdf`,
    fileUrl: "#",
    uploadedAt: "2026-06-01T10:00:00Z",
  }));
}

