import { z } from 'zod';
import { defineTool } from '../core/types';
import { queryGdriveApi } from './utils';

const parametersSchema = z.object({
  docId: z.string().describe('ID of the Google Doc to read')
});

export type ReadDocParams = z.infer<typeof parametersSchema>;

const responseSchema = z.string().describe('Plain text content of the Google Doc');

export const readDoc = defineTool({
  id: 'readGoogleDoc',
  summary: 'Read Google Doc content',
  description: 'Retrieves the content of a specific Google Doc as plain text.',
  method: 'GET',
  path: '/tools/gdrive/read_doc',
  parameters: parametersSchema,
  responses: {
    '200': {
      description: 'Successfully retrieved document content',
      schema: responseSchema
    }
  },
  handler: async ({ context, params }) => {
    const response = await queryGdriveApi(
      context.userId,
      `files/${params.docId}/export`,
      undefined,
      'text/plain'
    );
    
    return response as string;
  }
});
