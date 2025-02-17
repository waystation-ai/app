import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { oauthService } from '@/services/oauth-service';
import { getProviderConfig } from '@/config/oauth-providers';

import { stateStore, cleanupOldStates } from '@/services/state-store';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  try {
    const session = await auth();
    if (!session.userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Validate provider
    const { provider } = await params;
    try {
      getProviderConfig(provider);
    } catch {
      return new NextResponse('Invalid provider', { status: 400 });
    }

    // Generate authorization URL with state
    const { url, state } = oauthService.buildAuthorizationUrl(provider);

    // Store state for validation in callback
    stateStore.set(state, { state, provider });

    // Clean up old states
    cleanupOldStates();

    return NextResponse.redirect(url);
  } catch (error) {
    console.error('Error initiating OAuth flow:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
