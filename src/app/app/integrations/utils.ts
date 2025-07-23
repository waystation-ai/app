import { auth } from '@clerk/nextjs/server';
import { getValidConnections } from '@/lib/db';
import { registry } from '@/marketplace';
import { isNativeProvider, isRemoteProvider } from '@/marketplace/core/types';

// Types
export interface SerializableTool {
  id: string;
  summary: string;
  description?: string;
}

export interface SerializableProvider {
  id: string;
  name: string;
  description: string;
  bullets?: string[];
  chat?: Array<{
    role: 'user' | 'agent';
    content: string;
  }>;
  // OAuth fields for native providers
  scopes?: string[];
  // Provider type info
  providerType: 'native' | 'remote' | 'base';
}

export interface ProviderWithConnectionStatus extends SerializableProvider {
  isConnected: boolean;
  connectionInfo?: {
    metadata?: {
      email?: string;
      username?: string;
    };
  };
  tools: SerializableTool[];
}

// Data fetching
export async function getIntegrationsData(): Promise<ProviderWithConnectionStatus[] | null> {
  const session = await auth();

  if (!session.userId) {
    return null;
  }

  // Get connected providers
  const connections = await getValidConnections(session.userId);

  // Get all providers from registry and sort alphabetically
  const providers = registry.getVetoedProviders().sort((a, b) => a.name.localeCompare(b.name));

  // Create unified provider data with connection status and tools
  const providersWithStatus: ProviderWithConnectionStatus[] = await Promise.all(
    providers.map(async (provider) => {
      const isConnected = connections.has(provider.id);
      const connectionInfo = connections.get(provider.id);
      let tools: SerializableTool[] = [];
      
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
        chat: provider.chat,
        scopes: isNativeProvider(provider) ? provider.scopes : undefined,
        providerType: isNativeProvider(provider) ? 'native' : isRemoteProvider(provider) ? 'remote' : 'base',
        isConnected,
        connectionInfo,
        tools
      };
    })
  );

  return providersWithStatus;
}