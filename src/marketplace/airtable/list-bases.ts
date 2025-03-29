import { z } from 'zod';
import { defineTool } from '../core/types';
import { AirtableBaseSchema, callAirtableApi, handleAirtableError } from './utils';

interface AirtableBaseResponse {
  id: string;
  name: string;
  permissionLevel: string;
}

export const listBases = defineTool({
  id: 'listAirtableBases',
  summary: 'List all accessible Airtable bases',
  description: 'Returns a list of all Airtable bases the authenticated user has access to',
  method: 'GET',
  path: '/tools/airtable/list_bases',
  parameters: z.object({}), // No parameters needed
  responses: {
    '200': {
      description: 'Successfully retrieved bases',
      schema: z.object({
        bases: z.array(AirtableBaseSchema)
      })
    }
  },
  handler: async ({ context }) => {
    try {
      const response = await callAirtableApi(context, '/meta/bases', {});

      return {
        bases: response.bases.map((base: AirtableBaseResponse) => ({
          id: base.id,
          name: base.name,
          permissionLevel: base.permissionLevel
        }))
      };
    } catch (error) {
      handleAirtableError(error);
    }
  }
});
