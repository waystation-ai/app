import type { Metadata } from "next";
import { ClerkProvider, SignedIn, SignedOut, UserButton} from '@clerk/nextjs';
import { Sora } from "next/font/google";
import "./globals.css";
import AuroraBackground from "@/components/AuroraBackground";
import Link from 'next/link';
import { SpeedInsights } from "@vercel/speed-insights/next";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WayStation",
  description: "Empowering LLMs to take real-world actions",
  icons: {
    icon: '/images/logo.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider waitlistUrl="/waitlist">
    <html lang="en">
      <body className={`${sora.variable} antialiased`}>
        <AuroraBackground/>
        <header className="bg-white/80 rounded-bl-2xl rounded-br-2xl shadow-[0px_2px_16px_0px_rgba(0,0,0,0.08)] border-b border-white backdrop-blur-xl px-4 sm:px-6 py-4 flex flex-row justify-between items-center sticky top-0 z-50 gap-4 sm:gap-0">
          <Link className="flex items-center gap-2" href="/">
            <img src="/images/logo.svg" alt="WayStation" className="h-8 w-8" />
            <h1 className="text-2xl font-bold aurora-text">WayStation</h1>
          </Link>
          <SignedOut>
            <Link href="/waitlist" className="aurora-btn px-4 py-2 text-sm font-bold rounded hover:scale-105 transition-transform duration-300 w-auto text-center">
              Get Early Access
            </Link>
          </SignedOut>
          <SignedIn>
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="aurora-btn px-4 py-2 text-sm font-medium rounded-lg hover:scale-105 transition-transform duration-300 w-auto text-center">
                Dashboard
              </Link>
              <UserButton/>
            </div>
          </SignedIn>

        </header>
        {children}
        <SpeedInsights />
      </body>
    </html>
    </ClerkProvider>
  );
}
