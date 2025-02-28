import "./ui/globals.css";
import { sora } from './ui/fonts';

import { ClerkProvider} from '@clerk/nextjs';
import { PostHogProvider } from './providers';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { GoogleTagManager } from '@next/third-parties/google';


import BodyBackground from './ui/components/BodyBackground';
import Navigation from '@/app/ui/components/Navigation';
import Footer from '@/app/ui/components/Footer';

import { metadata } from './metadata';
export { metadata };


export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
  return (
    <ClerkProvider waitlistUrl="/waitlist">
    <html lang="en">
      <GoogleTagManager gtmId="AW-16889842454" />
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
