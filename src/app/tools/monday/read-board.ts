import { z } from 'zod';
import { defineTool } from '../core/types';
import { queryMondayApi } from './utils';

// Define the response type
type BoardItemsResponse = Array<Record<string, unknown>>;

export const readMondayBoard = defineTool({
  id: 'readMondayBoard',
  summary: 'Get items from a specific Monday board',
  description: 'Retrieves all items from the specified Monday board. The items can be arbitrary JSON objects.',
  method: 'GET',
  path: '/tools/monday/read_board',
  parameters: z.object({
    boardId: z.string().describe('The unique identifier of the Monday board.')
  }),
  responses: {
    '200': {
      description: 'A JSON array of board items.',
      schema: z.array(z.record(z.unknown()).describe('Arbitrary JSON object representing a board item.'))
    }
  },
  handler: async ({ context, params }) => {
    const query = `query { boards (ids: ${params.boardId}) { name columns { id title type} items_page { items { id name column_values {id text value} group {id title}}}}}`;
    const result = await queryMondayApi(context.userId, query);
    
    // Transform the result to match the expected return type
    if (result.error) {
      throw new Error(JSON.stringify(result.content));
    }
    
    // Extract the items from the response
    const content = result.content as Record<string, unknown>;
    const boards = (content.boards as Array<Record<string, unknown>>) || [];
    
    if (boards.length === 0) {
      return [] as BoardItemsResponse;
    }
    
    const board = boards[0];
    const itemsPage = board.items_page as Record<string, unknown> || {};
    const items = (itemsPage.items as Array<Record<string, unknown>>) || [];
    
    // Return the items as is, since they're arbitrary JSON objects
    return items as BoardItemsResponse;
  }
});
