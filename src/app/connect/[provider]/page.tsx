import ChatDemo from "@/components/app/ChatDemo";
import Providers from "@/components/app/Providers";
import { getValidConnections } from "@/lib/db";
import { getProviderConfig } from "@/lib/services/provider-config";
import { authUserId } from "@/lib/utils/auth-userid";
import { isFullProvider } from "@/marketplace/core/types";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params;
  const config = getProviderConfig(provider);

  const url = `/connect/${provider}`;

  return {
    title: `Integrate your Agent with ${config.name}`,
    description: `With Escalator you can ${config.description}`,
    openGraph: {
      type: 'article',
      title: `Integrate Escalator with ${config.name}`,
      description: `With Escalator you can ${config.description}`,
      siteName: "Escalator",
      url,
    }
  };
}

export default async function Page({ params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params;
  const config = getProviderConfig(provider);

  const userId = await authUserId();

  const connected = userId ?  (await getValidConnections(userId)).has(provider) : false;
  return (
    <div className="flex flex-col relative">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 px-4 sm:px-8 py-8 max-w-7xl mx-auto">
          {/* Left Column - Branding */}
          <div className="flex flex-col justify-center text-left">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
               Connect Escalator to <span className="bg-yellow-100">{config.name}</span>
            </h1>
            <h2 className="text-lg lg:text-xl mb-2 leading-snug">
              {config.description}
            </h2>
            {config.bullets && (
              <ul className="my-2">
                {config.bullets.map((bullet, index) => (
                  <li key={index}>{bullet}</li>
                ))}
              </ul>
            )}

            { !(connected) && 
            <Link
              href={isFullProvider(config) ? `/api/auth/${provider}/connect` : `/waitlist/${provider}`             }
              className="getstarted-btn"
            >
              Connect Now
            </Link>
        }

            <div className="sm:mt-4">
              <p>And make it even more powerful with other providers we support</p>
              <div>
                <Providers 
                  className="grid grid-cols-9 gap-1 mt-3" 
                  width={30} 
                  height={30} 
                />
              </div>
            </div>
          </div>

          {/* Right Column - Chat Demo */}
          <div className="flex items-center justify-center mt-4 lg:mt-0">
            <ChatDemo messages={config.chat} />
          </div>
        </div>
      </main>
    </div>
  );
}
