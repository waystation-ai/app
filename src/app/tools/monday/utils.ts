import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { oauthService } from '@/services/oauth-service';

export async function authenticateRequest(request: NextRequest): Promise<string | null> {
  const session = await auth();
  let userId = session.userId;

  if (!userId) {
    console.log('Session userId is missing');
    const accessToken = request.headers.get('Authorization');

    if (accessToken) {
      const response = await fetch(`https://clerk.waystation.ai/oauth/userinfo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': accessToken
        }
      });
      console.log(response);
      
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        userId = data.user_id;
      }
    }
  }

  return userId;
}

export async function queryMondayApi(userId: string, query: string, selector: (data: unknown) => unknown): Promise<NextResponse> {
  try {
    const accessToken = await oauthService.getValidAccessToken('monday', userId);
      
    const response = await fetch('https://api.monday.com/v2', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': accessToken
        },
        body: JSON.stringify({ query })
    });

    if (!response.ok) {
        const {errors} = await response.json();
        return NextResponse.json(errors);
    }

    const data = await response.json();
    return NextResponse.json(selector(data.data));
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return NextResponse.json(error.message);
    }

    console.log(error);
    return NextResponse.json(error);
  }
}
