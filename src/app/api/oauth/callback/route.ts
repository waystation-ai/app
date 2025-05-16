import { NextRequest, NextResponse } from 'next/server';
import { oauthServerService } from '@/lib/services/oauth-server-service';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    
    // Extract parameters
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');
    const errorDescription = url.searchParams.get('error_description');
    
    // Handle error from Clerk
    if (error) {
      console.error('Error from Clerk:', error, errorDescription);
      return NextResponse.json(
        { error, error_description: errorDescription },
        { status: 400 }
      );
    }
    
    // Validate required parameters
    if (!code) {
      return NextResponse.json(
        { error: 'invalid_request', error_description: 'code is required' },
        { status: 400 }
      );
    }
    
    if (!state) {
      return NextResponse.json(
        { error: 'invalid_request', error_description: 'state is required' },
        { status: 400 }
      );
    }
    
    // Get redirect mapping
    const mapping = await oauthServerService.getRedirectMapping(state);
    
    if (!mapping) {
      return NextResponse.json(
        { error: 'invalid_state', error_description: 'Invalid state parameter' },
        { status: 400 }
      );
    }
    
    // Build redirect URL with code and original state
    const redirectUrl = new URL(mapping.originalRedirectUri);
    redirectUrl.searchParams.append('code', code);
    
    // Add original state if it exists
    if (mapping.originalState) {
      redirectUrl.searchParams.append('state', mapping.originalState);
    }
    
    // Note: We don't need to add code_verifier to the redirect URL
    // The client already has its own code verifier that it generated
    
    // Clean up the mapping
    await oauthServerService.deleteRedirectMapping(state);
    
    // Redirect to client's redirect URI
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('Error in callback endpoint:', error);
    
    return NextResponse.json(
      { 
        error: 'server_error',
        error_description: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}
