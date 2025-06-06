import { NextRequest, NextResponse } from 'next/server';
import { oauthServerService } from '@/lib/services/oauth-server';

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
    const token = body.token;
    const tokenTypeHint = body.token_type_hint;
    
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
    
    // Validate client credentials
    if (!clientId || !clientSecret) {
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
    
    // Validate required parameters
    if (!token) {
      return NextResponse.json(
        { error: 'invalid_request', error_description: 'token is required' },
        { status: 400 }
      );
    }
    
    // Revoke token
    try {
      await oauthServerService.revokeToken(token, tokenTypeHint);
      
      // Return empty response with 200 status
      return new NextResponse(null, { status: 200 });
    } catch (error) {
      console.error('Error revoking token:', error);
      
      return NextResponse.json(
        { 
          error: 'server_error',
          error_description: error instanceof Error ? error.message : 'Unknown error'
        }, 
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in revocation endpoint:', error);
    
    return NextResponse.json(
      { 
        error: 'server_error',
        error_description: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}
