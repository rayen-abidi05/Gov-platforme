import { RegistrationRequestRow, DocType } from "@/types/registration";

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

export const MOCK_REQUESTS: RegistrationRequestRow[] = [
  {
    id: "req_1",
    companyName: "Huilerie El Baraka",
    ownerName: "Ahmed Ben Salah",
    email: "ahmed@elbaraka.tn",
    matFisc: "1234567/A/M/000",
    governorate: "Sfax",
    isRented: true,
    submittedAt: "2026-07-08T09:30:00Z",
    status: "PENDING",
    documents: makeDocs("req_1", true, 7),
  },
  {
    id: "req_2",
    companyName: "Oliveraie du Sud",
    ownerName: "Salma Trabelsi",
    email: "salma@oliveraiedusud.tn",
    matFisc: "2234567/B/M/000",
    governorate: "Sousse",
    isRented: false,
    submittedAt: "2026-06-22T14:10:00Z",
    status: "UNDER_REVIEW",
    documents: makeDocs("req_2", false, 7),
  },
  {
    id: "req_3",
    companyName: "Terres d'Or",
    ownerName: "Karim Bouzid",
    email: "karim@terresdor.tn",
    matFisc: "3234567/C/M/000",
    governorate: "Sfax",
    isRented: true,
    submittedAt: "2026-06-15T08:00:00Z",
    status: "APPROVED",
    documents: makeDocs("req_3", true, 7),
  },
  {
    id: "req_4",
    companyName: "Zeitoun Export",
    ownerName: "Nadia Cherif",
    email: "nadia@zeitounexport.tn",
    matFisc: "4234567/D/M/000",
    governorate: "Kairouan",
    isRented: false,
    submittedAt: "2026-05-30T11:45:00Z",
    status: "REJECTED",
    notes: "Le certificat de propriété fourni est illisible.",
    documents: makeDocs("req_4", false, 6),
  },
  {
    id: "req_5",
    companyName: "Or Vert Tunisien",
    ownerName: "Mehdi Gharbi",
    email: "mehdi@orverttn.tn",
    matFisc: "5234567/E/M/000",
    governorate: "Monastir",
    isRented: true,
    submittedAt: "2026-05-12T16:20:00Z",
    status: "APPROVED",
    documents: makeDocs("req_5", true, 7),
  },
  {
    id: "req_6",
    companyName: "AgroTun Huiles",
    ownerName: "Ines Mabrouk",
    email: "ines@agrotun.tn",
    matFisc: "6234567/F/M/000",
    governorate: "Sfax",
    isRented: false,
    submittedAt: "2026-04-18T10:00:00Z",
    status: "PENDING",
    documents: makeDocs("req_6", false, 5),
  },
];