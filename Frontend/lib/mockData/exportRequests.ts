import { ExportRequest } from "@/types/exportRequest";

export const MOCK_EXPORT_REQUESTS: ExportRequest[] = [
  {
    id: "exp_1",
    client: "Acétites Coosur S.A. (Espagne)",
    agrim: { reference: "20FFFF1", limitKg: 800, consumedKg: 200, requestedKg: 200 },
    documents: [
      { id: "d1", label: "AGRIM", fileName: "agrim_20ffff1.pdf", fileUrl: "#" },
      { id: "d2", label: "CONTRACT", fileName: "contrat_coosur.pdf", fileUrl: "#" },
      { id: "d3", label: "MINISTERIAL_LETTER", fileName: "demande_autorisation.pdf", fileUrl: "#" },
    ],
    status: "UNDER_COMMITTEE_REVIEW",
    submittedAt: "2026-07-10T09:00:00Z",
  },
  {
    id: "exp_2",
    client: "Olive Trade GmbH (Allemagne)",
    agrim: { reference: "20AABB4", limitKg: 500, consumedKg: 500, requestedKg: 150 },
    documents: [
      { id: "d4", label: "AGRIM", fileName: "agrim_20aabb4.pdf", fileUrl: "#" },
      { id: "d5", label: "CONTRACT", fileName: "contrat_olivetrade.pdf", fileUrl: "#" },
      { id: "d6", label: "MINISTERIAL_LETTER", fileName: "demande_autorisation2.pdf", fileUrl: "#" },
    ],
    status: "APPROVED",
    submittedAt: "2026-06-28T11:30:00Z",
  },
  {
    id: "exp_3",
    client: "Nordic Oils AB (Suède)",
    agrim: { reference: "20CCDD9", limitKg: 300, consumedKg: 300, requestedKg: 300 },
    documents: [
      { id: "d7", label: "AGRIM", fileName: "agrim_20ccdd9.pdf", fileUrl: "#" },
      { id: "d8", label: "CONTRACT", fileName: "contrat_nordic.pdf", fileUrl: "#" },
      { id: "d9", label: "MINISTERIAL_LETTER", fileName: "demande_autorisation3.pdf", fileUrl: "#" },
    ],
    status: "REJECTED",
    submittedAt: "2026-06-15T14:00:00Z",
  },
];