import { NextResponse } from 'next/server';
import { oauthServerService } from '@/lib/services/oauth-server';

export async function GET() {
  try {
    const oauthMetadata = oauthServerService.getServerMetadata();
    
    const protectedResourceMetadata = {
      resource: process.env.NEXT_PUBLIC_APP_URL,
      authorization_servers: [oauthMetadata.issuer],
      scopes_supported: oauthMetadata.scopes_supported,
      bearer_methods_supported: ["header"],
      resource_documentation: process.env.NEXT_PUBLIC_APP_URL
    };

    return NextResponse.json(protectedResourceMetadata, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      }
    });
  } catch (error) {
    console.error('Error in protected resource metadata endpoint:', error);
    
    return NextResponse.json(
      { 
        error: 'server_error',
        error_description: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}
