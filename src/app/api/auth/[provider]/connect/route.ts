import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { oauthService } from '@/services/oauth-service';
import { getProviderConfig } from '@/config/oauth-providers';

// Store state in memory for now. In production, use Redis or similar
const stateStore = new Map<string, { state: string; provider: string }>();

export async function GET(
  request: Request,
  { params }: { params: { provider: string } }
) {
  try {
    const session = await auth();
    if (!session.userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Validate provider
    const provider = params.provider;
    try {
      getProviderConfig(provider);
    } catch {
      return new NextResponse('Invalid provider', { status: 400 });
    }

    // Generate authorization URL with state
    const { url, state } = oauthService.buildAuthorizationUrl(provider);

    // Store state for validation in callback
    stateStore.set(state, { state, provider });

    // Clean up old states (those older than 5 minutes)
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    stateStore.forEach((value, key) => {
      if (parseInt(key.split('_')[1]) < fiveMinutesAgo) {
        stateStore.delete(key);
      }
    });

    return NextResponse.redirect(url);
  } catch (error) {
    console.error('Error initiating OAuth flow:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
