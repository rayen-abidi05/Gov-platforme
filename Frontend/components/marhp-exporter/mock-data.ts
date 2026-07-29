  import type {
  ExportRequestDetail,
  ExportRequestSummary,
  ExporterProfile,
  NotificationItem,
} from "./types";

export const mockProfile: ExporterProfile = {
  companyName: "Sté Oléa Carthage SARL",
  category: "resident",
  liste: "liste_1",
  registrationStatus: "approuvee",
  matriculeFiscal: "1234567/A/M/000",
};

export const mockRequests: ExportRequestSummary[] = [
  {
    id: "req_001",
    reference: "EXP-2026-000142",
    type: "dakhil_hissa",
    clientName: "Mediterranea Foods SpA",
    destinationCountry: "Italie",
    quantityKg: 24000,
    productForm: "vrac",
    agrim: {
      reference: "AGRIM-2026-0087",
      totalKg: 120000,
      remainingKg: 61500,
      expiresAt: "2026-12-31",
    },
    status: "examen_instance",
    submittedAt: "2026-07-18T09:12:00Z",
  },
  {
    id: "req_002",
    reference: "EXP-2026-000138",
    type: "dakhil_hissa",
    clientName: "Olive & Co Trading LLC",
    destinationCountry: "Émirats arabes unis",
    quantityKg: 8000,
    productForm: "conditionne",
    agrim: {
      reference: "AGRIM-2026-0084",
      totalKg: 60000,
      remainingKg: 12000,
      expiresAt: "2026-10-15",
    },
    status: "approuvee",
    submittedAt: "2026-06-30T14:44:00Z",
  },
  {
    id: "req_003",
    reference: "EXP-2026-000131",
    type: "kharij_hissa",
    clientName: "North Star Distributors",
    destinationCountry: "États-Unis",
    quantityKg: 15000,
    productForm: "conditionne",
    status: "approuvee",
    submittedAt: "2026-06-12T08:20:00Z",
  },
  {
    id: "req_004",
    reference: "EXP-2026-000119",
    type: "dakhil_hissa",
    clientName: "Andalus Import",
    destinationCountry: "Espagne",
    quantityKg: 5000,
    productForm: "vrac",
    agrim: {
      reference: "AGRIM-2026-0079",
      totalKg: 40000,
      remainingKg: 0,
      expiresAt: "2026-09-01",
    },
    status: "rejetee",
    submittedAt: "2026-05-22T11:05:00Z",
  },
];

export const mockRequestDetail: ExportRequestDetail = {
  ...mockRequests[0],
  updatedAt: "2026-07-24T10:00:00Z",
  documents: [
    {
      id: "doc_1",
      name: "AGRIM-2026-0087.pdf",
      kind: "agrim",
      sizeKb: 412,
      uploadedAt: "2026-07-18T09:10:00Z",
    },
    {
      id: "doc_2",
      name: "Contrat_Mediterranea_2026.pdf",
      kind: "contrat",
      sizeKb: 986,
      uploadedAt: "2026-07-18T09:11:00Z",
    },
    {
      id: "doc_3",
      name: "Autorisation_Ministerielle_142.pdf",
      kind: "autorisation_ministerielle",
      sizeKb: 233,
      uploadedAt: "2026-07-18T09:12:00Z",
    },
  ],
};

export const mockNotifications: NotificationItem[] = [
  {
    id: "n1",
    title: "Demande EXP-2026-000142 en examen",
    titleAr: "الطلب قيد الدراسة من قبل الهيئة",
    body: "Votre demande est actuellement examinée par l'instance.",
    createdAt: "2026-07-24T08:00:00Z",
    read: false,
  },
  {
    id: "n2",
    title: "Demande EXP-2026-000138 approuvée",
    titleAr: "تمت الموافقة على الطلب",
    body: "Votre demande a été approuvée. Vous pouvez procéder à l'exportation.",
    createdAt: "2026-07-02T12:00:00Z",
    read: false,
  },
  {
    id: "n3",
    title: "Inscription confirmée — Liste 1",
    titleAr: "تم تأكيد التسجيل",
    body: "Vous figurez sur la Liste 1 des exportateurs résidents.",
    createdAt: "2026-05-10T09:00:00Z",
    read: true,
  },
];
