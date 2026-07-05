export type UserRole = "exporter" | "admin";

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

/** Where each role lands after a successful sign-in. */
export const ROLE_REDIRECTS: Record<UserRole, string> = {
  exporter: "/dashboard/exporter",
  admin: "/dashboard/admin",
};