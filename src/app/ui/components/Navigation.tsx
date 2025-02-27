'use client';

import { SignedIn, SignedOut, useAuth, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';

export default function Navigation() {
  const pathname = usePathname();

  const posthog = usePostHog();
  const auth = useAuth();

  if (auth.userId) {
    posthog.identify(auth.userId);
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center flex-grow">
      <div className="flex w-full md:w-auto">
        <Link className="flex items-center gap-2" href="/">
        <Image src="/images/logo.svg" width={32} height={32} alt="WayStation" className="h-8 w-8" />
        <h1 className="text-2xl font-bold aurora-text">WayStation</h1>
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

      <nav className="flex items-center gap-4 mt-4 md:mt-0 md:ml-8">
        <span className="md:ml-8 lg:ml-20 text-sm font-medium text-gray-500">Works with</span>
        <Link href='/connect/chatgpt' className="app-link">
          <Image src='/images/apps/chatgpt.svg' width={20} height={20} alt="ChatGPT"/>
          <span>ChatGPT</span>
        </Link>
        <Link href='/connect/claude' className="app-link">
          <Image src='/images/apps/claude.svg' width={20} height={20} alt="Claude"/>
          <span>Claude</span>
        </Link>
        <Link href='/connect/mcp-server' className="app-link">
          <Image src="/images/apps/mcp.svg" width={20} height={20} alt="MCP Host" />
          <span>Any MCP host</span>
        </Link>
      </nav>
      <div id="profile" className="hidden md:block md:ml-auto">
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
  )
}
