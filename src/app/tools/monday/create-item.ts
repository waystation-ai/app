import { z } from 'zod';
import { defineTool } from '../core/types';
import { queryMondayApi } from './utils';

// Define the response type
interface CreateItemResponse {
  id: string;
  url: string;
}

export const createMondayItem = defineTool({
  id: 'createMondayItem',
  summary: 'Create a new item in a Monday board',
  description: 'Creates a new item in the specified Monday board and group with optional column values. The `column_values` parameter should follow the format `{ "column_id": "value" }` for each column to be set.',
  method: 'POST',
  path: '/tools/monday/new_item',
  parameters: z.object({
    board_id: z.string().describe('The unique identifier of the Monday board'),
    group_id: z.string().describe('The unique identifier of the group within the board'),
    item_name: z.string().describe('Name of the new item to create'),
    column_values: z.object({})
      .catchall(z.unknown())
      .optional()
      .describe('Object containing column values for the new item. Example: { "status": "Planning", "person": "1324234" }')
  }),
  responses: {
    '200': {
      description: 'Successfully created item',
      schema: z.object({
        id: z.string().describe('Unique identifier of the created item'),
        url: z.string().describe('URL to access the item in Monday.com')
      })
    }
  },
  handler: async ({ context, params }) => {
    const mutation = `
      mutation {
        create_item (
          board_id: ${params.board_id},
          group_id: "${params.group_id}",
          item_name: "${params.item_name}"
          ${params.column_values ? `, column_values: ${JSON.stringify(JSON.stringify(params.column_values))}` : ''}
        ) {
          id
          url
        }
      }
    `;
    
    const result = await queryMondayApi(context.userId, mutation);
    
    // Transform the result to match the expected return type
    if (result.error) {
      throw new Error(JSON.stringify(result.content));
    }
    
    // Extract the created item from the response
    const content = result.content as Record<string, unknown>;
    const createItem = content.create_item as Record<string, unknown>;
    
    return {
      id: createItem.id as string,
      url: createItem.url as string
    } as CreateItemResponse;
  }
});
