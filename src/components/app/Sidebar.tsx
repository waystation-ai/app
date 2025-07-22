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

import { School, MessageSquareText, Plug, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { OrganizationSwitcher, SignedIn, UserButton } from "@clerk/nextjs";

const items = [
  {
    title: "Dashboard",
    url: "/app",
    icon: School,
  },
  {
    title: "Chat",
    url: "/app/chat",
    icon: MessageSquareText,
  },
  {
    title: "Integrations",
    url: "/app/integrations",
    icon: Plug,
  },
  /*
  {
    title: "Team",
    url: "/app/team",
    icon: Users,
  },
  */
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
        <SidebarGroup>
          <SidebarGroupLabel>Connect</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem><SidebarMenuButton asChild>
                <Link href='/app/claude'><Image src="/images/apps/claude.svg" width={20} height={20} alt="Claude"></Image>Claude</Link>
              </SidebarMenuButton></SidebarMenuItem>
              <SidebarMenuItem><SidebarMenuButton asChild>
                <Link href='/app/cursor'><Image src="/images/apps/cursor.svg" width={20} height={20} alt="Cursor"></Image>Cursor</Link>
              </SidebarMenuButton></SidebarMenuItem>
              <SidebarMenuItem><SidebarMenuButton asChild>
                <Link href='/app/chatgpt'><Image src="/images/apps/chatgpt.svg" width={20} height={20} alt="ChatGPT"></Image>ChatGPT</Link>
              </SidebarMenuButton></SidebarMenuItem>
              <SidebarMenuItem><SidebarMenuButton asChild>
                <Link href='/app/mcp'><Image src="/images/apps/mcp.svg" width={20} height={20} alt="Any MCP client"></Image>Any MCP client</Link>
              </SidebarMenuButton></SidebarMenuItem>
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
