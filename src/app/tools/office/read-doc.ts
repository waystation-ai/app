import { z } from 'zod';
import { defineTool } from '../core/types';
import { queryOffice365Api } from './utils';
import pdfParse from 'pdf-parse';

const parametersSchema = z.object({
  docId: z.string().describe('ID of the Office document to read')
});

export type ReadDocParams = z.infer<typeof parametersSchema>;

// Define a schema for text data
const textSchema = z.string().describe('Text content extracted from the Office document');

export const readDoc = defineTool({
  id: 'readOfficeDoc',
  summary: 'Read Office document content',
  description: 'Retrieves the content of a specific Office document as text, converted from PDF.',
  method: 'GET',
  path: '/tools/office/read_doc',
  parameters: parametersSchema,
  responses: {
    '200': {
      description: 'Successfully retrieved document content as text',
      schema: textSchema,
      contentTypes: ['text/plain']
    }
  },
  handler: async ({ context, params }) => {
    const pdfBuffer = await queryOffice365Api<ArrayBuffer>(
      context.userId,
      `me/drive/items/${params.docId}/content`,
      undefined,
      'pdf'
    );
    
    // Convert PDF to text
    const data = await pdfParse(Buffer.from(pdfBuffer));
    return data.text;
  }
});
