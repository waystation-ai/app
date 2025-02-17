import { NextResponse } from 'next/server';
import { oauthService } from '@/services/oauth-service';

export async function GET() {
  try {
    const accessToken = await oauthService.getValidAccessToken('monday');
    
    const response = await fetch('https://api.monday.com/v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': accessToken
      },
      body: JSON.stringify({
        query: `query { boards { id name } }`
      })
    });

    if (!response.ok) {
      return NextResponse.json([]);
    }

    const data = await response.json();
    return NextResponse.json(data.data.boards || []);
  } catch (error) {
    // Return empty list if no valid token or other errors
    return NextResponse.json([]);
  }
}
