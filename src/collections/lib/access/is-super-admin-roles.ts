import { checkRoles } from "@/lib/payload/auth-utils";
import { SUPER_ADMIN_ROLES } from "@/collections/lib/constants";

export const isSuperAdminRoles = () => checkRoles(SUPER_ADMIN_ROLES);
