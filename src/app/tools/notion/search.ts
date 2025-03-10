import { z } from 'zod';
import { defineTool } from '../core/types';
import { queryNotionApi } from './utils';

export const searchNotion = defineTool({
  id: 'searchNotion',
  summary: 'Search Notion workspace',
  description: 'Searches across a Notion workspace for pages, databases, and content matching the query.',
  method: 'GET',
  path: '/tools/notion/search',
  parameters: z.object({
    query: z.string().describe('Search query text'),
    filter: z.enum(['all', 'page', 'database']).optional().describe('Filter results by type'),
    sort: z.object({
      direction: z.enum(['ascending', 'descending']).optional(),
      timestamp: z.enum(['last_edited_time', 'created_time']).optional()
    }).optional().describe('Sort options for results')
  }),
  responses: {
    '200': {
      description: 'Search results',
      schema: z.object({
        results: z.array(z.unknown()),
        hasMore: z.boolean()
      })
    }
  },
  handler: async ({ context, params }) => {
    // Prepare search request
    const searchRequest: Record<string, unknown> = {
      query: params.query
    };
    
    // Add filter if provided
    if (params.filter && params.filter !== 'all') {
      searchRequest.filter = {
        value: params.filter,
        property: 'object'
      };
    }
    
    // Add sort if provided
    if (params.sort) {
      searchRequest.sort = params.sort;
    }
    
    // Execute search
    const result = await queryNotionApi(
      context.userId,
      '/search',
      'POST',
      searchRequest
    );
    
    if (result.error) {
      throw new Error(JSON.stringify(result.content));
    }
    
    const content = result.content as { 
      results: Array<unknown>; 
      has_more: boolean;
    };
    
    return {
      results: content.results,
      hasMore: content.has_more
    };
  }
});
