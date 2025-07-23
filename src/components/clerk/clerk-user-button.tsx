"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import React from "react";
import { SUPER_ADMIN_ROLES } from "@/collections/lib/constants";
import { checkRoles } from "@/lib/payload/auth-utils";
import { Settings } from 'lucide-react';

export const ClerkUserButton: React.FC = async () => {
  const isAdminEnabledRole = await checkRoles(SUPER_ADMIN_ROLES);

  return (
    <>
      <SignedOut>
        <SignInButton>
          <button className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-neutral-50">
            Sign in
          </button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton userProfileMode="navigation" userProfileUrl="/profile">
          {isAdminEnabledRole && (
            <UserButton.MenuItems>
              <UserButton.Link
                label="Admin panel"
                labelIcon={<Settings />}
                href="/admin"
              />
            </UserButton.MenuItems>
          )}
        </UserButton>
      </SignedIn>
    </>
  );
};

export default ClerkUserButton;
