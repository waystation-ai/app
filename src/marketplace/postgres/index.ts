import { registerProvider } from '../core/registry';
import { AuthType, ProviderType } from '../core/types';
import { executeSqlQuery, fetchSchema } from '../sql/tools';

export const postgresProvider = registerProvider({
  id: 'postgres',
  name: 'PostgreSQL',
  description: 'Connect to your PostgreSQL database to query data and schemas.',
  type: ProviderType.Native,
  auth: {
    type: AuthType.ConnectionString,
  },
  tools: [
    executeSqlQuery,
    fetchSchema,
  ],
});
