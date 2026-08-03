export interface InstanceMemberDetail {
  id: string;
  user: {
    id: string;
    name: string;
    role: string;
  };
}
export interface CommitteeMember {
  id:string;
  name:string;
  email:string;
  role:"COMMITTEE_MEMBER";
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
  internalNotes?: string | null;

  reportDocument?: {
    id: string;
    fileName: string;
    fileType: string;
    fileUrl: string;
    size: number;
  } | null;

  members: InstanceMemberDetail[];

  exportRequests: InstanceExportRequestSummary[];

  createdAt: string;
}