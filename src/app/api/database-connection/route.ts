import { NextRequest, NextResponse } from 'next/server';
import { addConnection } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const { provider, name, connectionString } = await request.json();

    if (!provider || !name || !connectionString) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'You must be signed in to store a connection string' },
        { status: 401 }
      );
    }

    // Store the connection directly
    await addConnection(userId, provider, name, { connectionString });

    // Revalidate the path to update the UI
    revalidatePath('/');
    revalidatePath('/app');
    revalidatePath('/app/integrations');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error storing database connection:', error);
    return NextResponse.json(
      { error: 'Failed to store connection string' },
      { status: 500 }
    );
  }
}