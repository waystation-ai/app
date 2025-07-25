import "../globals.css";
import { sora } from '../fonts';

import { ClerkProvider} from '@clerk/nextjs';
import { PostHogProvider } from './posthog';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { GoogleTagManager } from '@next/third-parties/google';
import Script from 'next/script';


import BodyBackground from '@/components/app/BodyBackground';
import Navigation from '@/components/app/Navigation';
import Footer from '@/components/app/Footer';

import { metadata } from '@/app/metadata';
export { metadata };

export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
  return (
    <ClerkProvider waitlistUrl="/waitlist">
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
      <body className={`${sora.className} antialiased flex flex-col`}>
        <PostHogProvider>
          <BodyBackground/>
          <header className="bg-white/80 rounded-bl-2xl rounded-br-2xl shadow-[0px_2px_16px_0px_rgba(0,0,0,0.08)] border-b border-white backdrop-blur-xl px-4 sm:px-6 py-4 flex flex-row justify-between items-center sticky top-0 z-50 gap-4 sm:gap-0">
            <Navigation/>
          </header>
          <div className="flex-grow">
            {children}
          </div>
          <Footer />
          <SpeedInsights />
          <Analytics />
        </PostHogProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
