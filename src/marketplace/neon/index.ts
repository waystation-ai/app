import { registerProvider } from '../core/registry';
import { executeSqlQuery, fetchSchema } from '../sql/tools';

export const neonProvider = registerProvider({
  id: 'neon',
  name: 'Neon',
  description: 'Connect to your Neon database to query data and schemas.',
  type: 'native',
  auth: {
    type: 'connection_string',
  },
  tools: [
    executeSqlQuery,
    fetchSchema,
  ],
});
