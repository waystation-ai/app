import Link from "next/link";
import Image from "next/image";
import { Metadata } from 'next';
import { ProvidersCarousel } from "@/components/app/ProvidersCarousel";
import { IconBrandAppleFilled } from '@tabler/icons-react';

// Import the main entry point to ensure all providers are registered
import '@/app/tools/main';
import { registry } from "@/app/tools/core/registry";

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
          {/* Left Column - Branding */}
          <div className="flex flex-col justify-center text-left space-y-4 lg:space-y-6">
            <h1 className="text-3xl lg:text-4xl font-bold">Marketplace for Claude</h1>
            <h2 className="text-lg lg:text-xl leading-snug">Effortlessly connect AI to your everyday apps</h2>
            <div className="mt-6">
              Marketplace for Claude app <span className="bg-yellow-100">connects Claude Desktop to your favorite apps</span> (Notion, Slack, Monday, Airtable, etc.) in less than 90 seconds. Automate routine tasks, streamline workflows, and unlock AI&apos;s full potential—no complexity, no vendor lock-in. Secure by design.
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-4 mb-8">
            <Link href="https://github.com/waystation-ai/launcher/releases/download/latest/WayStation_0.2.11_universal.dmg" className="getstarted-btn flex items-center justify-center gap-2">
              <IconBrandAppleFilled size={18} className="mb-1" /> 
              <span>Download for MacOS</span>
            </Link>
            <span className="flex text-sm font-medium text-gray-500">or</span>
            <Link href="waystation://" className="app-link">
            launch the installed app
            </Link>
            </div>
          </div>

          {/* Right Column - Chat Demo */}
          <div className="flex items-center justify-right">
            <Image src="/images/hero.png" alt="Claude" width={740} height={438} />
          </div>
        </div>
      </main>

      {/* Available Integrations Section */}
      <div className="px-4 sm:px-8 py-12 max-w-7xl mx-auto">
        <h2 className="text-2xl lg:text-3xl font-bold mb-1">You, AI and your apps</h2>
        <p className="mb-8">It takes <span className="bg-yellow-100">less than 90 seconds</span> to connect your apps and realize value</p>
        
        <ProvidersCarousel providers={providers} />
      </div>
    </div>
  );
}
