import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export interface ToolContext {
  userId: string;
}

export interface ToolResult {
  error: boolean;
  content: unknown;
};


export async function authenticateRequest(request: NextRequest): Promise<string | null> {
  const session = await auth();
  let userId = session.userId;

  if (!userId) {
    console.log('Session userId is missing');
    const accessToken = request.headers.get('Authorization');

    if (accessToken) {
      const response = await fetch(`https://clerk.${process.env.APP_DOMAIN}/oauth/userinfo`, {
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

export function nextResponse(result: ToolResult) {
  return NextResponse.json(result.content, { status: result.error ? 500 : 200 });
}
