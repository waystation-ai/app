import { NextResponse } from 'next/server';
import { oauthServerService } from '@/lib/services/oauth-server';

export async function GET() {
  try {
    const metadata = oauthServerService.getServerMetadata();
    return NextResponse.json(metadata);
  } catch (error) {
    console.error('Error in metadata endpoint:', error);
    
    return NextResponse.json(
      { 
        error: 'server_error',
        error_description: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}
