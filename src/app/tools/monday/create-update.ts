import { z } from 'zod';
import { defineTool } from '../core/types';
import { queryMondayApi } from './utils';

// Define the response type
interface CreateUpdateResponse {
  id: string;
  body: string;
  created_at: string;
}

export const createMondayUpdate = defineTool({
  id: 'createMondayUpdate',
  summary: 'Create a new update on a Monday.com item',
  description: 'Creates a new update (comment) on the specified Monday.com item with optional parent_id for threaded replies.',
  method: 'POST',
  path: '/tools/monday/create_update',
  parameters: z.object({
    item_id: z.string().describe('The unique identifier of the item to add the update to'),
    body: z.string().describe('The text content of the update'),
    parent_id: z.string().optional().describe('Optional ID of the parent update for threaded replies')
  }),
  responses: {
    '200': {
      description: 'Successfully created update',
      schema: z.object({
        id: z.string().describe('Unique identifier of the created update'),
        body: z.string().describe('Text content of the update'),
        created_at: z.string().describe('Timestamp when the update was created')
      })
    }
  },
  handler: async ({ context, params }) => {
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
      itemId: params.item_id,
      body: params.body,
      ...(params.parent_id && { parentId: params.parent_id })
    };

    const result = await queryMondayApi(context.userId, mutation, variables);
    
    // Transform the result to match the expected return type
    if (result.error) {
      throw new Error(JSON.stringify(result.content));
    }
    
    // Extract the created update from the response
    const content = result.content as Record<string, unknown>;
    const createUpdate = content.create_update as Record<string, unknown>;
    
    return {
      id: createUpdate.id as string,
      body: createUpdate.body as string,
      created_at: createUpdate.created_at as string
    } as CreateUpdateResponse;
  }
});
