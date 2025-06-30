import { defineTool } from '../core/types';
import { createDbClient } from '@/lib/db-clients/factory';
import { z } from 'zod';

export const executeSqlQuery = defineTool({
  id: 'execute_sql_query',
  summary: 'Execute a SQL query against the connected database.',
  description: 'Executes a read-only SQL query and returns the results.',
  method: 'POST',
  path: '/sql/query',
  parameters: z.object({
    query: z.string().describe('The SQL query to execute.'),
  }),
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
      const results = await client.executeQuery(params.query);
      return results;
    } finally {
      await client.close();
    }
  },
});

export const fetchSchema = defineTool({
  id: 'fetch_schema',
  summary: 'Fetch the database schema.',
  description: 'Fetches the schema of the connected database, showing tables and columns.',
  method: 'GET',
  path: '/sql/schema',
  parameters: z.object({}),
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
