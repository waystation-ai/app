import { auth } from '@clerk/nextjs/server';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { getValidConnections } from '@/lib/db';
import { registry } from '@/marketplace';
import { isFullProvider, isNativeProvider, isRemoteProvider } from '@/marketplace/core/types';
import { IntegrationsTabNavigation } from '@/components/app/IntegrationsTabNavigation';
import { IntegrationsContent } from '@/components/app/IntegrationsContent';

interface ProviderTool {
  id: string;
  summary: string;
  description?: string;
}

interface ProviderModalData {
  id: string;
  name: string;
  description: string;
  bullets?: string[];
  tools: ProviderTool[];
  hasAuth: boolean;
  scopes?: string[];
}

export const metadata: Metadata = {
  title: 'Tools and Integrations',
};

interface PageProps {
  params: {
    tab: string;
  };
}

export default async function IntegrationsTabPage({ params }: PageProps) {
  const { tab } = params;

  // Validate tab parameter
  if (tab !== 'official' && tab !== 'native') {
    redirect('/app/integrations');
  }

  const session = await auth();

  if (!session.userId) {
    session.redirectToSignIn();
    return null;
  }

  // Get connected providers
  let connectedProviderIds = new Set<string>();
  let connectionsMap = new Map();
  try {
    connectionsMap = await getValidConnections(session.userId);
    connectedProviderIds = new Set(connectionsMap.keys());
  } catch (error) {
    console.error('Error fetching connections:', error);
  }

  // Get all providers from registry
  const allProviders = registry.getAllProviders();
  
  // Filter providers based on tab
  const filteredProviders = allProviders.filter(provider => {
    if (tab === 'official') {
      return isRemoteProvider(provider);
    } else if (tab === 'native') {
      return isNativeProvider(provider);
    }
    return true;
  });
  
  // Sort providers alphabetically by name
  const sortedProviders = filteredProviders.sort((a, b) => a.name.localeCompare(b.name));

  // Create provider data with tools for each provider
  const providerDataList: ProviderModalData[] = await Promise.all(
    sortedProviders.map(async (provider) => {
      const isConnected = connectedProviderIds.has(provider.id);
      let tools: ProviderTool[] = [];
      
      // Fetch tools only for connected providers
      if (isConnected) {
        try {
          const providerTools = await registry.getProviderTools(provider, session.userId);
          tools = providerTools.map(tool => ({
            id: tool.id,
            summary: tool.summary,
            description: tool.description
          }));
        } catch (error) {
          console.error(`Error fetching tools for ${provider.id}:`, error);
        }
      }

      return {
        id: provider.id,
        name: provider.name,
        description: provider.description,
        bullets: provider.bullets,
        tools,
        hasAuth: isFullProvider(provider),
        scopes: isNativeProvider(provider) ? provider.scopes : undefined
      };
    })
  );

  return (
    <div className="mt-4 sm:mt-8 px-4 sm:px-6 lg:px-8 mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl text-gray-900 font-bold mb-6">
          Tools and Integrations
        </h1>
        
        {/* Tab navigation */}
        <IntegrationsTabNavigation currentTab={tab as 'official' | 'native'} />
      </div>

      <IntegrationsContent
        providers={providerDataList}
        connectedProviderIds={connectedProviderIds}
        connectionsMap={connectionsMap}
      />
    </div>
  );
}
