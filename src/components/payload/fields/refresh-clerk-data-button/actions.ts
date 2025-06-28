"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { checkRoles } from "@/lib/payload/auth-utils";
import { SUPER_ADMIN_ROLES } from "@/collections/lib/constants";
import { getPayload } from "payload";
import configPromise from "@payload-config";

export interface RefreshClerkDataState {
  isError: boolean;
  message: string;
}

export async function refreshClerkData(userId: string): Promise<RefreshClerkDataState> {
  if (!(await checkRoles(SUPER_ADMIN_ROLES))) {
    return {
      isError: true,
      message: "Not Authorized",
    };
  }

  const payload = await getPayload({
    config: configPromise,
  });

  const payloadUser =
    (
      await payload.find({
        collection: "users",
        where: {
          userId: {
            equals: userId,
          },
        },
      })
    ).docs[0] ?? null;
  if (!payloadUser) {
    return {
      isError: true,
      message: "Payload user not found",
    };
  }

  const client = await clerkClient();

  let clerkUser;
  try {
    clerkUser = await client.users.getUser(userId);
  } catch (exception) {
    console.error(exception);
    return {
      isError: true,
      message: "Error retrieving Clerk user",
    };
  }

  const emailAddresses = [
    ...new Set(
      clerkUser.emailAddresses.map(
        (userEmailAddress) => userEmailAddress.emailAddress,
      ),
    ),
  ];
  const phoneNumbers = [
    ...new Set(
      clerkUser.phoneNumbers.map(
        (userPhoneNumber) => userPhoneNumber.phoneNumber,
      ),
    ),
  ];

  await payload.update({
    collection: "users",
    id: payloadUser.id,
    data: {
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      emailAddresses,
      phoneNumbers,
    },
  });

  revalidatePath(`/admin/account`);
  revalidatePath(`/admin/collections/users/${payloadUser.id}`);

  return {
    isError: false,
    message: "Clerk data refreshed successfully",
  };
}
