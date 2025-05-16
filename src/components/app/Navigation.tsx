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
                <NavigationMenuLink href="/marketplace/claude" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                  <div className="app-link text-sm font-medium leading-none">
                    <Image src="/images/apps/claude.svg" width={20} height={20} alt="Claude" />
                    <span>Marketplace for Claude</span>
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Securely connect Claude Desktop to your favorite apps</p>
                </NavigationMenuLink>
                <NavigationMenuLink >
                  <Link href="/connect/chatgpt" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="app-link text-sm font-medium leading-none">
                      <Image src="/images/apps/chatgpt.svg" width={20} height={20} alt="Claude" />
                      <span>WayStation GPT</span>
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">ChatGPT empowered to take actions in your apps</p>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink >
                  <Link href="/connect/mcp-server" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="app-link text-sm font-medium leading-none">
                      <Image src="/images/apps/mcp.svg" width={20} height={20} alt="Claude" />
                      <span>Universal MCP</span>
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">The only MCP server you need to connect your apps</p>
                  </Link>
                </NavigationMenuLink>
              </li>
 
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/marketplace">
            Marketplace
          </NavigationMenuLink>
        </NavigationMenuItem>
        <SignedIn>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/playground" target="_blank">
            Playground
          </NavigationMenuLink>
        </NavigationMenuItem>
        </SignedIn>
        {/*
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} href="https://www.linkedin.com/company/waystation-ai" target="_blank">
            What&apos;s New
          </NavigationMenuLink>
        </NavigationMenuItem>
        */}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

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
        <button className="md:hidden flex flex-col justify-center items-center gap-1.5" onClick={toggleMobileMenu} aria-label="Toggle menu">
          <span className={`block w-6 h-0.5 bg-gray-800 transition-transform duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-gray-800 transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
          <span className={`block w-6 h-0.5 bg-gray-800 transition-transform duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>


      {/* Desktop Navigation Links */}
      
      <div className="hidden md:block">
        <Menu />
      </div>
      <a className="ml-5 hidden md:block" href="https://www.producthunt.com/posts/marketplace-for-claude?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-marketplace&#0045;for&#0045;claude" target="_blank">
          <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=945095&theme=light&t=1743150993435" alt="Marketplace&#0032;for&#0032;Claude - Effortlessly&#0032;connect&#0032;AI&#0032;to&#0032;your&#0032;everyday&#0032;apps | Product Hunt" style={{width: "200px", height: "27"}} width="200" height="27" />
      </a>

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
      <nav className={`md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${mobileMenuOpen ? 'max-h-96 py-4' : 'max-h-0'}`}>
        <div className="flex flex-col gap-4 px-6">
          <Link href="/marketplace/claude" className="app-link py-2" onClick={() => setMobileMenuOpen(false)}>
            <Image src="/images/apps/claude.svg" width={20} height={20} alt="Claude" />
            <span>Marketplace for Claude</span>
          </Link>
          <Link href="/connect/chatgpt" className="app-link py-2" onClick={() => setMobileMenuOpen(false)}>
            <Image src="/images/apps/chatgpt.svg" width={20} height={20} alt="WayStation GPT" />
            <span>WayStation GPT</span>
          </Link>
          <Link href="/connect/mcp-server" className="app-link py-2" onClick={() => setMobileMenuOpen(false)}>
            <Image src="/images/apps/mcp.svg" width={20} height={20} alt="MCP" />
            <span>Universal MCP</span>
          </Link>

          <div className="border-t border-gray-200 mt-2 pt-4">
            <Link href="/marketplace" className="app-link py-2" onClick={() => setMobileMenuOpen(false)}>Marketplace</Link>
            <Link href="/playground" className="app-link py-2" onClick={() => setMobileMenuOpen(false)}>Playground</Link>
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
  );
}
