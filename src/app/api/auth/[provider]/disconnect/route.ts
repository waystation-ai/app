import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import { removeOAuthConnection } from '@/lib/db';
import { redirect } from 'next/navigation';
import { getProviderConfig } from '@/lib/services/provider-config';

export async function GET(request: Request, { params }: { params: Promise<{ provider: string }> }) {
  const session = await auth();
  if (!session?.userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Validate provider
  const { provider } = await params;
  try {
    getProviderConfig(provider);
  } catch {
    return new NextResponse('Invalid provider', { status: 400 });
  }

  const url = new URL(request.url);
  const redirectUrl = url.searchParams.get('redirectUrl');

  await removeOAuthConnection(session.userId, provider);
  return redirect(redirectUrl || '/app');
}
