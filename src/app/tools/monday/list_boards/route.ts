import { NextRequest, NextResponse } from 'next/server';
import { oauthService } from '@/services/oauth-service';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    let userId = session.userId;
    if (!userId) {
      console.log('Session userId is missing');
      const accessToken = request.headers.get('Authorization');

      if (accessToken) {
        const response = await fetch('https://clerk.waystation.ai/oauth/userinfo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': accessToken as string
          }
        });
        console.log(response);
        
        if (response.ok) {
          const data = await response.json();
          console.log(data);

          userId = data.user_id;
        }
      };
    }

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const accessToken = await oauthService.getValidAccessToken('monday', userId);
    
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
    return NextResponse.json(error);
  }
}
