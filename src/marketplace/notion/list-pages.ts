import { z } from 'zod';
import { defineTool } from '../core/types';
import { queryNotionApi } from './utils';

// Define the response type to match the schema
type PagesResponse = Array<{
  id: string;
  title: string;
  url: string;
  createdTime: string;
  lastEditedTime: string;
}>;

export const listNotionPages = defineTool({
  id: 'listNotionPages',
  summary: 'List available Notion pages',
  description: 'Retrieves a list of pages the user has access to in Notion.',
  method: 'GET',
  path: '/tools/notion/list_pages',
  parameters: z.object({}), // No parameters needed
  responses: {
    '200': {
      description: 'A JSON array of Notion pages',
      schema: z.array(z.object({
        id: z.string().describe('Unique identifier for the page'),
        title: z.string().describe('Title of the page'),
        url: z.string().describe('URL to the page'),
        createdTime: z.string().describe('When the page was created'),
        lastEditedTime: z.string().describe('When the page was last edited')
      }))
    }
  },
  handler: async ({ context }) => {
    const result = await queryNotionApi(context, '/search', 'POST', {
      filter: {
        value: 'page',
        property: 'object'
      }
    });
    
    if (result.error) {
      throw new Error(JSON.stringify(result.content));
    }
    
    // Define types for Notion API response
    interface NotionRichText {
      type: string;
      text?: { content: string };
      plain_text?: string;
    }

    interface NotionProperty {
      id?: string;
      type?: string;
      title?: NotionRichText[];
      rich_text?: NotionRichText[];
    }

    interface NotionPage {
      id: string;
      url: string;
      created_time: string;
      last_edited_time: string;
      properties?: Record<string, NotionProperty>;
      icon?: { 
        type: string; 
        emoji?: string; 
        external?: { url: string } 
      };
      object?: string;
      parent?: {
        type: string;
        database_id?: string;
        workspace?: boolean;
      };
    }

    // Extract the pages from the response and map to the expected format
    const content = result.content as { 
      results: NotionPage[] 
    };
    
    return content.results.map(page => {
      // Try to extract title from various possible locations
      let title = 'Untitled';
      
      if (page.properties) {
        // Case 1: Database item with title property that has a title array
        if (page.properties.title && 
            page.properties.title.title && 
            Array.isArray(page.properties.title.title) && 
            page.properties.title.title.length > 0) {
          
          const titleItems = page.properties.title.title;
          title = titleItems.map((t: NotionRichText) => t.plain_text || '').join('');
        }
        // Case 2: Database item with common title-like fields
        else {
          // Look for common title field names
          const titleFields = ['Name', 'Goals', 'Doc name', 'Task Name', 'title'];
          for (const field of titleFields) {
            const prop = page.properties[field];
            if (prop) {
              // Check for title array
              if (prop.title && Array.isArray(prop.title) && prop.title.length > 0) {
                title = prop.title.map((t: NotionRichText) => t.plain_text || '').join('');
                if (title) break;
              }
              // Check for rich_text array
              else if (prop.rich_text && Array.isArray(prop.rich_text) && prop.rich_text.length > 0) {
                title = prop.rich_text.map((t: NotionRichText) => t.plain_text || '').join('');
                if (title) break;
              }
            }
          }
        }
      }
      
      // Add page type indicator to untitled pages
      if (title === 'Untitled') {
        if (page.parent?.type === 'database_id') {
          title = 'Untitled database item';
        } else if (page.parent?.workspace) {
          title = 'Untitled workspace page';
        }
      }
      
      // Add icon emoji to title if available
      if (page.icon && page.icon.type === 'emoji' && page.icon.emoji) {
        title = `${page.icon.emoji} ${title}`;
      }
      
      return {
        id: page.id,
        title,
        url: page.url,
        createdTime: page.created_time,
        lastEditedTime: page.last_edited_time
      };
    }) as PagesResponse;
  }
});
