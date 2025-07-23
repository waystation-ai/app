import { auth } from '@clerk/nextjs/server';
import { Metadata } from 'next';
import Link from 'next/link';

import { getValidConnections } from '@/lib/db';
import { registry } from '@/marketplace';
import { isFullProvider, Provider } from '@/marketplace/core/types';

import ProviderCard from '@/components/app/ProviderCard';
import { RedirectHandler } from '@/components/app/RedirectHandler';

import { LaunchPad } from '@/components/app/LaunchPad';
 
export const metadata: Metadata = {
  title: 'Dashboard',
};

export default async function Page() {
  const session = await auth();

  if (!session.userId) {
    session.redirectToSignIn();
    return null; // Early return to avoid unnecessary processing
  }

  // Get connected providers
  let connectedProviderIds = new Set<string>();
  try {
    const connectionsMap = await getValidConnections(session.userId);
    connectedProviderIds = new Set(connectionsMap.keys());
  } catch (error) {
    console.error('Error fetching connections:', error);
    // Continue with empty connections
  }

  // Get vetoed providers (main set we want to show) and handle unvetoed connected providers
  const vetoedProviders = registry.getVetoedProviders();
  const allProviders = registry.getAllProviders();
  const unvetoedProviders = allProviders.filter(p => !vetoedProviders.some(vp => vp.id === p.id));
  
  // Filter unvetoed providers to only those that are connected
  const connectedUnvetoedProviders = unvetoedProviders.filter(p => connectedProviderIds.has(p.id));
  
  // Combine vetoed providers with connected unvetoed providers
  const displayableProviders = [...vetoedProviders, ...connectedUnvetoedProviders];
  
  // Create maps to store providers by category
  type ProviderMap = Record<string, Provider>;
  
  // Categorize providers by type and connection status
  const providersData = displayableProviders.reduce((result, provider) => {
    const hasAuth = isFullProvider(provider);
    const isConnected = connectedProviderIds.has(provider.id);
    
    if (hasAuth) {
      if (isConnected) {
        result.connected[provider.id] = provider;
      } else {
        result.unconnected[provider.id] = provider;
      }
    } else {
      result.noAuth[provider.id] = provider;
    }
    
    return result;
  }, {
    connected: {} as ProviderMap,
    unconnected: {} as ProviderMap,
    noAuth: {} as ProviderMap
  });
  
  // Get arrays of provider IDs for each category
  const connectedIds = Object.keys(providersData.connected);
  const unconnectedIds = Object.keys(providersData.unconnected);
  
  // Determine which provider IDs to display in "Connect your apps"
  const displayIds = connectedIds.length > 4
    ? connectedIds
    : [
        ...connectedIds,
        ...unconnectedIds.slice(0, 4 - connectedIds.length)
      ];
  

  return (
    <div className="mt-4 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
      {/* Add the redirect handler */}
      <RedirectHandler />
      
      {/* Main section - Connect your apps */}
      <div className="mb-12">
        <p className="text-3xl lg:text-4xl text-gray-900 font-bold mb-6">
          Dashboard
        </p>
        <p className="text-xl lg:text-2xl text-gray-600 mb-6">
          Connect your apps first...
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 w-full mb-8">
          {displayIds.map(providerId => {
            const provider = providersData.connected[providerId] || providersData.unconnected[providerId];
            return (
              <ProviderCard
                key={providerId}
                provider={providerId}
                name={provider.name}
                description={provider.description}
                isConnected={connectedProviderIds.has(providerId)}
              />
            );
          })}
        </div>

        {/* More Integrations Link */}
        <div className="mt-6">
          <Link href="/app/integrations" className="text-blue-600 hover:text-blue-800 font-medium">
            More Apps →
          </Link>
        </div>

        {/* Connection Guides - Only shown when at least one provider is connected */}
        {connectedIds.length > 0 && (

        <div>  
          <p className="text-xl lg:text-2xl text-gray-600 my-6">
            ...let WayStation to plug them into your AI agents
          </p>
          <LaunchPad />
        </div>  
        )}
      </div>
    </div>
  );
}
