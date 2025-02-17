import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { oauthService } from '@/services/oauth-service';
import { storeOAuthTokens } from '@/db';
import { getRequestOrigin } from '@/utils/get-request-origin';
import { stateStore } from '@/services/state-store';

export async function GET(
  request: Request,
  { params }: { params: { provider: string } }
) {
  try {
    const session = await auth();
    if (!session.userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      // Redirect to error page
      return NextResponse.redirect(new URL('/settings/connections?error=oauth_denied', getRequestOrigin(request)));
    }

    if (!code || !state) {
      return new NextResponse('Missing code or state', { status: 400 });
    }

    // Validate state
    const storedState = stateStore.get(state);
    if (!storedState || storedState.provider !== params.provider) {
      return new NextResponse('Invalid state', { status: 400 });
    }

    // Clean up used state
    stateStore.delete(state);

    // Exchange code for tokens
    const tokens = await oauthService.exchangeCodeForTokens(params.provider, code);

    // Store tokens in database
    await storeOAuthTokens(session.userId, params.provider, tokens);

    // Redirect to success page
    return NextResponse.redirect(new URL('/dashboard', getRequestOrigin(request)));
  } catch (error) {
    console.error('Error in OAuth callback:', error);
    return NextResponse.redirect(new URL('/settings/connections?error=exchange_failed', getRequestOrigin(request)));
  }
}
