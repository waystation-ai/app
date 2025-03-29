import { z } from 'zod';
import { defineTool } from '../core/types';
import { queryGdriveApi } from './utils';

const responseSchema = z.object({
  files: z.array(z.object({
    id: z.string().describe('Unique identifier for the document'),
    name: z.string().describe('Name of the document'),
    modifiedTime: z.string().describe('Last modification timestamp'),
    webViewLink: z.string().describe('URL to view the document in browser')
  }))
});

export type ListDocsResponse = z.infer<typeof responseSchema>;

export const listDocs = defineTool({
  id: 'listGoogleDocs',
  summary: 'List Google Docs',
  description: 'Retrieves a list of Google Docs from the user\'s Drive, ordered by last modified date.',
  method: 'GET',
  path: '/tools/gdrive/list_docs',
  parameters: z.object({}), // No parameters needed
  responses: {
    '200': {
      description: 'Successfully retrieved list of documents',
      schema: responseSchema
    }
  },
  handler: async ({ context }) => {
    const params = {
      q: "mimeType='application/vnd.google-apps.document'",
      fields: 'files(id,name,modifiedTime,webViewLink)',
      orderBy: 'modifiedTime desc'
    };

    const response = await queryGdriveApi(context, 'files', params);
    
    return response as ListDocsResponse;
  }
});
