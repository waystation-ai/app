"use client";

import React from "react";
import Link from "next/link";
import { SUPER_ADMIN_ROLES } from "@/collections/lib/constants";
import { checkRoles } from "@/lib/payload/auth-utils";

export const ClerkUsersLink: React.FC = () => {

  if (!checkRoles(SUPER_ADMIN_ROLES)) {
    return null;
  }

  return <Link href="/admin/clerk-users">Clerk users</Link>;
};

export default ClerkUsersLink;
