import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { oauthService } from '@/app/lib/services/oauth-service';
import { storeOAuthTokens } from '@/app/lib/db';
import { getRequestOrigin } from '@/app/lib/utils/get-request-origin';
import { stateStore } from '@/app/lib/services/state-store';

export async function GET(request: NextRequest, { params }: { params: Promise<{ provider: string }> }) {
  try {
    const session = await auth();
    if (!session.userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { provider } = await params;

    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      // Redirect to error page
      return NextResponse.redirect(new URL(`/connect/denied?provider=${provider}`, getRequestOrigin(request)));
    }

    if (!code || !state) {
      return new NextResponse('Missing code or state', { status: 400 });
    }


    // Validate state
    const storedState = await stateStore.getState(state);
    if (!storedState || storedState.provider !== provider || storedState.userId !== session.userId) {
      return new NextResponse('Invalid state', { status: 400 });
    }

    // Exchange code for tokens with PKCE for Airtable
    const tokens = await oauthService.exchangeCodeForTokens(provider, code, storedState.codeVerifier);

    // Store tokens in database
    await storeOAuthTokens(session.userId, provider, tokens);
    
    // Clean up used state after successful token exchange and storage
    await stateStore.deleteState(state);

    // Always redirect to dashboard, but include redirect_uri as a query parameter if it exists
    const dashboardUrl = new URL('/dashboard', getRequestOrigin(request));
    
    // For providers with settings, add the justConnected flag
    const providersWithSettings = ['gdrive'];
    if (providersWithSettings.includes(provider)) {
      dashboardUrl.searchParams.append('justConnected', 'true');
    }
    
    // Add the redirect_uri as a query parameter if it exists
    if (storedState.redirectUri) {
      dashboardUrl.searchParams.append('redirect_uri', storedState.redirectUri);
    }
    
    return NextResponse.redirect(dashboardUrl);
  } catch (error) {
    console.error('Error in OAuth callback:', error);
    return NextResponse.redirect(new URL('/settings/connections?error=exchange_failed', getRequestOrigin(request)));
  }
}
