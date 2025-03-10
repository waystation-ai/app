import { z } from 'zod';
import { defineTool } from '../core/types';
import { queryNotionApi } from './utils';

// Define the response type to match the schema
type DatabasesResponse = Array<{
  id: string;
  title: string;
  url: string;
}>;

export const listNotionDatabases = defineTool({
  id: 'listNotionDatabases',
  summary: 'List available Notion databases',
  description: 'Retrieves a list of databases the user has access to in Notion.',
  method: 'GET',
  path: '/tools/notion/list_databases',
  parameters: z.object({}), // No parameters needed
  responses: {
    '200': {
      description: 'A JSON array of Notion databases',
      schema: z.array(z.object({
        id: z.string().describe('Unique identifier for the database'),
        title: z.string().describe('Title of the database'),
        url: z.string().describe('URL to the database')
      }))
    }
  },
  handler: async ({ context }) => {
    //const result = await queryNotionApi(context.userId, '/databases');
    const result = await queryNotionApi(context.userId, '/search', 'POST', {
      filter: {
        value: 'database',
        property: 'object'
      }
    });
    
    if (result.error) {
      throw new Error(JSON.stringify(result.content));
    }
    
    // Extract the databases from the response and map to the expected format
    const content = result.content as { 
      results: Array<{ 
        id: string; 
        url: string; 
        title: Array<{ plain_text: string }> 
      }> 
    };
    
    return content.results.map(db => ({
      id: db.id,
      title: db.title.map(t => t.plain_text).join(''),
      url: db.url
    })) as DatabasesResponse;
  }
});
