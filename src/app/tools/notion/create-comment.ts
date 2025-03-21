import { z } from 'zod';
import { defineTool } from '../core/types';
import { queryNotionApi, formatRichText } from './utils';

export const createNotionComment = defineTool({
  id: 'createNotionComment',
  summary: 'Create a comment on a Notion page',
  description: 'Adds a plain text comment to a Notion page.',
  method: 'POST',
  path: '/tools/notion/create_comment',
  parameters: z.object({
    pageId: z.string().describe('ID of the page to comment on'),
    text: z.string().describe('Text content of the comment')
  }),
  responses: {
    '200': {
      description: 'The created comment',
      schema: z.object({
        id: z.string(),
        object: z.string(),
        request_id: z.string().optional()
      })
    }
  },
  handler: async ({ context, params }) => {
    // Create the comment using Notion API
    const createCommentResult = await queryNotionApi(
      context,
      '/comments',
      'POST',
      {
        parent: {
          page_id: params.pageId
        },
        rich_text: formatRichText(params.text)
      }
    );
    
    if (createCommentResult.error) {
      throw new Error(JSON.stringify(createCommentResult.content));
    }
    
    const content = createCommentResult.content as {
      id: string;
      object: string;
      request_id?: string;
    };
    
    // Return the comment details
    return {
      id: content.id,
      object: content.object,
      request_id: content.request_id
    };
  }
});
