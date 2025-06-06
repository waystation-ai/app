import { NextRequest, NextResponse } from 'next/server';
import { oauthServerService } from '@/lib/services/oauth-server';
import { OAuthClientMetadataSchema } from '@modelcontextprotocol/sdk/shared/auth.js';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate client metadata
    const result = OAuthClientMetadataSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { 
          error: 'invalid_client_metadata',
          error_description: 'Invalid client metadata'
        }, 
        { status: 400 }
      );
    }

    // Register client
    const clientInfo = await oauthServerService.registerClient(result.data);
    
    // Return client information
    return NextResponse.json(clientInfo);
  } catch (error) {
    console.error('Error registering client:', error);
    
    return NextResponse.json(
      { 
        error: 'server_error',
        error_description: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}
