import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { oauthService } from '@/lib/services/oauth-client';
import { getProviderConfig } from '@/lib/services/provider-config';
import { isNativeProvider } from '@/marketplace/core/types';

import { stateStore } from '@/lib/services/state-store';

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
    let providerConfig;
    try {
      providerConfig = getProviderConfig(provider);
    } catch {
      return new NextResponse('Invalid provider', { status: 400 });
    }

    // Check if this is a connection string provider and redirect to setup page
    if (isNativeProvider(providerConfig) && providerConfig.auth?.type === 'connection_string') {
      const requestUrl = new URL(request.url);
      return NextResponse.redirect(new URL(`/connect/${provider}/setup`, requestUrl.origin));
    }

    // Generate authorization URL with state and PKCE for OAuth providers
    const { url, state, codeVerifier } = await oauthService.buildAuthorizationUrl(session.userId, provider);

    // Extract redirect_uri from request URL
    const requestUrl = new URL(request.url);
    const redirectUri = requestUrl.searchParams.get('redirect_uri');

    // Store state and code verifier for validation in callback
    await stateStore.saveState({
      state,
      provider,
      codeVerifier,
      userId: session.userId,
      redirectUri: redirectUri || undefined
    });

    // Clean up expired states
    await stateStore.cleanupExpiredStates();

    return NextResponse.redirect(url);
  } catch (error) {
    console.error('Error initiating OAuth flow:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
