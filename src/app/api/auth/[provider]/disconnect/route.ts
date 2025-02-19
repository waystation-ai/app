import { auth } from '@clerk/nextjs/server';
import { removeOAuthConnection } from '@/db';
import { redirect } from 'next/navigation';

export async function GET(
  request: Request,
  { params }: { params: { provider: string } }
) {
  const session = await auth();
  if (!session?.userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  await removeOAuthConnection(session.userId, params.provider);
  return redirect('/dashboard');
}
