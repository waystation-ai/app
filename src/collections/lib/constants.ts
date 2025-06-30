import { Role } from "@/types/globals";

export const SUPER_ADMIN_ROLE = "super-admin";

export const ADMIN_ROLE = "admin";

export const ALL_ROLES = [SUPER_ADMIN_ROLE, ADMIN_ROLE] as const;

export const ADMIN_ROLES: Role[] = [SUPER_ADMIN_ROLE, ADMIN_ROLE] as const;

export const SUPER_ADMIN_ROLES: Role[] = [SUPER_ADMIN_ROLE] as const;
