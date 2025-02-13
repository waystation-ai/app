import type { Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WayStation",
  description: "Empowering LLMs to take real-world actions",
  icons: {
    icon: '/aurora-circles.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={`${sourceSans.variable} antialiased`}>
        <header className="bg-white/30 backdrop-blur-md border-b border-white/20 px-4 sm:px-6 py-4 flex flex-row justify-between items-center sticky top-0 z-50 gap-4 sm:gap-0">
          <div className="flex items-center gap-2">
            <img src="/aurora-circles.svg" alt="WayStation" className="h-8 w-8" />
            <h1 className="text-2xl font-bold aurora-text">WayStation</h1>
          </div>
          <a href="https://forms.gle/ksX4AVNCJbPFr66F6" 
            className="aurora-btn px-4 py-2 text-sm font-medium rounded-lg hover:scale-105 transition-transform duration-300 w-auto text-center">
            Get Early Access
          </a>

        </header>
        {children}
      </body>
    </html>
    </ClerkProvider>
  );
}
