import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ToolResult } from '@/marketplace/core/types';
import { db } from '@/lib/db';
import { nanoIds } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function authenticateRequest(request: NextRequest, nanoId?: string): Promise<string | null> {
  let userId: string | null = null;

  // Attempt authentication with nano ID first if provided
  if (nanoId) {
    const nanoIdEntry = await db.query.nanoIds.findFirst({
      where: eq(nanoIds.nanoId, nanoId),
    });
    if (nanoIdEntry) {
      userId = nanoIdEntry.userId;
    } else {
      console.log(`Invalid nano ID provided: ${nanoId}`);
      return null; // Invalid nano ID, immediately return unauthorized
    }
  }

  // If not authenticated by nano ID, try Clerk session or JWT
  if (!userId) {
    const session = await auth();
    userId = session.userId;

    if (!userId) {
      console.log('Session userId is missing, checking Authorization header');
      const accessToken = request.headers.get('Authorization');

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
            userId = data.user_id;
            console.log(`Authenticated via JWT for userId: ${userId}`);
          } else {
            console.log(`JWT verification failed with status: ${response.status}`);
          }
        } catch (error) {
          console.error('Error verifying JWT:', error);
        }
      }
    } else {
      console.log(`Authenticated via Clerk session for userId: ${userId}`);
    }
  }

  return userId;
}

export function nextResponse(result: ToolResult) {
  return NextResponse.json(result.content, { status: result.error ? 500 : 200 });
}
