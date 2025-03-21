'use client';

import { SignedIn, SignedOut, useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';
import { useState } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const posthog = usePostHog();
  const user = useUser();

  if (user.isSignedIn) {
    posthog.identify(user.user.id, {
      email: user.user.primaryEmailAddress?.emailAddress,
      name: user.user.fullName,
    });
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center flex-grow">
      <div className="flex w-full md:w-auto items-center">
        <Link className="flex items-center gap-2" href="/">
          <Image src="/images/logo.svg" width={32} height={32} alt="WayStation" className="h-8 w-8" />
          <p className="text-2xl font-bold aurora-text">WayStation</p>
        </Link>
        
        {/* Dashboard button always visible on mobile */}
        <div className="md:hidden ml-auto mr-4">
          <SignedIn>
            {pathname !== '/dashboard' && (
              <Link href="/dashboard" className="aurora-btn px-4 py-2 text-sm font-medium rounded-lg hover:scale-105 transition-transform duration-300 w-auto text-center">
                Dashboard
              </Link>
            )}
          </SignedIn>
        </div>
        
        {/* Hamburger menu button for mobile */}
        <button 
          className="md:hidden flex flex-col justify-center items-center gap-1.5"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-gray-800 transition-transform duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-gray-800 transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
          <span className={`block w-6 h-0.5 bg-gray-800 transition-transform duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex items-center gap-6 mx-8">
        <Link href="/connect/claude" className="app-link">
          <Image src="/images/apps/claude.svg" width={20} height={20} alt="Claude" />
          <span>Marketplace for Claude</span>
        </Link>
        <Link href="/connect/mcp-server" className="app-link">
          <Image src="/images/apps/mcp.svg" width={20} height={20} alt="MCP" />
          <span>Universal MCP</span>
        </Link>
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
      
      {/* Mobile Navigation Menu */}
      <div className={`md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${mobileMenuOpen ? 'max-h-96 py-4' : 'max-h-0'}`}>
        <div className="flex flex-col gap-4 px-6">
          <Link 
            href="/connect/claude" 
            className="app-link py-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Image src="/images/apps/claude.svg" width={20} height={20} alt="Claude" />
            <span>Marketplace for Claude</span>
          </Link>
          <Link 
            href="/connect/mcp-server" 
            className="app-link py-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Image src="/images/apps/mcp.svg" width={20} height={20} alt="MCP" />
            <span>Universal MCP</span>
          </Link>
          
          {/* User Profile in Mobile Menu */}
          <div className="border-t border-gray-200 mt-2 pt-4">
            <SignedOut>
              <Link 
                href="/sign-in" 
                className="aurora-btn px-4 py-2 text-sm font-bold rounded hover:scale-105 transition-transform duration-300 w-full text-center block"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Early Access
              </Link>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Your Account</span>
                <UserButton/>
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </div>
  );
}
