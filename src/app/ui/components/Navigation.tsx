'use client';

import { SignedIn, SignedOut, useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';

export default function Navigation() {
  const pathname = usePathname();

  const posthog = usePostHog();
  const user = useUser();

  if (user.isSignedIn) {
    posthog.identify(user.user.id, {
      email: user.user.primaryEmailAddress?.emailAddress,
      name: user.user.fullName,
    });
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center flex-grow">
      <div className="flex w-full md:w-auto">
        <Link className="flex items-center gap-2" href="/">
        <Image src="/images/logo.svg" width={32} height={32} alt="WayStation" className="h-8 w-8" />
        <p className="text-2xl font-bold aurora-text">WayStation</p>
        </Link>
        <div id="profile" className="md:hidden ml-auto">
          <SignedOut>
            <Link href="/sign-in" className="aurora-btn px-4 py-2 text-sm font-bold rounded hover:scale-105 transition-transform duration-300 w-auto text-center">
              Get Early Access
            </Link>
          </SignedOut>
          <SignedIn>
            <div className="flex items-center gap-4">
              {pathname !== '/dashboard' && (
                <Link href="/dashboard" className="aurora-btn px-4 py-2 text-sm font-medium rounded-lg hover:scale-105 transition-transform duration-300 w-auto text-center">
                  Dashboard
                </Link>
              )}
              <UserButton/>
            </div>
          </SignedIn>
        </div>
      </div>

      <div id="profile" className="hidden md:block md:ml-auto">
        <SignedOut>
          <Link href="/sign-in" className="aurora-btn px-4 py-2 text-sm font-bold rounded hover:scale-105 transition-transform duration-300 w-auto text-center">
            Sign Up Free
          </Link>
        </SignedOut>
        <SignedIn>
          <div className="flex items-center gap-4">
            {pathname !== '/dashboard' && (
              <Link href="/dashboard" className="aurora-btn px-4 py-2 text-sm font-medium rounded-lg hover:scale-105 transition-transform duration-300 w-auto text-center">
                Dashboard
              </Link>
            )}
            <UserButton/>
          </div>
        </SignedIn>
      </div>
    </div>
  )
}
