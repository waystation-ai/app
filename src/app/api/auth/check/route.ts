import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await auth();
  return NextResponse.json({ isSignedIn: !!session?.userId });
}
