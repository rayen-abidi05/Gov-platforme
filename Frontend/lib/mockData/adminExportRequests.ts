import { ExportRequest } from "@/types/exportRequest";

export const MOCK_ADMIN_EXPORT_REQUESTS: ExportRequest[] = [
  {
    id: "exp_1",
    client: "Acétites Coosur S.A. (Espagne)",
    agrim: { reference: "2026-001", limitKg: 50000, consumedKg: 31500, requestedKg: 8000 },
    documents: [
      { id: "d1", label: "AGRIM", fileName: "agrim_2026-001.pdf", fileUrl: "#" },
      { id: "d2", label: "CONTRACT", fileName: "contrat_coosur.pdf", fileUrl: "#" },
      { id: "d3", label: "MINISTERIAL_LETTER", fileName: "demande_autorisation.pdf", fileUrl: "#" },
    ],
    status: "UNDER_COMMITTEE_REVIEW",
    submittedAt: "2026-07-18T09:00:00Z",
  },
  {
    id: "exp_2",
    client: "Olive Trade GmbH (Allemagne)",
    agrim: { reference: "2026-002", limitKg: 20000, consumedKg: 20000, requestedKg: 6000 },
    documents: [
      { id: "d4", label: "AGRIM", fileName: "agrim_2026-002.pdf", fileUrl: "#" },
      { id: "d5", label: "CONTRACT", fileName: "contrat_olivetrade.pdf", fileUrl: "#" },
      { id: "d6", label: "MINISTERIAL_LETTER", fileName: "demande_autorisation2.pdf", fileUrl: "#" },
    ],
    status: "APPROVED",
    submittedAt: "2026-07-05T11:30:00Z",
  },
  {
    id: "exp_3",
    client: "Nordic Oils AB (Suède)",
    agrim: { reference: "2026-003", limitKg: 15000, consumedKg: 15000, requestedKg: 15000 },
    documents: [
      { id: "d7", label: "AGRIM", fileName: "agrim_2026-003.pdf", fileUrl: "#" },
      { id: "d8", label: "CONTRACT", fileName: "contrat_nordic.pdf", fileUrl: "#" },
      { id: "d9", label: "MINISTERIAL_LETTER", fileName: "demande_autorisation3.pdf", fileUrl: "#" },
    ],
    status: "REJECTED",
    submittedAt: "2026-06-20T14:00:00Z",
  },
  {
    id: "exp_4",
    client: "Bella Toscana Import (Italie)",
    agrim: { reference: "2026-001", limitKg: 50000, consumedKg: 31500, requestedKg: 5000 },
    documents: [
      { id: "d10", label: "AGRIM", fileName: "agrim_2026-001b.pdf", fileUrl: "#" },
      { id: "d11", label: "CONTRACT", fileName: "contrat_bellatoscana.pdf", fileUrl: "#" },
      { id: "d12", label: "MINISTERIAL_LETTER", fileName: "demande_autorisation4.pdf", fileUrl: "#" },
    ],
    status: "SENT",
    submittedAt: "2026-07-25T08:20:00Z",
  },
  {
    id: "exp_5",
    client: "Nordic Oils AB (Suède)",
    agrim: { reference: "2026-004", limitKg: 30000, consumedKg: 12000, requestedKg: 12000 },
    documents: [
      { id: "d13", label: "AGRIM", fileName: "agrim_2026-004.pdf", fileUrl: "#" },
      { id: "d14", label: "CONTRACT", fileName: "contrat_nordic2.pdf", fileUrl: "#" },
      { id: "d15", label: "MINISTERIAL_LETTER", fileName: "demande_autorisation5.pdf", fileUrl: "#" },
    ],
    status: "APPROVED",
    submittedAt: "2026-06-02T10:00:00Z",
  },
  {
    id: "exp_6",
    client: "MedOil France SARL",
    agrim: { reference: "2026-005", limitKg: 10000, consumedKg: 4000, requestedKg: 4000 },
    documents: [
      { id: "d16", label: "AGRIM", fileName: "agrim_2026-005.pdf", fileUrl: "#" },
      { id: "d17", label: "CONTRACT", fileName: "contrat_medoil.pdf", fileUrl: "#" },
      { id: "d18", label: "MINISTERIAL_LETTER", fileName: "demande_autorisation6.pdf", fileUrl: "#" },
    ],
    status: "UNDER_COMMITTEE_REVIEW",
    submittedAt: "2026-07-22T13:45:00Z",
  },
];