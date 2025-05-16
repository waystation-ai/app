import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { nanoIds } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';

export async function authUserId(): Promise<string | null> {
  const session = await auth();
    
  if (session.userId)
    return session.userId;

  const _headers = await headers();

  const nanoId = _headers.get('X-Nanoid');

  // Attempt authentication with nano ID first if provided
  if (nanoId) {
    const nanoIdEntry = await db.query.nanoIds.findFirst({
      where: eq(nanoIds.nanoId, nanoId),
    });
    if (nanoIdEntry) {
      return nanoIdEntry.userId;
    } else {
      console.log(`Invalid nano ID provided: ${nanoId}`);
      return null; // Invalid nano ID, immediately return unauthorized
    }
  }

  // If not authenticated by nano ID, try JWT
  console.log('Session userId is missing, checking Authorization header');
  const accessToken = _headers.get('Authorization');

  if (accessToken) {
    try {
      // Assuming the token is a Clerk JWT, verify it
      // Note: A more robust solution would involve verifying the JWT signature
      // For simplicity here, we'll use the userinfo endpoint as in the original code
      const response = await fetch(`https://clerk.${process.env.APP_DOMAIN}/oauth/userinfo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': accessToken
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.user_id;
        console.log(`Authenticated via JWT for userId: ${data.userId}`);
      } else {
        console.log(`JWT verification failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error verifying JWT:', error);
    }
  }

  return null;
}
