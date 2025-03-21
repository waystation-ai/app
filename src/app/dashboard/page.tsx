import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';

import { Metadata } from 'next';
import Link from 'next/link';

import { db } from '@/lib/db';
import { oauthConnections } from '@/lib/db/schema';
import { registry } from '@/app/tools/core/registry';

// Import the main entry point to ensure all providers are registered
import '@/app/tools/main';

import ProviderCard from '@/components/app/ProviderCard';
import { ProviderIcon } from '@/components/app/ProviderIcon';
import { LaunchPad } from '@/components/app/LaunchPad';
import { LaunchPadBasement } from '@/components/app/LaunchPadBasement';
import { RedirectHandler } from '@/components/app/RedirectHandler';
 
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

  // Get all providers from registry
  const allProviders = registry.getAllProviders();
  
  // Get all providers with authorization URLs
  const providersWithAuth = allProviders
    .filter(provider => provider.authorizationUrl)
    .map(provider => [provider.id, provider] as [string, typeof provider]);
  
  // Get providers without authorization URLs
  const providersWithoutAuth = allProviders
    .filter(provider => !provider.authorizationUrl)
    .map(provider => [provider.id, provider] as [string, typeof provider]);
  
  // Split into connected and unconnected providers
  const connectedProviderEntries = providersWithAuth
    .filter(([providerName]) => connectedProviders[providerName]);
  const unconnectedProviderEntries = providersWithAuth
    .filter(([providerName]) => !connectedProviders[providerName]);
  
  // Determine which providers to display in "Connect your apps"
  let providersToDisplay;
  if (connectedProviderEntries.length > 4) {
    // If more than 4 connected providers, show all connected
    providersToDisplay = connectedProviderEntries;
  } else {
    // Show all connected + enough unconnected to reach 4 total
    const unconnectedToShow = unconnectedProviderEntries
      .slice(0, 4 - connectedProviderEntries.length);
    providersToDisplay = [...connectedProviderEntries, ...unconnectedToShow];
  }
  
  // Create a Set of provider IDs that are displayed in "Connect your apps"
  const displayedProviderIds = new Set(
    providersToDisplay.map(([providerName]) => providerName)
  );
  
  // Get providers with authorization URLs that weren't displayed
  const remainingAuthProviders = providersWithAuth
    .filter(([providerName]) => !displayedProviderIds.has(providerName));
  
  // Combine both for "More integrations"
  const moreIntegrationsProviders = [...remainingAuthProviders, ...providersWithoutAuth];

  return (
    <div className="mt-4 sm:mt-8 px-4 sm:px-6 lg:px-8  mx-auto">
      {/* Add the redirect handler */}
      <RedirectHandler />
      {/* Top section - Two columns */}
      <div className="flex flex-col lg:flex-row gap-8 mb-12">
        {/* Left Column - Connect your apps */}
        <div className="flex flex-col lg:w-2/3">
          <p className="text-3xl lg:text-4xl text-gray-900 font-bold">
                Connect your apps...
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 w-full my-3 sm:my-9">
            {providersToDisplay.map(([provider, config]) => (
              <ProviderCard
                key={provider}
                provider={provider}
                name={config.name}
                description={config.description}
                isConnected={!!connectedProviders[provider]}
              />
            ))}
          </div>
        </div>

        {/* Right Column - Launch section */}
        <div className="flex flex-col lg:w-1/3 items-center justify-center h-full">
          <p className="my-4 text-3xl lg:text-4xl text-gray-900 font-bold w-full text-center">
                ...and launch!
          </p>
          <LaunchPad gptId={process.env.GPT_ID} />
          <LaunchPadBasement />
        </div>
      </div>
      
      {/* Bottom section - Full width */}
      <div className="w-full">
        <p className="text-xl lg:text-2xl text-gray-900 font-bold">
          More Integrations
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-6 w-full my-6">
          {moreIntegrationsProviders.map(([provider, config]) => (
            <Link key={provider} href={config.authorizationUrl ? `/connect/${provider}` : `/waitlist/${provider}`} className="provider-card flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              <ProviderIcon provider={provider} />
              <p className="mt-2 text-sm text-gray-600 text-center">{config.name}</p>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
