import { UIFieldServerComponent, UIFieldServerProps } from "payload";
import UpdateClerkUserRoles from "./update-clerk-user-roles";
import { checkRoles } from "@/lib/payload/auth-utils";
import { SUPER_ADMIN_ROLES } from "@/collections/lib/constants";
import { clerkClient } from "@clerk/nextjs/server";

export const UpdateClerkUserRolesField: UIFieldServerComponent = async ({
  data,
}: UIFieldServerProps) => {
  const isAuthorised = await checkRoles(SUPER_ADMIN_ROLES);

  const client = await clerkClient();

  let clerkUser;
  try {
    clerkUser = await client.users.getUser(data.userId);
  } catch (exception) {
    console.error(exception);
    return null;
  }

  return (
    <UpdateClerkUserRoles isAuthorised={isAuthorised} userId={clerkUser.id}   roles={clerkUser.publicMetadata.roles as Array<string>} />
  );
};

export default UpdateClerkUserRolesField;
