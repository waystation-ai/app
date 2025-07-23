'use client';

import { SignedIn, SignedOut, useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';
import { useState } from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import React from "react";
import { LayoutDashboard, MessageSquareText, Plug } from "lucide-react";


export function Menu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] mb-0">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                    <a className="flex h-full w-full select-none flex-col justify-start rounded-md bg-gradient-to-tr from-[#609aff]/30 via-white to-[#00e6a9]/20 p-6 no-underline outline-none focus:shadow-md">
                    <div className="mb-2 text-lg font-medium">
                      Our Products
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      WayStation is a suite of products that helps you connect your everyday apps and LLM products you use.
                    </p>
                    </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="/connect/claude" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                  <div className="app-link text-sm font-medium leading-none">
                    <Image src="/images/apps/claude.svg" width={20} height={20} alt="Claude" />
                    <span>Integrations for Claude</span>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Securely connect Claude Desktop to your favorite apps</p>
                </NavigationMenuLink>
                <NavigationMenuLink href="/connect/chatgpt" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                  <div className="app-link text-sm font-medium leading-none">
                    <Image src="/images/apps/chatgpt.svg" width={20} height={20} alt="Claude" />
                    <span>ChatGPT Connector</span>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">ChatGPT empowered to take actions in your apps</p>
                </NavigationMenuLink>
                <NavigationMenuLink href="/connect/cursor" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                  <div className="app-link text-sm font-medium leading-none">
                    <Image src="/images/apps/cursor.svg" width={20} height={20} alt="Claude" />
                    <span>Cursor MCP</span>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Cursor MCP to connect all your apps</p>
                </NavigationMenuLink>
                <NavigationMenuLink href="/connect/mcp-server" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                  <div className="app-link text-sm font-medium leading-none">
                    <Image src="/images/apps/mcp.svg" width={20} height={20} alt="Claude" />
                    <span>Universal remote MCP</span>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">The only MCP server you need to connect your apps</p>
                </NavigationMenuLink>
              </li>
 
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/use-cases">
            Use Cases
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/marketplace">
            Integrations
          </NavigationMenuLink>
        </NavigationMenuItem>
        <SignedIn>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/playground" target="_blank">
            Playground
          </NavigationMenuLink>
        </NavigationMenuItem>
        </SignedIn>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export default function AppNavigation() {
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
    <header className="md:hidden bg-white/80 rounded-bl-2xl rounded-br-2xl shadow-[0px_2px_16px_0px_rgba(0,0,0,0.08)] border-b border-white backdrop-blur-xl px-4 sm:px-6 py-4 flex flex-row justify-between items-center sticky top-0 z-50 gap-4 sm:gap-0">
    <div className="flex flex-col md:flex-row md:items-center flex-grow">
      <div className="flex w-full md:w-auto items-center">
        <Link className="flex items-center gap-2" href="/">
          <Image src="/images/logo.svg" width={32} height={32} alt="WayStation" className="h-8 w-8" />
          <p className="text-2xl font-bold aurora-text">WayStation</p>
        </Link>
        
        {/* Dashboard button always visible on mobile */}
        <div className="md:hidden ml-auto mr-4">
          <SignedIn>
            {pathname !== '/app' && (
              <Link href="/app" className="aurora-btn px-4 py-2 text-sm font-medium rounded-lg hover:scale-105 transition-transform duration-300 w-auto text-center">
                Dashboard
              </Link>
            )}
          </SignedIn>
        </div>

        {/* Hamburger menu button for mobile */}
        <button className="md:hidden flex flex-col justify-center items-center gap-1.5" onClick={toggleMobileMenu} aria-label="Toggle menu">
          <span className={`block w-6 h-0.5 bg-gray-800 transition-transform duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-gray-800 transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
          <span className={`block w-6 h-0.5 bg-gray-800 transition-transform duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>
      
      {/* Mobile Navigation Menu */}
      <nav className={`md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${mobileMenuOpen ? 'py-4' : 'max-h-0'}`}>
        <div className="flex flex-col gap-4 px-6">
          <Link href="/app/chat" className="app-link" onClick={() => setMobileMenuOpen(false)}>
            <MessageSquareText/>Chat
          </Link>
          <Link href="/app/integrations" className="app-link" onClick={() => setMobileMenuOpen(false)}>
            <Plug/>Integrations
          </Link>

          <div className="border-t border-gray-200 pt-4">
          <Link href="/app/claude" className="app-link py-2" onClick={() => setMobileMenuOpen(false)}>
            <Image src="/images/apps/claude.svg" width={20} height={20} alt="Claude" />
            <span>Claude</span>
          </Link>
          <Link href="/app/cursor" className="app-link py-2" onClick={() => setMobileMenuOpen(false)}>
            <Image src="/images/apps/cursor.svg" width={20} height={20} alt="Claude" />
            <span>Cursor</span>
          </Link>
          <Link href="/app/chatgpt" className="app-link py-2" onClick={() => setMobileMenuOpen(false)}>
            <Image src="/images/apps/chatgpt.svg" width={20} height={20} alt="WayStation GPT" />
            <span>ChatGPT</span>
          </Link>
          <Link href="/app/mcp" className="app-link py-2" onClick={() => setMobileMenuOpen(false)}>
            <Image src="/images/apps/mcp.svg" width={20} height={20} alt="MCP" />
            <span>Any MCP client</span>
          </Link>
          </div>

          <div className="border-t border-gray-200 mt-2 pt-4">
            <Link href="/use-cases" className="app-link py-2" onClick={() => setMobileMenuOpen(false)}>AI Use Cases</Link>
            <Link href="/marketplace" className="app-link py-2" onClick={() => setMobileMenuOpen(false)}>Marketplace</Link>
          </div>

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
      </nav>
    </div>
    </header>
  );
}
