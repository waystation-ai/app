import { checkRoles } from "@/lib/payload/auth-utils";
import { ADMIN_ENABLED_ROLES } from "@/collections/lib/constants";

export const isAdminEnabledRoles = () => checkRoles(ADMIN_ENABLED_ROLES);
