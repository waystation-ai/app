'use client';

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from 'next/navigation';

export default function Partners() {
  const pathname = usePathname();
  return (
    <div>
      <div>
        <Link href='/connect/chatgpt'>ChatGPT</Link>
        <Link href='/connect/claude'>Claude</Link>
        <Link href='/connect/mcp-server'>Any MCP Host</Link>
      </div>
      <div>
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