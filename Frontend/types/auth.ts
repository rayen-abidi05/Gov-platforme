 type UserRole = "EXPORTER" | "ADMIN" | "OBSERVATOR" | "DIWAN_MEMBER" | "MINISTER" | "INSPA" | "COMMITTEE_MEMBER"

export interface AuthenticatedUser {
  id: string;
  fullName: string;
  role: UserRole;
  email: string;
  rne?: string;
}

export interface LoginResponse {
  success: boolean;
  user?: AuthenticatedUser;
  message?: string;
}
