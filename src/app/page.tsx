import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link"; 
import Image from "next/image";

import { Metadata } from 'next';
import { ProvidersCarousel } from "@/components/app/ProvidersCarousel";

import {registry} from '@/marketplace';
import AlternativeApps from "@/components/app/connect/AlternativeApps";
 
export const metadata: Metadata = {
  title: 'WayStation - Empowering LLMs to take real-world actions',
  openGraph: {
    type: 'website',
    title: "WayStation",
    description: "Empowering LLMs to take real-world actions",
    siteName: "WayStation",
    images : {
      url: '/images/promo-wide.png'
    }
  }
};

export default function Home() {
  // Get all providers from registry
  const providers = registry.getAllProviders().map(provider => ({
    id: provider.id,
    name: provider.name,
    description: provider.description,
  }));

  return (
    <div className="flex flex-col relative">
      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 px-4 sm:px-8 py-8 max-w-7xl mx-auto">
          {/* Left Column - Pitch */}
          <div className="flex flex-col justify-center text-left space-y-4 lg:space-y-6">
            <h1 className="text-3xl lg:text-4xl font-bold">Connecting Worlds</h1>
            <h2 className="!mt-2 text-xl lg:text-2xl">You, AI and your apps</h2>
            <ul className="">
              <li>Seamlessly and securely connect AIs to your favorite apps.</li>
              <li>Empower LLM to take action on your behalf, automate routine tasks, and streamline workflows.</li>
              <li>Unlock AI&apos;s full potential and boost your productivity.</li>
            </ul>
            <div className="flex flex-wrap items-center gap-3 mt-4 mb-8">
              <SignedIn>
                <Link href="/dashboard" className="getstarted-btn">
                  Get Started
                </Link>
              </SignedIn>
              <SignedOut>
                <Link href="/sign-in" className="getstarted-btn">
                  Get Started
                </Link>
              </SignedOut>
              {/* Alternative Apps Section */}
              <AlternativeApps currentApp="generic"/>
            </div>
          </div>

          {/* Right Column - Hero */}
          <div className="flex items-center justify-right">
            <video 
              className="w-full h-auto shadow-xl rounded-lg  border-slate-300 border-2"
              controls
              autoPlay 
              muted 
              loop 
              playsInline
              poster="/images/hero.png"
            >
              <source src="/videos/marketplace169vo.mp4" type="video/mp4" />
              <source src="/videos/marketplace169vo.webm" type="video/webm" />
              {/* Fallback to image if video fails to load */}
              <Image src="/images/hero.png" alt="Marketplace for Claude" width={1168} height={716} />
            </video>
          </div>
        </div>
      </main>

      <div className="px-4 sm:px-8 max-w-7xl mx-auto mt-4">
      <h2 className="text-xl lg:text-2xl font-bold mb-2">Why WayStation?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3 bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold">Eliminate Complexity</h3>
            <p className="text-gray-600">Effortless integration empowers LLMs to perform real-world actions for you (e.g., managing tasks, updating databases and sharing updates)</p>
          </div>

          <div className="space-y-3 bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold">Freedom to Explore and Innovate</h3>
            <p className="text-gray-600">Connect any LLM product to your productivity ecosystem. WayStation lets you experiment freely, combining the best strengths of various LLM products without vendor lock-in.</p>
          </div>

          <div className="space-y-3 bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold">Security-First Approach</h3>
            <p className="text-gray-600">Enterprises maintain complete control, visibility, and compliance oversight for all interactions between AI and integrated applications, ensuring data safety and organizational trust.</p>
          </div>

        </div>
      </div>

      {/* Available Integrations Section */}
      <div className="px-4 sm:px-8 lg:py-6 mt-4 max-w-7xl mx-auto w-full">
        <h2 className="text-xl lg:text-2xl font-bold mb-1">Connect your everyday apps</h2>
        <p className="mb-8">It takes <span className="bg-yellow-100">less than 90 seconds</span> to connect your apps and realize value</p>
        
        <ProvidersCarousel providers={providers} />
      </div>

      {/* Get Started Section */}
      <div className="w-full py-16 md:mt-12 backdrop-blur-md bg-white/30">
        <div className="px-4 sm:px-8 max-w-7xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">Get Started Today</h2>
          <p className="text-lg mb-8">Connect AIs to your favorite apps now!</p>
          <SignedIn>
            <Link href="/dashboard" className="getstarted-btn text-lg">
              Get Started
            </Link>
          </SignedIn>
          <SignedOut>
            <Link href="/sign-in" className="getstarted-btn">
              Sign Up Free
            </Link>
          </SignedOut>
    
        </div>
      </div>

    </div>
  );
}
