import "../globals.css";
import { sora } from "../fonts";

import { ClerkProvider } from "@clerk/nextjs";
import { PostHogProvider } from "../(frontend)/posthog";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { GoogleTagManager } from "@next/third-parties/google";
import Script from "next/script";
import { cookies } from "next/headers";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app/Sidebar";

import BodyBackground from "@/components/app/BodyBackground";
import AppNavigation from "@/components/app/AppNavigation";

export { metadata } from "../metadata";

export default async function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const defaultOpen = !(cookieStore.get("sidebar_state")?.value === "false");
  return (
    <ClerkProvider>
      <html lang="en">
        <GoogleTagManager gtmId="GTM-TBLJV48V" />
        <Script id="twitter-pixel" strategy="afterInteractive">
          {`
          !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
          },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
          a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
          twq('config','p82zo');
        `}
        </Script>
        <body className={`${sora.className} antialiased flex flex-col h-screen`}>
          <PostHogProvider>
            <BodyBackground />

            <AppNavigation/>
            <SidebarProvider defaultOpen={defaultOpen}>
              <AppSidebar />
              <main className="flex-1 h-full">                
                <div className="h-full">{children}</div>
              </main>
            </SidebarProvider>
            <SpeedInsights />
            <Analytics />
          </PostHogProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
