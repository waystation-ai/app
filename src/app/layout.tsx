import { ClerkProvider} from '@clerk/nextjs';
import "./ui/globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import Navigation from '@/app/ui/components/Navigation';
import Footer from '@/app/ui/components/Footer';

import { metadata } from './metadata';
export { metadata };

import { sora } from './ui/fonts';
import BodyBackground from './ui/components/BodyBackground';

export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
  return (
    <ClerkProvider waitlistUrl="/waitlist">
    <html lang="en">
      <body className={`${sora.className} antialiased flex flex-col`}>
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
      </body>
    </html>
    </ClerkProvider>
  );
}
