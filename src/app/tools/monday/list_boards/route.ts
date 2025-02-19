import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, queryMondayApi } from '../utils';

export async function GET(request: NextRequest) {
  const userId = await authenticateRequest(request);
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const query = `query { boards { id name item_terminology items_count url groups {id title}} }`;
  return await queryMondayApi(userId, query, (data) => data.boards);
}
