import { auth } from '@clerk/nextjs/server';
import { getValidConnections } from '@/lib/db';
import { registry } from '@/marketplace';
import { isFullProvider, isNativeProvider, isRemoteProvider } from '@/marketplace/core/types';

// Types
export interface ProviderTool {
  id: string;
  summary: string;
  description?: string;
}

export interface ProviderModalData {
  id: string;
  name: string;
  description: string;
  bullets?: string[];
  tools: ProviderTool[];
  hasAuth: boolean;
  scopes?: string[];
}

export type IntegrationTab = 'all' | 'official' | 'native' | 'none';

// Data fetching
export async function getIntegrationsData(filterTab?: 'official' | 'native') {
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
  const filteredProviders = filterTab ? allProviders.filter(provider => {
    if (filterTab === 'official') {
      return isRemoteProvider(provider);
    } else if (filterTab === 'native') {
      return isNativeProvider(provider);
    }
    return true;
  }) : allProviders;
  
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

  return {
    providers: providerDataList,
    connectedProviderIds,
    connectionsMap,
    userId: session.userId
  };
}