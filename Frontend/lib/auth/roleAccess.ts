
import { Role } from "@/types/registration";


export const ROLE_HOME_ROUTE: Record<Role, string> = {
  EXPORTER: "/",
  ADMIN: "/dashboard",
  OBSERVATOR: "/observer",
  DIWAN_MEMBER: "/exporters", 
  MINISTER : "/minister",
  INSPA : "/inspa/dashboard",
};


export const SECTION_ALLOWED_ROLES = {
  publicHome: ["EXPORTER"] as Role[],
  exporterArea: ["EXPORTER"] as Role[],
  adminArea: ["ADMIN"] as Role[],
  diwanArea: ["DIWAN_MEMBER"] as Role[],
  ministerArea: ["MINISTER"] as Role[],
  observerArea : ["OBSERVATOR"] as Role[],
  inspaArea : ["INSPA"] as Role[],
};