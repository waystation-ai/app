import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';

import { Metadata } from 'next';
import Link from 'next/link';

import { db } from '@/app/lib/db';
import { oauthConnections } from '@/app/lib/db/schema';
import { providers } from '@/app/lib/config/oauth-providers';

import ProviderCard from '@/app/ui/components/ProviderCard';
import { ProviderIcon } from '@/app/ui/components/ProviderIcon';
import { LaunchPad } from '../ui/components/LaunchPad';
import { LaunchPadBasement } from '../ui/components/LaunchPadBasement';
 
export const metadata: Metadata = {
  title: 'Dashboard',
};

export default async function Page() {
  let connectedProviders: Record<string, boolean> = {};

  try {
    const session = await auth();
    
    if (session?.userId) {
      const connections = await db.select().from(oauthConnections)
        .where(eq(oauthConnections.userId, session.userId));

      connectedProviders = connections.reduce((acc, conn) => {
        acc[conn.provider] = true;
        return acc;
      }, {} as Record<string, boolean>);
    }
  } catch (error) {
    console.error('Error fetching connections:', error);
    // Continue with empty connections
  }

  return (
    <div className="flex flex-col mt-4 sm:mt-8 justify-center items-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <p className="mt-8 text-3xl lg:text-4xl text-gray-900 font-bold">
            Connect your apps...
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full my-3 sm:my-9">
        {Object.entries(providers)
          .filter(([, config]) => config.authorizationUrl)
          .map(([provider, config]) => (
          <ProviderCard
            key={provider}
            provider={provider}
            name={config.name}
            description={config.description}
            isConnected={!!connectedProviders[provider]}
          />
        ))}
      </div>

      <p className="my-4 text-3xl lg:text-4xl text-gray-900 font-bold px-6 w-full text-center">
            ...and launch!
      </p>
      <LaunchPad gptId={process.env.GPT_ID} />
      <LaunchPadBasement />

      <p className="mt-12 text-xl lg:text-2xl text-gray-900 font-bold">
        Coming Soon
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6 w-full my-6">
        {Object.entries(providers)
          .filter(([, config]) => !config.authorizationUrl)
          .map(([provider, config]) => (
            <Link key={provider} href={`/connect/chatgpt/${provider}`} className="provider-card flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              <ProviderIcon provider={provider} />
              <p className="mt-2 text-sm text-gray-600 text-center">{config.name}</p>
            </Link>
          ))}
      </div>

    </div>
  );
}
