import { registerProvider } from '../core/registry';
import { executeSqlQuery, fetchSchema } from '../sql/tools';

export const postgresProvider = registerProvider({
  id: 'postgres',
  name: 'PostgreSQL',
  description: 'Connect to your PostgreSQL database to query data and schemas.',
  auth: {
    type: 'connection_string',
  },
  tools: [
    executeSqlQuery,
    fetchSchema,
  ],
});
