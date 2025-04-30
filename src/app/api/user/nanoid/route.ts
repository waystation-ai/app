import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { generateNanoidForUser } from '@/lib/utils/generate-nanoid-for-user';

export async function GET(request: NextRequest) {
  try {
    // Authenticate user using Clerk
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get or generate the nano ID for the user
    const nanoId = await generateNanoidForUser(userId);

    return NextResponse.json({ nanoId });
  } catch (error) {
    console.error('Error fetching nano ID:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate user using Clerk
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Regenerate the nano ID for the user
    const nanoId = await generateNanoidForUser(userId, true);

    return NextResponse.json({ nanoId });
  } catch (error) {
    console.error('Error regenerating nano ID:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
