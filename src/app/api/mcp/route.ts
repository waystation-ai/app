import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();
    if (!session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { getToken } = await auth();
    const template = 'mcp';
    const token = await getToken({ template });

    return NextResponse.json({token});
  
  } catch (error) {
    console.error('Error MCP token:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve MCP token' },
      { status: 500 }
    );
  }
}