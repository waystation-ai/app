import { z } from 'zod';
import { defineTool } from '../core/types';
import { AirtableRecordSchema, callAirtableApi, handleAirtableError } from './utils';

interface AirtableUpdateRecordResponse {
  id: string;
  createdTime: string;
  fields: Record<string, unknown>;
}

export const updateRecord = defineTool({
  id: 'updateAirtableRecord',
  summary: 'Update an existing record in an Airtable table',
  description: 'Updates the specified fields of an existing record in the given table',
  method: 'PUT',
  path: '/tools/airtable/update_record',
  parameters: z.object({
    baseId: z.string().describe('ID of the Airtable base'),
    tableId: z.string().describe('ID of the table containing the record'),
    recordId: z.string().describe('ID of the record to update'),
    fields: z.object({})
    .catchall(z.unknown())
    .describe('Object containing column values to update for the item. Example: { "status": "Planning", "person": "1324234" }')
  }),
  responses: {
    '200': {
      description: 'Successfully updated record',
      schema: AirtableRecordSchema
    }
  },
  handler: async ({ context, params }) => {
    try {
      const response = await callAirtableApi(context, `/${params.baseId}/${params.tableId}/${params.recordId}`,
        {
          method: 'PUT',
          body: {
            fields: params.fields
          }
        }
      ) as AirtableUpdateRecordResponse;

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
