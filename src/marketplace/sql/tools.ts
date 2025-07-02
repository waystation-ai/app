import { defineTool } from '../core/types';
import { createDbClient } from '@/lib/db-clients/factory';
import { z } from 'zod';

interface ProviderInfo {
  id: string;
  name: string;
}

const querySchema = z.object({
  query: z.string().describe('The SQL query to execute.'),
});

export const createExecuteSqlQueryTool = ({
  id,
  name,
}: ProviderInfo) =>
  defineTool({
    id: `${id}_execute_sql_query`,
    summary: `Execute a SQL query against your ${name} database.`,
    description: `Executes a read-only SQL query against your ${name} database and returns the results.`,
    method: 'POST',
    path: `/sql/${id}/query`,
    parameters: querySchema,
    responses: {
      '200': {
        description: 'The result of the SQL query.',
        schema: z.any(),
      },
    },
    handler: async ({ context, params }) => {
      const connectionString = await context.getConnectionString();
      const client = createDbClient(connectionString);
      try {
        return await client.executeQuery(params.query);
      } finally {
        await client.close();
      }
    },
  });

const schemaParams = z.object({});

export const createFetchSchemaTool = ({
  id,
  name,
}: ProviderInfo) =>
  defineTool({
    id: `${id}_fetch_schema`,
    summary: `Fetch the database schema for your ${name} database.`,
    description: `Fetches the schema of the connected ${name} database, showing tables and columns.`,
    method: 'GET',
    path: `/sql/${id}/schema`,
    parameters: schemaParams,
    responses: {
      '200': {
        description: 'The database schema.',
        schema: z.any(),
      },
    },
    handler: async ({ context }) => {
      const connectionString = await context.getConnectionString();
      const client = createDbClient(connectionString);
      try {
        const schema = await client.fetchSchema();
        return schema;
      } finally {
        await client.close();
      }
    },
  });
