import ChatDemo from "@/app/ui/components/ChatDemo";
import Link from "next/link"; 
import Image from "next/image"; 

import { getProviderConfig } from "@/app/lib/config/oauth-providers";
import Providers from "@/app/ui/components/Providers";
 
export async function generateMetadata ({ params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params;

  const config = getProviderConfig(provider);

  return {
    title: `Integrate ChatGPT with ${config.name}`,
    description: `With WayStation plugin for ChatGPT you can ${config.description}`,
    openGraph: {
      type: 'article',
      title: `Integrate ChatGPT with ${config.name}`,
      description: `With WayStation plugin for ChatGPT you can ${config.description}`,
      siteName: "WayStation",
      url: `/connect/chatgpt/${provider}`,
      images : {
        url: '/images/promo-wide.png'
      }
    }
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
          <div className="flex flex-col justify-center text-left">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            Connect ChatGPT to <span className="bg-yellow-100">{config.name}</span>
            </h1>
            <h2 className="text-lg lg:text-xl mb-2 leading-snug">
              {config.description}
            </h2>
            {config.bullets &&
            <ul className="my-2">{config.bullets.map((bullet, index) => <li key={index}>{bullet}</li>)}
            </ul>
            }

            <Link href={`/dashboard?provider=${provider}`} className="aurora-btn hidden lg:block px-4 py-2 text-sm font-bold rounded hover:scale-105 transition-transform duration-300 w-1/2 text-center">
              Connect Now
            </Link>

            <div className="flex items-center gap-4 mt-4 mb-8">
              <span className="text-sm font-medium text-gray-500">Also connects to</span>
              <Link href={`/connect/claude/${provider}`} className="app-link">
                <Image src='/images/apps/claude.svg' width={20} height={20} alt="Claude"/>
                <span>Claude Desktop</span>
              </Link>
              <span className="text-sm font-medium text-gray-500">or</span>
              <Link href={`/connect/mcp-server/${provider}`} className="app-link">
                <Image src="/images/apps/mcp.svg" width={20} height={20} alt="MCP Host" />
                <span>Any MCP host</span>
              </Link>
            </div>
            <div className="sm:mt-8">
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
