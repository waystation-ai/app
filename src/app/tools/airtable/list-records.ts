import { z } from 'zod';
import { defineTool } from '../core/types';
import { AirtableRecordSchema, callAirtableApi, handleAirtableError } from './utils';

interface AirtableGetRecordsResponse {
  records: Array<{
    id: string;
    createdTime: string;
    fields: Record<string, unknown>;
  }>;
  offset?: string;
}

export const listRecords = defineTool({
  id: 'listAirtableRecords',
  summary: 'Get records from an Airtable table',
  description: 'Retrieves records from the specified table with optional filtering and pagination',
  method: 'POST',
  path: '/tools/airtable/list_records',
  parameters: z.object({
    baseId: z.string().describe('ID of the Airtable base'),
    tableId: z.string().describe('ID of the table to get records from'),
    maxRecords: z.number().optional().describe('Maximum number of records to return (1-100)'),
    fields: z.array(z.string()).optional().describe('Fields to include in the response'),
    pageSize: z.number().optional().describe('Number of records returned in each request (1-100)'),
    offset: z.string().optional().describe('Offset value returned from a previous request'),
    filterByFormula: z.string().optional().describe('Filter formula to apply'),
    sort: z.array(z.object({
      field: z.string(),
      direction: z.enum(['asc', 'desc']).optional()
    })).optional().describe('Sort configuration')
  }),
  responses: {
    '200': {
      description: 'Successfully retrieved records',
      schema: z.object({
        records: z.array(AirtableRecordSchema),
        offset: z.string().optional()
      })
    }
  },
  handler: async ({ context, params }) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.maxRecords) {
        queryParams.append('maxRecords', params.maxRecords.toString());
      }
      if (params.pageSize) {
        queryParams.append('pageSize', params.pageSize.toString());
      }
      if (params.offset) {
        queryParams.append('offset', params.offset);
      }
      if (params.filterByFormula) {
        queryParams.append('filterByFormula', params.filterByFormula);
      }
      if (params.sort) {
        queryParams.append('sort', JSON.stringify(params.sort));
      }
      if (params.fields) {
        params.fields.forEach(field => {
          queryParams.append('fields[]', field);
        });
      }

      const queryString = queryParams.toString();
      const path = `/${params.baseId}/${params.tableId}${queryString ? `?${queryString}` : ''}`;
      console.log(path);

      const response = await callAirtableApi(context, path, { userId: context.userId }) as AirtableGetRecordsResponse;

      console.log(response);

      return {
        records: response.records.map(record => ({
          id: record.id,
          createdTime: record.createdTime,
          fields: record.fields
        })),
        offset: response.offset
      };
    } catch (error) {
      handleAirtableError(error);
    }
  }
});
