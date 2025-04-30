import { NextRequest } from 'next/server';
import { SSE } from '../../shared';

export async function GET(request: NextRequest, { params }: { params: Promise<{ nanoid: string }> }) {
  const {nanoid} = await params;

  return SSE(request, nanoid);
}
