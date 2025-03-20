import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { registry } from '@/app/tools/core/registry';
import { getValidConnections } from '@/app/lib/db';
import { getRequestOrigin } from '@/app/lib/utils/get-request-origin';
import { providers as oauthProviders } from '@/app/lib/config/oauth-providers';

// Import the main entry point to ensure all providers are registered
import '@/app/tools/main';

export async function GET(request: Request) {
  try {
    const session = await auth();
    const userId = session?.userId;
    const isAuthenticated = !!userId;
    
    // Get all providers from the registry
    const registryProviders = registry.getAllProviders();
    
    // Create a map of registry providers for easy lookup
    const registryProvidersMap = new Map(
      registryProviders.map(provider => [provider.name, provider])
    );
    
    // Get connection status for authenticated users
    const connections = isAuthenticated 
      ? await getValidConnections(userId)
      : new Map();
    
    // Get request origin for constructing full URLs
    const origin = getRequestOrigin(request);
    
    // Combine registry providers with OAuth providers
    const allProviderIds = new Set([
      ...registryProvidersMap.keys(),
      ...Object.keys(oauthProviders)
    ]);
    
    // Format the response
    const formattedProviders = Array.from(allProviderIds).map(providerId => {
      const registryProvider = registryProvidersMap.get(providerId);
      const oauthProvider = oauthProviders[providerId];
      
      return {
        id: providerId,
        name: oauthProvider?.name || providerId,
        description: registryProvider?.description || oauthProvider?.description || '',
        icon: `${origin}/images/tools/${providerId}.svg`,
        isConnected: isAuthenticated ? connections.has(providerId) : false,
        tools: registryProvider 
          ? registryProvider.tools.map(tool => ({
              name: tool.id,
              summary: tool.summary,
              description: tool.description || ''
            }))
          : [] // Empty tools array for providers without registry entries
      };
    });
    
    return NextResponse.json(formattedProviders);
  } catch (error) {
    console.error('Error fetching provider metadata:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
