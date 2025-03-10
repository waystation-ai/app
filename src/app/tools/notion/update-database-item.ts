import { z } from 'zod';
import { defineTool } from '../core/types';
import { queryNotionApi, formatDatabaseProperties } from './utils';

export const updateNotionDatabaseItem = defineTool({
  id: 'updateNotionDatabaseItem',
  summary: 'Update an item in a Notion database',
  description: 'Updates an existing item with specified properties in a Notion database.',
  method: 'POST',
  path: '/tools/notion/update_database_item',
  parameters: z.object({
    pageId: z.string().describe('ID of the page/item to update'),
    properties: z.object({}).catchall(z.unknown()).describe('Updated properties for the database item')
  }),
  responses: {
    '200': {
      description: 'The updated database item',
      schema: z.object({
        id: z.string(),
        url: z.string()
      })
    }
  },
  handler: async ({ context, params }) => {
    const result = await queryNotionApi(
      context.userId,
      `/pages/${params.pageId}`,
      'PATCH',
      {
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
