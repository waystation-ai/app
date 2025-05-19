import { NextRequest } from 'next/server';
import { SSE } from '@/app/mcp/shared';

export async function GET(request: NextRequest, { params }: { params: Promise<{ nanoid: string }> }) {
  console.log(`[SSE-Route] SSE request received with nanoid parameter`);
  
  const {nanoid} = await params;
  console.log(`[SSE-Route] Extracted nanoid: ${nanoid.substring(0, 8)}...`);

  request.headers.set('X-Nanoid', nanoid);
  console.log(`[SSE-Route] Set X-Nanoid header, forwarding to SSE handler`);

  return SSE(request);
}
