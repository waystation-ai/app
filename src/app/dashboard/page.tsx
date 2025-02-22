import { auth } from '@clerk/nextjs/server';
import { db } from '@/app/lib/db';
import { oauthConnections } from '@/app/lib/db/schema';
import { eq } from 'drizzle-orm';
import ProviderCard from '@/app/ui/components/ProviderCard';
import Link from 'next/link';
import { providers } from '@/app/lib/config/oauth-providers';

import { Metadata } from 'next';
 
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 sm:gap-6 w-full sm:my-9">
        {Object.entries(providers).map(([provider, config]) => (
          <ProviderCard
            key={provider}
            provider={provider}
            name={config.name}
            description={config.description}
            isConnected={!!connectedProviders[provider]}
          />
        ))}
      </div>
      <p className="text-3xl lg:text-4xl text-gray-900 font-bold px-6 w-full md:text-center">
            ...and launch!
      </p>
      <div className="flex my-9 px-6 w-full md:justify-center">
        <Link href={`https://chatgpt.com/g/${process.env.GPT_ID}-waystation`} target='_blank' className="aurora-btn px-4 py-2 text-lg font-bold rounded-lg hover:scale-105 transition-transform duration-300 w-auto text-center">
          Launch WayStation GPT
        </Link>
      </div>
    </div>
  );
}
