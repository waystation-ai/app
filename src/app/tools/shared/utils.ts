import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';

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
