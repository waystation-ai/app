import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, queryMondayApi } from '../utils';

export async function POST(request: NextRequest) {
  // Authenticate request
  const userId = await authenticateRequest(request);
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // Parse request body
    const body = await request.json();
    const { board_id, group_id, item_name, column_values } = body;

    // Validate required fields
    if (!board_id || !group_id || !item_name) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Create GraphQL mutation
    const mutation = `
      mutation {
        create_item (
          board_id: ${board_id},
          group_id: "${group_id}",
          item_name: "${item_name}"
          ${column_values ? `, column_values: ${JSON.stringify(column_values)}` : ''}
        ) {
          id
        }
      }
    `;

    // Execute mutation and return new item id
    return await queryMondayApi(userId, mutation);
  } catch (error) {
    console.error('Error creating Monday item:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
