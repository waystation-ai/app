import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { oauthService } from '@/app/lib/services/oauth-service';

export async function GET() {
  try {
    const session = await auth();
    if (!session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the access token
    const accessToken = await oauthService.getValidAccessToken('google', session.userId);
    
    // Get the API key
    const apiKey = process.env.GOOGLE_API_KEY || '';
    
    if (!apiKey) {
      console.error('GOOGLE_API_KEY environment variable is not set');
      return NextResponse.json(
        { error: 'API key configuration missing' },
        { status: 500 }
      );
    }
    
    // Return both in a single response
    return NextResponse.json({ 
      accessToken,
      apiKey
    });
  } catch (error) {
    console.error('Error retrieving Google credentials:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve credentials' },
      { status: 500 }
    );
  }
}