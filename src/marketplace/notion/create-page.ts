import { z } from 'zod';
import { defineTool } from '../core/types';
import { queryNotionApi, formatRichText } from './utils';

/**
 * Converts plain text to Notion paragraph blocks
 * Each line in the text becomes a separate paragraph block
 */
function textToBlocks(text: string): Array<Record<string, unknown>> {
  if (!text || text.trim() === '') {
    return [];
  }
  
  // Split text by line breaks and create a paragraph block for each non-empty line
  return text.split('\n')
    .filter(line => line.trim() !== '')
    .map(line => ({
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: formatRichText(line)
      }
    }));
}

export const createNotionPage = defineTool({
  id: 'createNotionPage',
  summary: 'Create a new Notion page',
  description: 'Creates a new page in Notion with specified content.',
  method: 'POST',
  path: '/tools/notion/create_page',
  parameters: z.object({
    parentId: z.string().describe('ID of the parent page or database'),
    parentType: z.enum(['page', 'database']).describe('Type of parent (page or database)'),
    title: z.string().describe('Title of the new page'),
    content: z.string().optional().describe('Optional text content for the page')
  }),
  responses: {
    '200': {
      description: 'The created page',
      schema: z.object({
        id: z.string(),
        url: z.string()
      })
    }
  },
  handler: async ({ context, params }) => {
    // Create parent reference based on type
    const parent = params.parentType === 'page' 
      ? { page_id: params.parentId } 
      : { database_id: params.parentId };
    
    // Convert content text to blocks if provided
    const children = params.content ? textToBlocks(params.content) : [];
    if (children.length > 100)
      children.length = 100; // Notion API limit for children blocks
    
    // Create page with title and content
    const createPageResult = await queryNotionApi(
      context,
      '/pages',
      'POST',
      {
        parent,
        properties: {
          title: {
            title: formatRichText(params.title)
          }
        },
        children
      }
    );
    
    if (createPageResult.error) {
      throw new Error(JSON.stringify(createPageResult.content));
    }
    
    const content = createPageResult.content as { id: string; url: string };
    return {
      id: content.id,
      url: content.url
    };
  }
});
