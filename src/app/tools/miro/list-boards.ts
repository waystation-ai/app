import { z } from 'zod';
import { defineTool } from '../core/types';
import { callMiroApi } from './utils';

// Define the response type to match the schema
type BoardsResponse = Array<{
  id: string;
  name: string;
  description: string;
  viewLink: string;
  createdAt: string;
  updatedAt: string;
}>;

export const listMiroBoards = defineTool({
  id: 'listMiroBoards',
  summary: 'Get a list of user\'s boards from Miro',
  description: 'Retrieves a list of boards associated with the authenticated user from Miro.',
  method: 'GET',
  path: '/tools/miro/list_boards',
  parameters: z.object({}), // No parameters needed
  responses: {
    '200': {
      description: 'A JSON array of user boards',
      schema: z.array(z.object({
        id: z.string().describe('Unique identifier for the board'),
        name: z.string().describe('Name of the board'),
        description: z.string().describe('Description of the board'),
        viewLink: z.string().describe('URL to view the board'),
        createdAt: z.string().describe('Creation timestamp'),
        updatedAt: z.string().describe('Last update timestamp')
      }))
    }
  },
  handler: async ({ context }) => {
    const result = await callMiroApi(context, '/boards');
    
    if (result.error) {
      throw new Error(JSON.stringify(result.content));
    }
    
    // Extract the boards from the response and map to the expected format
    const content = result.content as { data?: Array<Record<string, unknown>> };
    const boards = content.data || [];
    
    return boards.map((board) => ({
      id: board.id as string,
      name: board.name as string,
      description: (board.description as string) || '',
      viewLink: board.viewLink as string,
      createdAt: board.createdAt as string,
      updatedAt: board.modifiedAt as string || board.createdAt as string
    })) as BoardsResponse;
  }
});
