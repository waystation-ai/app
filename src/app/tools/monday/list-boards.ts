import { z } from 'zod';
import { defineTool } from '../core/types';
import { queryMondayApi } from './utils';

// Define the response type to match the schema
type BoardsResponse = Array<{
  id: string;
  name: string;
}>;

export const listMondayBoards = defineTool({
  id: 'listMondayBoards',
  summary: 'Get a list of user\'s boards from Monday',
  description: 'Retrieves a list of boards associated with the authenticated user from Monday.',
  method: 'GET',
  path: '/tools/monday/list_boards',
  parameters: z.object({}), // No parameters needed
  responses: {
    '200': {
      description: 'A JSON array of user boards',
      schema: z.array(z.object({
        id: z.string().describe('Unique identifier for the board'),
        name: z.string().describe('Name of the board')
      }))
    }
  },
  handler: async ({ context }) => {
    const query = `query { boards { id name item_terminology items_count url groups {id title}} }`;
    const result = await queryMondayApi(context.userId, query);
    
    // Transform the result to match the expected return type
    if (result.error) {
      throw new Error(JSON.stringify(result.content));
    }
    
    // Extract the boards from the response and map to the expected format
    const content = result.content as Record<string, unknown>;
    const boards = (content.boards as Array<Record<string, unknown>>) || [];
    return boards.map((board) => ({
      id: board.id,
      name: board.name
    })) as BoardsResponse;
  }
});
