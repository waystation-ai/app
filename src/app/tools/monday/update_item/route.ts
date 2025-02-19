import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, queryMondayApi } from '../utils';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const userId = await authenticateRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { board_id, item_id, column_values } = await request.json();

    if (!board_id || !item_id) {
      return NextResponse.json(
        { error: 'Missing required parameters: board_id and item_id are required' },
        { status: 400 }
      );
    }

    // Convert column_values object to JSON string for the GraphQL mutation
    const columnValuesJson = JSON.stringify(column_values || {});

    const query = `mutation {
      change_multiple_column_values(
        board_id: ${board_id},
        item_id: ${item_id},
        column_values: ${JSON.stringify(columnValuesJson)}
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
