import ChatDemo from "@/app/ui/components/ChatDemo";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link"; 

import { getProviderConfig } from "@/app/lib/config/oauth-providers";
import Providers from "@/app/ui/components/Providers";
 
export async function generateMetadata ({ params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params;

  const config = getProviderConfig(provider);

  return {
    title: `Integrate any MCP host with ${config.name}`,
    description: `With universal WayStation MCP Server you can ${config.description}`
  }
};

export default async function Home({ params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params;

  const config = getProviderConfig(provider);

  return (
    <div className="flex flex-col relative">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 px-4 sm:px-8 py-8 max-w-7xl mx-auto">
          {/* Left Column - Branding */}
          <div className="flex flex-col justify-center text-left space-y-4 lg:space-y-6">
            <h1 className="text-3xl lg:text-4xl font-bold">
            Connect any MCP host to <span className="bg-yellow-100">{config.name}</span>
            </h1>
            <h2 className="text-lg lg:text-xl leading-snug">
              {config.description}
            </h2>
            {config.bullets &&
            <ul>{config.bullets.map((bullet, index) => <li key={index}>{bullet}</li>)}
            </ul>
            }

            <SignedIn>
              <Link href="/dashboard" className="aurora-btn hidden lg:block px-4 py-2 text-sm font-bold rounded hover:scale-105 transition-transform duration-300 w-1/2 text-center">
                Connect
              </Link>
            </SignedIn>
            <SignedOut>
              <Link href="/sign-in" className="aurora-btn hidden lg:block px-4 py-2 text-sm font-bold rounded hover:scale-105 transition-transform duration-300 w-1/2 text-center">
                Get Started
              </Link>
            </SignedOut>
            <div className="mt-auto">
              <p>And make it even more powerful with other providers we support</p>
              <div>
                <Providers className="grid grid-cols-9 gap-1 mt-3" width={30} height={30} />
              </div>
            </div>

          </div>

          {/* Right Column - Chat Demo */}
          <div className="flex items-center justify-center mt-4 lg:mt-0">
            <ChatDemo messages={config.chat}/>
          </div>
        </div>
      </main>
    </div>
  );
}
