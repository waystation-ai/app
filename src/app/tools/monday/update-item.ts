import { z } from 'zod';
import { defineTool } from '../core/types';
import { queryMondayApi } from './utils';

// Define the response type
interface UpdateItemResponse {
  id: string;
  url: string;
}

export const updateMondayItem = defineTool({
  id: 'updateMondayItem',
  summary: 'Update an existing item in a Monday board',
  description: 'Updates an existing item in the specified Monday board with new column values. The `column_values` parameter is **required** and should always include the updated field(s) in `{ "column_id": "new_value" }` format.',
  method: 'POST',
  path: '/tools/monday/update_item',
  parameters: z.object({
    board_id: z.string().describe('The unique identifier of the Monday board'),
    item_id: z.string().describe('The unique identifier of the item to update'),
    column_values: z.object({})
      .catchall(z.unknown())
      .describe('Object containing column values to update for the item. Example: { "status": "Planning", "person": "1324234" }')
  }),
  responses: {
    '200': {
      description: 'Successfully updated item',
      schema: z.object({
        id: z.string().describe('Unique identifier of the updated item'),
        url: z.string().describe('URL to access the item in Monday.com')
      })
    }
  },
  handler: async ({ context, params }) => {
    const columnValuesJson = JSON.stringify(params.column_values || {});

    const query = `mutation {
      change_multiple_column_values(
        board_id: ${params.board_id},
        item_id: ${params.item_id},
        column_values: ${JSON.stringify(columnValuesJson)}
      ) {
        id
        url
      }
    }`;  

    const result = await queryMondayApi(context.userId, query);
    
    // Transform the result to match the expected return type
    if (result.error) {
      throw new Error(JSON.stringify(result.content));
    }
    
    // Extract the updated item from the response
    const content = result.content as Record<string, unknown>;
    const changeValues = content.change_multiple_column_values as Record<string, unknown>;
    
    return {
      id: changeValues.id as string,
      url: changeValues.url as string
    } as UpdateItemResponse;
  }
});
