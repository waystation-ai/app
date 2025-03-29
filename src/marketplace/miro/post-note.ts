import { z } from 'zod';
import { defineTool } from '../core/types';
import { callMiroApi } from './utils';

export const postMiroNote = defineTool({
  id: 'postMiroNote',
  summary: 'Create a sticky note on a Miro board',
  description: 'Adds a new sticky note with specified content to a Miro board at the given position.',
  method: 'POST',
  path: '/tools/miro/post_note',
  parameters: z.object({
    boardId: z.string().describe('The ID of the Miro board to add the note to'),
    content: z.string().describe('The text content of the sticky note'),
    color: z.string().optional().describe('The color of the sticky note (e.g., "yellow", "blue", "green", "pink", "purple")'),
    x: z.number().optional().describe('X coordinate position on the board (default: 0)'),
    y: z.number().optional().describe('Y coordinate position on the board (default: 0)'),
  }),
  responses: {
    '200': {
      description: 'Created sticky note details',
      schema: z.object({
        id: z.string().describe('Unique identifier for the created sticky note'),
        type: z.string().describe('Type of the item (sticky_note)'),
        content: z.string().describe('Text content of the sticky note'),
        position: z.object({
          x: z.number().describe('X coordinate position'),
          y: z.number().describe('Y coordinate position')
        })
      })
    }
  },
  handler: async ({ context, params }) => {
    const { boardId, content, color = 'yellow', x = 0, y = 0 } = params;
    
    const body = {
      data: {
        content: content
      },
      style: {
        fillColor: color
      },
      position: {
        x: x,
        y: y
      }
    };
    
    const result = await callMiroApi(
      context, 
      `/boards/${boardId}/sticky_notes`, 
      'POST', 
      body
    );
    
    if (result.error) {
      throw new Error(JSON.stringify(result.content));
    }
    
    const noteData = result.content as Record<string, unknown>;
    
    return {
      id: noteData.id as string,
      type: 'sticky_note',
      content: content,
      position: {
        x: x,
        y: y
      }
    };
  }
});
