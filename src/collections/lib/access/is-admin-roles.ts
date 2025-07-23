import { checkRoles } from "@/lib/payload/auth-utils";
import { ADMIN_ROLES } from "@/collections/lib/constants";

export const isAdminRoles = () => checkRoles(ADMIN_ROLES);
