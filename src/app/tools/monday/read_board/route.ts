import { NextRequest, NextResponse } from 'next/server';
import { queryMondayApi } from '../utils';
import { authenticateRequest } from '../../shared/utils';

export async function GET(request: NextRequest) {
  const boardId = request.nextUrl.searchParams.get('boardId');
  if (!boardId) {
    return new NextResponse('Missing board id', { status: 400 });
  }

  const userId = await authenticateRequest(request);
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const query = `query { boards (ids: ${boardId}) { name items_page { items { id name column_values {id text value} group {id title}}}}}`;
  return await queryMondayApi(userId, query);
}
