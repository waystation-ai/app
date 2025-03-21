import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { registry } from '@/app/tools/core/registry';
import { getValidConnections } from '@/lib/db';
import { getRequestOrigin } from '@/lib/utils/get-request-origin';

// Import the main entry point to ensure all providers are registered
import '@/app/tools/main';

export async function GET(request: Request) {
  try {
    const session = await auth();
    const userId = session?.userId;
    const isAuthenticated = !!userId;
    
    // Get all providers from the registry
    const providers = registry.getAllProviders();
    
    // Get connection status for authenticated users
    const connections = isAuthenticated 
      ? await getValidConnections(userId)
      : new Map();
    
    // Get request origin for constructing full URLs
    const origin = getRequestOrigin(request);
    
    // Format the response
    const formattedProviders = providers.map(provider => {
      return {
        id: provider.id,
        name: provider.name,
        description: provider.description,
        icon: `${origin}/images/tools/${provider.id}.svg`,
        isConnected: isAuthenticated ? connections.has(provider.id) : false,
        bullets: provider.bullets || [],
        chat: provider.chat || [],
        tools: provider.tools.map(tool => ({
          name: tool.id,
          summary: tool.summary,
          description: tool.description || ''
        }))
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
