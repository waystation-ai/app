import { Role } from "@/types/globals";
import { auth } from "@clerk/nextjs/server";


export const checkRolesUtil = (rolesToCheck: Role[] = [], userRoles: Role[] = []) => {
  if (Array.isArray(userRoles) && userRoles.length > 0) {
    if (
      rolesToCheck.some((checkRole) => {
        return userRoles.some((userRole) => userRole === checkRole);
      })
    ) {
      return true;
    }
  }

  return false;
};


export const checkRoles = async (rolesToCheck: Role[] = []) => {
  const { sessionClaims } = await auth();

  return checkRolesUtil(rolesToCheck, sessionClaims?.metadata?.roles);
};
