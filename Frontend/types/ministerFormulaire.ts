
export type FormulaireStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ApiMinisterFormulaire {
  id: string;
  status: FormulaireStatus;
  requestText: string;
  notes: string | null;
  submittedAt: string;
  reviewedAt: string | null;
  registrationRequest: {
    id: string;
    company: {
      commName: string;
      rne: string;
      nationality: string;
      matFisc: string;
      user: { name: string; email: string };
    };
  };
}