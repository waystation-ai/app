import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { checkWaitlistStatus, addToWaitlist } from '@/app/lib/db';

export async function POST(
  request: Request
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get provider from request body
    const { provider } = await request.json();
    if (!provider) {
      return new NextResponse('Provider is required', { status: 400 });
    }

    // Check if user is already on the waitlist for this provider
    const isOnWaitlist = await checkWaitlistStatus(session.userId, provider);

    // If already on waitlist, return success
    if (isOnWaitlist) {
      return NextResponse.json({ success: true, alreadyOnWaitlist: true });
    }

    // Add user to waitlist
    await addToWaitlist(session.userId, provider);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding to waitlist:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET(
  request: Request
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get provider from URL
    const url = new URL(request.url);
    const provider = url.searchParams.get('provider');
    if (!provider) {
      return new NextResponse('Provider is required', { status: 400 });
    }

    // Check if user is on the waitlist for this provider
    const isOnWaitlist = await checkWaitlistStatus(session.userId, provider);

    return NextResponse.json({ 
      isOnWaitlist 
    });
  } catch (error) {
    console.error('Error checking waitlist status:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
