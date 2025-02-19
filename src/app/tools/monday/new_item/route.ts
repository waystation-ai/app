import { NextRequest, NextResponse } from 'next/server';
import { queryMondayApi } from '../utils';
import { authenticateRequest } from '../../shared/utils';

export async function POST(request: NextRequest) {
  // Authenticate request
  const userId = await authenticateRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Parse request body
    const body = await request.json();
    const { board_id, group_id, item_name, column_values } = body;

    // Validate required fields
    if (!board_id || !group_id || !item_name) {
      return NextResponse.json(
        { error: 'Missing required fields: board_id, group_id, and item_name are required' },
        { status: 400 }
      );
    }

    // Create GraphQL mutation
    const mutation = `
      mutation {
        create_item (
          board_id: ${board_id},
          group_id: "${group_id}",
          item_name: "${item_name}"
          ${column_values ? `, column_values: ${JSON.stringify(JSON.stringify(column_values))}` : ''}
        ) {
          id
          url
        }
      }
    `;

    // Execute mutation and return new item id and url
    return await queryMondayApi(userId, mutation);
  } catch (error) {
    console.error('Error creating Monday item:', error);
    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    );
  }
}
