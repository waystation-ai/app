import { NextRequest } from 'next/server';
import { SSE } from '@/app/mcp/shared';

export async function GET(request: NextRequest, { params }: { params: Promise<{ nanoid: string }> }) {
  const {nanoid} = await params;

  request.headers.set('X-Nanoid', nanoid);

  return SSE(request);
}
