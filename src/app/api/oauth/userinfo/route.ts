import { NextRequest, NextResponse } from 'next/server';
import { oauthServerService } from '@/lib/services/oauth-server';

export async function GET(request: NextRequest) {
  try {
    // Extract access token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'invalid_request', error_description: 'Missing or invalid Authorization header' },
        { status: 401 }
      );
    }
    
    const accessToken = authHeader.slice(7);
    
    // Get user info
    try {
      const userInfo = await oauthServerService.getUserInfo(accessToken);
      return NextResponse.json(userInfo);
    } catch (error) {
      console.error('Error getting user info:', error);
      
      return NextResponse.json(
        { error: 'invalid_token', error_description: 'Invalid access token' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error in userinfo endpoint:', error);
    
    return NextResponse.json(
      { 
        error: 'server_error',
        error_description: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}
