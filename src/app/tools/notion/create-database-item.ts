import { z } from 'zod';
import { defineTool } from '../core/types';
import { queryNotionApi, formatDatabaseProperties } from './utils';

export const createNotionDatabaseItem = defineTool({
  id: 'createNotionDatabaseItem',
  summary: 'Create a new item in a Notion database',
  description: 'Creates a new item with specified properties in a Notion database.',
  method: 'POST',
  path: '/tools/notion/create_database_item',
  parameters: z.object({
    databaseId: z.string().describe('ID of the database to add the item to'),
    properties: z.object({}).catchall(z.unknown()).describe('Properties for the new database item')
  }),
  responses: {
    '200': {
      description: 'The created database item',
      schema: z.object({
        id: z.string(),
        url: z.string()
      })
    }
  },
  handler: async ({ context, params }) => {
    const result = await queryNotionApi(
      context.userId,
      '/pages',
      'POST',
      {
        parent: { database_id: params.databaseId },
        properties: formatDatabaseProperties(params.properties)
      }
    );
    
    if (result.error) {
      throw new Error(JSON.stringify(result.content));
    }
    
    const content = result.content as { id: string; url: string };
    return {
      id: content.id,
      url: content.url
    };
  }
});
