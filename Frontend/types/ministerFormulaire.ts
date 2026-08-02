import { ApiDocument } from "./registration";

export type FormulaireStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ApiMinisterFormulaire {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  requestText: string;
  notes: string | null;
  submittedAt: string;
  reviewedAt: string | null;
  registrationRequest: {
    id: string;
    documents: ApiDocument[]; 
    company: {
      commName: string;
      rne: string;
      matFisc: string;
      nationality: string;
      user: { name: string; email: string };
    };
  };
}