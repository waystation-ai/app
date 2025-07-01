import { registerProvider } from '../core/registry';
import { AuthType, ProviderType } from '../core/types';
import { executeSqlQuery, fetchSchema } from '../sql/tools';

export const neonProvider = registerProvider({
  id: 'neon',
  name: 'Neon',
  description: 'Connect to your Neon database to query data and schemas.',
  type: ProviderType.Native,
  auth: {
    type: AuthType.ConnectionString,
  },
  tools: [
    executeSqlQuery,
    fetchSchema,
  ],
});
