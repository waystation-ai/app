import { checkRoles } from "@/lib/payload/auth-utils";
import { ADMIN_ROLES } from "@/constants/auth";

export const isAdminRoles = () => checkRoles(ADMIN_ROLES);
