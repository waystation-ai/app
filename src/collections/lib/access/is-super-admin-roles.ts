import { checkRoles } from "@/lib/payload/auth-utils";
import { SUPER_ADMIN_ROLES } from "@/constants/auth";

export const isSuperAdminRoles = () => checkRoles(SUPER_ADMIN_ROLES);
