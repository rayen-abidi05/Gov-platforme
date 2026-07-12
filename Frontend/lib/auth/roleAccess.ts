
import { Role } from "@/types/registration";


export const ROLE_HOME_ROUTE: Record<Role, string> = {
  EXPORTER: "/",
  ADMIN: "/dashboard",
  OBSERVATOR: "/", 
  DIWAN_MEMBER: "/", 
};


export const SECTION_ALLOWED_ROLES = {
  
  exporterArea: ["EXPORTER"] as Role[], 
  adminArea: ["ADMIN"] as Role[], 
};