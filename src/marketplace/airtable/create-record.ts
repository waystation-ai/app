import { z } from 'zod';
import { defineTool } from '../core/types';
import { AirtableRecordSchema, callAirtableApi, handleAirtableError } from './utils';

interface AirtableCreateRecordResponse {
  id: string;
  createdTime: string;
  fields: Record<string, unknown>;
}

export const createRecord = defineTool({
  id: 'createAirtableRecord',
  summary: 'Create a new record in an Airtable table',
  description: 'Creates a new record with the specified fields in the given table',
  method: 'POST',
  path: '/tools/airtable/create_record',
  parameters: z.object({
    baseId: z.string().describe('ID of the Airtable base'),
    tableId: z.string().describe('ID of the table to create the record in'),
    fields: z.object({})
    .catchall(z.unknown())
    .describe('Object containing column values to update for the item. Example: { "status": "Planning", "person": "1324234" }')
  }),
  responses: {
    '200': {
      description: 'Successfully created record',
      schema: AirtableRecordSchema
    }
  },
  handler: async ({ context, params }) => {
    try {
      const response = await callAirtableApi(context, `/${params.baseId}/${params.tableId}`,
        {
          method: 'POST',
          body: {
            fields: params.fields
          }
        }
      ) as AirtableCreateRecordResponse;

      return {
        id: response.id,
        createdTime: response.createdTime,
        fields: response.fields
      };
    } catch (error) {
      handleAirtableError(error);
    }
  }
});
