import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getValidConnections, removeOAuthConnection } from '@/lib/db';

export async function GET() {
  try {
    const session = await auth();
    if (!session.userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const connectionsMap = await getValidConnections(session.userId);
    
    // Don't expose sensitive data
    const safeConnections = Array.from(connectionsMap.values()).map(conn => ({
      provider: conn.provider,
      connectedAt: conn.createdAt,
      lastUsed: conn.updatedAt
    }));

    return NextResponse.json(safeConnections);
  } catch (error) {
    console.error('Error fetching connections:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session.userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { provider } = await request.json();
    if (!provider) {
      return new NextResponse('Provider is required', { status: 400 });
    }

    await removeOAuthConnection(session.userId, provider);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error removing connection:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
