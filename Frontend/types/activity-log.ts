
export interface ApiActivityLog {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ActivityLogsResponse {
  logs: ApiActivityLog[];
  total: number;
  page: number;
  totalPages: number;
  availableActions: string[];
}