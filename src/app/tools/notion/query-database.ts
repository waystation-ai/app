import { z } from 'zod';
import { defineTool } from '../core/types';
import { queryNotionApi } from './utils';

export const queryNotionDatabase = defineTool({
  id: 'queryNotionDatabase',
  summary: 'Query items in a Notion database',
  description: 'Retrieves and filters items from a specified Notion database.',
  method: 'GET',
  path: '/tools/notion/query_database',
  parameters: z.object({
    databaseId: z.string().describe('ID of the database to query'),
    filter: z.record(z.unknown()).optional().describe('Optional filter criteria'),
    sorts: z.array(z.record(z.unknown())).optional().describe('Optional sorting criteria'),
    pageSize: z.number().optional().describe('Number of results to return (max 100)')
  }),
  responses: {
    '200': {
      description: 'Database query results',
      schema: z.object({
        results: z.array(z.unknown()),
        hasMore: z.boolean()
      })
    }
  },
  handler: async ({ context, params }) => {
    const result = await queryNotionApi(
      context, 
      `/databases/${params.databaseId}/query`,
      'POST',
      {
        filter: params.filter || undefined,
        sorts: params.sorts || undefined,
        page_size: params.pageSize || 100
      }
    );
    
    if (result.error) {
      throw new Error(JSON.stringify(result.content));
    }
    
    const content = result.content as { 
      results: Array<unknown>; 
      has_more: boolean 
    };
    
    return {
      results: content.results,
      hasMore: content.has_more
    };
  }
});
