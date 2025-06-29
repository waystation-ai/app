"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

import { MessageSquareText, Plug, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { OrganizationSwitcher, SignedIn, UserButton } from "@clerk/nextjs";

const items = [
  {
    title: "Chat",
    url: "/chat",
    icon: MessageSquareText,
  },
  {
    title: "Integrations",
    url: "/integrations",
    icon: Plug,
  },
  {
    title: "Team",
    url: "/team",
    icon: Users,
  },
];

export function AppSidebar() {
  const { open } = useSidebar();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-between w-full">
          <Link className="flex items-center gap-2" href="/">
            <Image
              src="/images/logo.svg"
              width={32}
              height={32}
              alt="WayStation"
              className="h-8 w-8"
            />
            <p className="group-data-[collapsible=icon]:hidden text-xl font-bold aurora-text">WayStation</p>
          </Link>
          <SidebarTrigger className="group-data-[collapsible=icon]:hidden" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <OrganizationSwitcher organizationProfileMode='navigation' organizationProfileUrl='/team' className="w-full" />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SignedIn>
          <UserButton showName={open} />
        </SignedIn>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
