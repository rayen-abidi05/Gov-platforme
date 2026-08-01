export interface InstanceMemberDetail {
  id: string;
  user: {
    id: string;
    name: string;
    role: string;
  };
}

export interface InstanceExportRequestSummary {
  id: string;
  client: string;
  requestedKg: number;
  status: "SENT" | "UNDER_COMMITTEE_REVIEW" | "APPROVED" | "REJECTED";
  agrim: { reference: string };
}

export interface AdminInstance {
  id: string;
  meetingDate: string;
  reportFileUrl?: string | null;
  internalNotes?: string | null;
  members: InstanceMemberDetail[];
  exportRequests: InstanceExportRequestSummary[];
  createdAt: string;
}