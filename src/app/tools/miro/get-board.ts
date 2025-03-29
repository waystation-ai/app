import { z } from 'zod';
import { defineTool } from '../core/types';
import { callMiroApi } from './utils';

export const getMiroBoard = defineTool({
  id: 'getMiroBoard',
  summary: 'Get details of a specific Miro board and its items',
  description: 'Retrieves detailed information about a specific Miro board including its items (sticky notes, shapes, etc.).',
  method: 'GET',
  path: '/tools/miro/get_board',
  parameters: z.object({
    boardId: z.string().describe('The ID of the Miro board to retrieve')
  }),
  responses: {
    '200': {
      description: 'Board details and items',
      schema: z.object({
        board: z.object({
          id: z.string().describe('Unique identifier for the board'),
          name: z.string().describe('Name of the board'),
          description: z.string().describe('Description of the board'),
          viewLink: z.string().describe('URL to view the board'),
          createdAt: z.string().describe('Creation timestamp'),
          updatedAt: z.string().describe('Last update timestamp')
        }),
        items: z.array(z.object({
          id: z.string().describe('Unique identifier for the item'),
          type: z.string().describe('Type of the item (e.g., sticky_note, shape, text)'),
          data: z.record(z.unknown()).describe('Item-specific data')
        }))
      })
    }
  },
  handler: async ({ context, params }) => {
    // Get board details
    const boardResult = await callMiroApi(context, `/boards/${params.boardId}`);
    
    if (boardResult.error) {
      throw new Error(JSON.stringify(boardResult.content));
    }
    
    // Get board items with pagination
    let allItems: Array<Record<string, unknown>> = [];
    let nextCursor: string | undefined;

    do {
      const queryParams: Record<string, string> = {
        limit: '50'  // Always use 50 as the limit
      };
      
      if (nextCursor) {
        queryParams.cursor = nextCursor;
      }
      
      const itemsResult = await callMiroApi(
        context, 
        `/boards/${params.boardId}/items`, 
        'GET',
        undefined,
        queryParams
      );
      
      if (itemsResult.error) {
        throw new Error(JSON.stringify(itemsResult.content));
      }
      
      const itemsData = itemsResult.content as { 
        data?: Array<Record<string, unknown>>,
        cursor?: string 
      };
      
      if (itemsData.data && itemsData.data.length > 0) {
        console.log(`Fetched ${itemsData.data.length} items from Miro board`);
        allItems = [...allItems, ...itemsData.data];
      }
      
      nextCursor = itemsData.cursor;
      if (nextCursor) {
        console.log(`More items available, next cursor: ${nextCursor}`);
      }
      
    } while (nextCursor);
    
    console.log(`Total items fetched from Miro board: ${allItems.length}`);
    
    const boardData = boardResult.content as Record<string, unknown>;
    
    return {
      board: {
        id: boardData.id as string,
        name: boardData.name as string,
        description: (boardData.description as string) || '',
        viewLink: boardData.viewLink as string,
        createdAt: boardData.createdAt as string,
        updatedAt: boardData.modifiedAt as string || boardData.createdAt as string
      },
      items: allItems.map(item => ({
        id: item.id as string,
        type: item.type as string,
        data: item
      }))
    };
  }
});
