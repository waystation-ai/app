import Link from "next/link";
import Image from "next/image";
import { Metadata } from 'next';
import { ProvidersCarousel } from "@/components/app/ProvidersCarousel";
import { DownloadButton } from "@/components/app/DownloadButton";

import { registry } from "@/marketplace/main";

export const metadata: Metadata = {
    title: `Marketplace for Claude | Effortlessly connect AI to your everyday apps`,
    description: `Connect Claude to your favorite apps (Slack, Monday, Airtable) with zero code. Automate routine tasks, streamline workflows, and unlock AI's full potential—no complexity, no vendor lock-in. Secure by design.`,
    openGraph: {
      type: 'article',
      title: `Marketplace for Claude | Powered by WayStation`,
      description: `Effortlessly connect AI to your everyday apps.`,
      siteName: "WayStation",
      url: `/claude/marketplace`,
      images: {
        url: '/images/hero.png'
      }
    }
  };

export default function Page() {

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
            <h1 className="text-3xl lg:text-4xl font-bold">Marketplace for Claude</h1>
            <h2 className="!mt-2 text-lg lg:text-xl leading-snug">Effortlessly connect AI to your everyday apps</h2>
            <ul className="my-2">
              <li>Securely connect Claude Desktop to your favorite apps (Notion, Slack, Monday, Airtable, etc.)</li>
              <li>Empower LLM to take action on your behalf, automate routine tasks, and streamline workflows</li>
              <li>Unlock AI&apos;s full potential and boost your productivity</li>
            </ul>
            <div className="flex flex-wrap items-center gap-3 mt-4 mb-8">
              <DownloadButton />
              <span className="flex text-sm font-medium text-gray-500 invisible md:visible">or</span>
              <Link href="waystation://" className="app-link invisible md:visible">
                <Image src="/images/launcher.png" width={32} height={(32)} alt="App icon"/> launch the installed app
              </Link>
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

      {/* Available Integrations Section */}
      <div className="px-4 sm:px-8 lg:py-6 max-w-7xl mx-auto w-full">
        <h2 className="text-2xl lg:text-3xl font-bold mb-1">Connect your everyday apps</h2>
        <p className="mb-8">It takes <span className="bg-yellow-100">less than 90 seconds</span> to connect your apps and realize value</p>
        
        <ProvidersCarousel providers={providers} app="claude"/>
      </div>

      {/* FAQ Section */}
      <div className="px-4 sm:px-8 max-w-7xl mx-auto">
        <h2 className="text-2xl lg:text-3xl font-bold mb-8">Frequently Asked Questions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-3 bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold">How does it work?</h3>
            <p className="text-gray-600">During the onboarding, the app installs secure WayStation MCP server into the Claude Desktop that connects Claude to your productivity apps via our service.</p>
          </div>

          <div className="space-y-3 bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold">Is it secure?</h3>
            <p className="text-gray-600">Yes, WayStation uses end-to-end encryption and never stores your data. The MCP server runs locally on your machine.</p>
          </div>

          <div className="space-y-3 bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold">What apps are supported?</h3>
            <p className="text-gray-600">We support major tools like Slack, Notion, Monday, Airtable, and many more. New integrations added regularly.</p>
          </div>

          <div className="space-y-3 bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold">Do I need to write any code?</h3>
            <p className="text-gray-600">No coding or even technical skills are required! Our app handles all the technical setup. Just install and connect with a few clicks.</p>
          </div>
        </div>
      </div>

      {/* Get Started Section */}
      <div className="w-full py-16 mt-12 backdrop-blur-md bg-white/30">
        <div className="px-4 sm:px-8 max-w-7xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">Get Started Today</h2>
          <p className="text-lg mb-8">Connect Claude to your favorite apps in less than 90 secs</p>
          <DownloadButton 
            className="aurora-btn inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white rounded-lg"
            iconSize={24}
          />
        </div>
      </div>
    </div>
  );
}
