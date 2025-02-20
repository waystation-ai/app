import { NextRequest, NextResponse } from 'next/server';
import { queryMondayApi } from '../utils';
import { authenticateRequest } from '../../shared/utils';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const userId = await authenticateRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const reqJson = await request.json();
    console.log(reqJson);
    
    const { board_id, item_id, column_values } = reqJson;

    if (!board_id || !item_id || !column_values) {
      return NextResponse.json(
        { error: 'Missing required parameters: board_id, item_id and column_values are required' },
        { status: 400 }
      );
    }

    // Convert column_values object to JSON string for the GraphQL mutation
    const columnValuesJson = JSON.stringify(column_values || {});

    const query = `mutation {
      change_multiple_column_values(
        board_id: ${board_id},
        item_id: ${item_id},
        column_values: "${columnValuesJson}"
      ) {
        id
        url
      }
    }`;

    return await queryMondayApi(userId, query);
  } catch (error) {
    console.error('Error updating Monday item:', error);
    return NextResponse.json(
      { error: 'Failed to update item' },
      { status: 500 }
    );
  }
}
