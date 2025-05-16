import { NextRequest } from 'next/server';
import { SSE } from '@/app/mcp/shared';

export async function GET(request: NextRequest) {
  return SSE(request);
}
