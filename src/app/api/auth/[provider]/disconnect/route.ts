import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import { removeOAuthConnection } from '@/db';
import { redirect } from 'next/navigation';
import { getProviderConfig } from '@/config/oauth-providers';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
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

  await removeOAuthConnection(session.userId, provider);
  return redirect('/dashboard');
}
