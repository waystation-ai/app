import { NextRequest } from 'next/server';
import { SSE } from '../shared';

export async function GET(request: NextRequest) {
  return SSE(request);
}
