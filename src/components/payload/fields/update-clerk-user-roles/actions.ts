"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { checkRoles } from "@/lib/payload/auth-utils";
import { SUPER_ADMIN_ROLES } from "@/collections/lib/constants";

export interface UpdateClerkUserRolesState {
  isError: boolean;
  message: string;
}

export async function updateClerkUserRoles(userId: string, roles: string[] = []): Promise<UpdateClerkUserRolesState> {
  if (!(await checkRoles(SUPER_ADMIN_ROLES))) {
    return {
      isError: true,
      message: "Not Authorized",
    };
  }

  const client = await clerkClient();

  try {
    await client.users.updateUser(userId, {
      publicMetadata: { roles },
    });
  } catch (exception) {
    console.error(exception);
    return {
      isError: true,
      message: "Error updating Clerk user",
    };
  }

  revalidatePath(`/admin/account`);
  revalidatePath(`/admin/collections/users/${userId}`);
  revalidatePath("/admin/clerk-users");

  return {
    isError: false,
    message: "Roles updated successfully.",
  };
}
