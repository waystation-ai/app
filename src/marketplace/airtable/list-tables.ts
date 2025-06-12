import { z } from 'zod';
import { defineTool } from '../core/types';
import { AirtableTableSchema, callAirtableApi, handleAirtableError } from './utils';

interface AirtableTableResponse {
  id: string;
  name: string;
  description?: string;
  primaryFieldId: string;
  fields: Array<unknown>
}

export const listTables = defineTool({
  id: 'listAirtableTables',
  summary: 'List all tables in an Airtable base',
  description: 'Returns a list of all tables in the specified Airtable base',
  method: 'GET',
  path: '/tools/airtable/list_tables',
  parameters: z.object({
    baseId: z.string().describe('ID of the Airtable base to list tables from')
  }),
  responses: {
    '200': {
      description: 'Successfully retrieved tables',
      schema: z.object({
        tables: z.array(AirtableTableSchema)
      })
    }
  },
  handler: async ({ context, params }) => {
    try {
      const response = await callAirtableApi(context, `/meta/bases/${params.baseId}/tables`, {});

      return {
        tables: response.tables.map((table: AirtableTableResponse) => ({
          id: table.id,
          name: table.name,
          description: table.description,
          primaryFieldId: table.primaryFieldId,
          fields: table.fields
        }))
      };
    } catch (error) {
      handleAirtableError(error);
    }
  }
});
