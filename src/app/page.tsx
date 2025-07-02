import { auth } from '@clerk/nextjs/server';
import { Metadata } from 'next';
import Link from 'next/link';

import { getValidConnections } from '@/lib/db';
import { registry } from '@/marketplace';
import { isFullProvider, Provider } from '@/marketplace/core/types';

import { LaunchPad } from '@/components/app/LaunchPad';
import ProviderCard from '@/components/app/ProviderCard';
import { ProviderIcon } from '@/components/app/ProviderIcon';
import { RedirectHandler } from '@/components/app/RedirectHandler';
 
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
  
  // Create a Set of provider IDs that are displayed in "Connect your apps"
  const displayedProviderIds = new Set(displayIds);
  
  // Get remaining provider IDs for "More integrations"
  const moreIntegrationIds = [
    ...unconnectedIds.filter(id => !displayedProviderIds.has(id)),
    ...Object.keys(providersData.noAuth)
  ];

  return (
    <div className="mt-4 sm:mt-8 px-4 sm:px-6 lg:px-8  mx-auto">
      {/* Add the redirect handler */}
      <RedirectHandler />
      {/* Top section - Two columns */}
      <div className="flex flex-col lg:flex-row gap-8 mb-12">
        {/* Left Column - Connect your apps */}
        <div className={`flex flex-col ${connectedIds.length > 0 ? 'lg:w-2/3' : 'w-full'}`}>
          <p className="text-3xl lg:text-4xl text-gray-900 font-bold">
                Connect your apps first...
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 w-full my-3 sm:my-9">
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
        </div>

        {/* Right Column - Launch section - Only shown when at least one provider is connected */}
        {connectedIds.length > 0 && (
          <div className="flex flex-col lg:w-1/3 items-center justify-center h-full">
            <p className="my-4 text-3xl lg:text-4xl text-gray-900 font-bold w-full text-center">
                  ...and get started!
            </p>
            <LaunchPad  />
          </div>
        )}
      </div>
      
      {/* Bottom section - Full width */}
      <div className="w-full">
        <p className="text-xl lg:text-2xl text-gray-900 font-bold">
          More Integrations
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-6 w-full my-6">
          {moreIntegrationIds.map(providerId => {
            const provider = providersData.unconnected[providerId] || providersData.noAuth[providerId];
            return (
              <Link 
                key={providerId} 
                href={isFullProvider(provider) ? `/connect/${providerId}` : `/waitlist/${providerId}`} 
                className="provider-card flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <ProviderIcon provider={providerId} />
                <p className="mt-2 text-sm text-gray-600 text-center">{provider.name}</p>
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
}
