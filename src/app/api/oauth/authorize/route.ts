import { NextRequest, NextResponse } from 'next/server';
import { oauthServerService } from '@/lib/services/oauth-server-service';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    
    // Extract parameters
    const clientId = url.searchParams.get('client_id');
    const redirectUri = url.searchParams.get('redirect_uri');
    const responseType = url.searchParams.get('response_type');
    // We pass the original state to the client in the final redirect
    const originalState = url.searchParams.get('state');
    
    // Extract PKCE parameters
    const codeChallenge = url.searchParams.get('code_challenge');
    const codeChallengeMethod = url.searchParams.get('code_challenge_method');
    
    // Validate required parameters
    if (!clientId) {
      return NextResponse.json(
        { error: 'invalid_request', error_description: 'client_id is required' },
        { status: 400 }
      );
    }
    
    if (!redirectUri) {
      return NextResponse.json(
        { error: 'invalid_request', error_description: 'redirect_uri is required' },
        { status: 400 }
      );
    }
    
    if (responseType !== 'code') {
      return NextResponse.json(
        { error: 'unsupported_response_type', error_description: 'Only response_type=code is supported' },
        { status: 400 }
      );
    }
    
    // Get client
    const client = await oauthServerService.getClient(clientId);

    if (!client) {
      return NextResponse.json(
        { error: 'invalid_client', error_description: 'Client not found' },
        { status: 400 }
      );
    }

    if (!client.clientSecret) {
      // Validate PKCE parameters
      if (!codeChallenge) {
        return NextResponse.json(
          { error: 'invalid_request', error_description: 'code_challenge is required for PKCE' },
          { status: 400 }
        );
      }
      
      if (codeChallengeMethod !== 'S256') {
        return NextResponse.json(
          { error: 'invalid_request', error_description: 'code_challenge_method must be S256' },
          { status: 400 }
        );
      }
    }
    
    // Validate redirect URI
    if (!client.clientMetadata.redirect_uris.includes(redirectUri)) {
      return NextResponse.json(
        { error: 'invalid_redirect_uri', error_description: 'Redirect URI is not registered for this client' },
        { status: 400 }
      );
    }
    
    // Store redirect mapping with original state and code challenge
    const { state: internalState } = await oauthServerService.storeRedirectMapping(
      clientId,
      redirectUri,
      codeChallenge,
      codeChallengeMethod,
      10, // Default expiration of 10 minutes
      originalState || undefined
    );
    
    // Build authorization URL for Clerk
    const authorizationUrl = await oauthServerService.buildClerkAuthorizationUrl(
      internalState,
      codeChallenge,
      codeChallengeMethod
    );
    
    // Redirect to Clerk's authorization endpoint
    return NextResponse.redirect(authorizationUrl);
  } catch (error) {
    console.error('Error in authorization endpoint:', error);
    
    return NextResponse.json(
      { 
        error: 'server_error',
        error_description: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}
