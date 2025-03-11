import ChatDemo from "@/app/ui/components/ChatDemo";
import WaitlistButton from "@/app/ui/components/WaitlistButton";

import { getProviderConfig } from "@/app/lib/config/oauth-providers";
import { auth } from "@clerk/nextjs/server";
import { checkWaitlistStatus } from "@/app/lib/db";
 
export async function generateMetadata ({ params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params;

  const config = getProviderConfig(provider);

  return {
    title: `Coming Soon! Connect to ${config.name}`,
    description: `With WayStation plugin for ${config.name} you can ${config.description}`,
    openGraph: {
      type: 'article',
      title: `Integrate with ${config.name}`,
      description: `With WayStation plugin for ${config.name} you can ${config.description}`,
      siteName: "WayStation",
      url: `/waitlist/${provider}`,
      images : {
        url: '/images/promo-wide.png'
      }
    }
  }
};

export default async function Waitlist({ params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params;
  const config = getProviderConfig(provider);
  
  // Check if user is already on the waitlist
  let isOnWaitlist = false;
  const session = await auth();
  
  if (session?.userId) {
    isOnWaitlist = await checkWaitlistStatus(session.userId, provider);
  }

  return (
    <div className="flex flex-col relative">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 px-4 sm:px-8 py-8 max-w-7xl mx-auto">
          {/* Left Column - Branding */}
          <div className="flex flex-col justify-center text-left">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            Coming Soon! Connect to <span className="bg-yellow-100">{config.name}</span>
            </h1>
            <h2 className="text-lg lg:text-xl mb-2 leading-snug">
              {config.description}
            </h2>
            {config.bullets &&
            <ul className="my-2">{config.bullets.map((bullet, index) => <li key={index}>{bullet}</li>)}
            </ul>
            }

            <div className="hidden lg:block">
              <WaitlistButton provider={provider} isOnWaitlist={isOnWaitlist} />
            </div>

            <div className="flex items-center gap-4 mt-4 mb-8">
              <span className="text-sm font-medium text-gray-500">You&apos;ll be the first to know about {config.name} support in WayStation</span>
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
