import { NextRequest, NextResponse } from 'next/server';
import { registry } from '@/marketplace';
import { getValidConnections } from '@/lib/db';
import { getRequestOrigin } from '@/lib/utils/get-request-origin';

import { authenticateRequest } from '@/lib/utils/authenticate-request';

export async function GET(request: NextRequest) {
  try {
    const userId = await authenticateRequest(request);
    
    // Get all providers from the registry
    const providers = registry.getAllProviders();
    
    // Get connection status for authenticated users
    const connections = userId 
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
        isConnected: userId ? connections.has(provider.id) : false,
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
