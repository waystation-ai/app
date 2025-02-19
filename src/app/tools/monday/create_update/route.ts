import { NextRequest, NextResponse } from 'next/server';
import { queryMondayApi } from '../utils';
import { authenticateRequest } from '../../shared/utils';

export async function POST(request: NextRequest) {
  const userId = await authenticateRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { item_id, body, parent_id } = await request.json();

    if (!item_id || !body) {
      return NextResponse.json(
        { error: 'Missing required fields: item_id and body are required' },
        { status: 400 }
      );
    }

    const mutation = `
      mutation ($itemId: ID!, $body: String!, $parentId: ID) {
        create_update (
          item_id: $itemId,
          body: $body
          parent_id: $parentId
        ) {
          id
          body
          created_at
        }
      }
    `;

    const variables = {
      itemId: item_id,
      body: body,
      ...(parent_id && { parentId: parent_id })
    };

    return await queryMondayApi(userId, mutation, variables);
  } catch (error) {
    console.error('Error creating update:', error);
    return NextResponse.json(
      { error: 'Failed to create update' },
      { status: 500 }
    );
  }
}
