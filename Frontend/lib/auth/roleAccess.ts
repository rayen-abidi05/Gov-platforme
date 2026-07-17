
import { Role } from "@/types/registration";


export const ROLE_HOME_ROUTE: Record<Role, string> = {
  EXPORTER: "/",
  ADMIN: "/dashboard",
  OBSERVATOR: "/",
  DIWAN_MEMBER: "/exporters", 
};


export const SECTION_ALLOWED_ROLES = {
  publicHome: ["EXPORTER"] as Role[],
  exporterArea: ["EXPORTER"] as Role[],
  adminArea: ["ADMIN"] as Role[],
  diwanArea: ["DIWAN_MEMBER"] as Role[],
};