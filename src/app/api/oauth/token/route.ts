import { NextRequest, NextResponse } from 'next/server';
import { oauthServerService } from '@/lib/services/oauth-server-service';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const contentType = request.headers.get('content-type') || '';
    let body: Record<string, string> = {};
    
    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      for (const [key, value] of formData.entries()) {
        body[key] = value.toString();
      }
    } else if (contentType.includes('application/json')) {
      body = await request.json();
    } else {
      return NextResponse.json(
        { error: 'unsupported_content_type', error_description: 'Content-Type must be application/x-www-form-urlencoded or application/json' },
        { status: 400 }
      );
    }
    
    // Extract parameters
    const grantType = body.grant_type;
    const code = body.code;
    const redirectUri = body.redirect_uri;
    const refreshToken = body.refresh_token;
    const codeVerifier = body.code_verifier;
    
    // Extract client credentials from Authorization header or request body
    let clientId = '';
    let clientSecret = '';
    
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Basic ')) {
      const credentials = Buffer.from(authHeader.slice(6), 'base64').toString().split(':');
      clientId = credentials[0] || '';
      clientSecret = credentials[1] || '';
    } else {
      clientId = body.client_id || '';
      clientSecret = body.client_secret || '';
    }
    
    // Get client
    if (!clientId) {
      return NextResponse.json(
        { error: 'invalid_client', error_description: 'Client ID is required' },
        { status: 401 }
      );
    }

    const client = await oauthServerService.getClient(clientId);
    if (!client) {
      return NextResponse.json(
        { error: 'invalid_client', error_description: 'Client not found' },
        { status: 401 }
      );
    }
    
    // Check authentication method
    const authMethod = client.clientMetadata.token_endpoint_auth_method || 'client_secret_post';
    
    // Validate client credentials if not using 'none' auth method
    if (authMethod !== 'none') {
      if (!clientSecret) {
        return NextResponse.json(
          { error: 'invalid_client', error_description: 'Client authentication failed' },
          { status: 401 }
        );
      }
      
      const isValidClient = await oauthServerService.validateClientCredentials(clientId, clientSecret);
      if (!isValidClient) {
        return NextResponse.json(
          { error: 'invalid_client', error_description: 'Client authentication failed' },
          { status: 401 }
        );
      }
    } else {
      // For public clients, ensure PKCE is being used
      if (grantType === 'authorization_code' && !codeVerifier) {
        return NextResponse.json(
          { error: 'invalid_request', error_description: 'code_verifier is required for public clients' },
          { status: 400 }
        );
      }
    }
    
    // Handle different grant types
    if (grantType === 'authorization_code') {
      // Validate required parameters
      if (!code) {
        return NextResponse.json(
          { error: 'invalid_request', error_description: 'code is required' },
          { status: 400 }
        );
      }
      
      if (!redirectUri) {
        return NextResponse.json(
          { error: 'invalid_request', error_description: 'redirect_uri is required' },
          { status: 400 }
        );
      }
      
      // Exchange code for tokens
      try {
        if (!codeVerifier) {
          console.error('Missing code_verifier in token request');
          return NextResponse.json(
            { error: 'invalid_request', error_description: 'code_verifier is required for PKCE' },
            { status: 400 }
          );
        }
        
        console.log('Exchanging code for tokens with client code_verifier:', codeVerifier);
        // We're using the client's code verifier directly
        const tokens = await oauthServerService.exchangeCodeForTokens(code, codeVerifier);
        return NextResponse.json(tokens);
      } catch (error) {
        console.error('Error exchanging code for tokens:', error);
        return NextResponse.json(
          { 
            error: 'invalid_grant', 
            error_description: error instanceof Error ? error.message : 'Invalid authorization code'
          },
          { status: 400 }
        );
      }
    } else if (grantType === 'refresh_token') {
      // Validate required parameters
      if (!refreshToken) {
        return NextResponse.json(
          { error: 'invalid_request', error_description: 'refresh_token is required' },
          { status: 400 }
        );
      }
      
      // Refresh access token
      try {
        const tokens = await oauthServerService.refreshAccessToken(refreshToken);
        return NextResponse.json(tokens);
      } catch (error) {
        console.error('Error refreshing access token:', error);
        return NextResponse.json(
          { error: 'invalid_grant', error_description: 'Invalid refresh token' },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'unsupported_grant_type', error_description: 'Unsupported grant type' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error in token endpoint:', error);
    
    return NextResponse.json(
      { 
        error: 'server_error',
        error_description: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}
