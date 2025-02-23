'use client';

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from 'next/navigation';

export default function Partners() {
  const pathname = usePathname();
  return (
    <div className="flex items-center justify-between flex-grow">
      <nav className="flex items-center gap-3">
        <span className="ml-12 text-sm font-medium text-gray-500">Works with</span>
        <Link href='/connect/chatgpt' className="text-sm font-medium hover:text-blue-600 transition-colors">ChatGPT</Link>
        <Link href='/connect/claude' className="text-sm font-medium hover:text-blue-600 transition-colors">Claude</Link>
        <Link href='/connect/mcp-server' className="text-sm font-medium hover:text-blue-600 transition-colors">Any MCP Host</Link>
      </nav>
      <div id="profile">
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
