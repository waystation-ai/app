import { registerProvider } from '../core/registry';
import { AuthType, ProviderType } from '../core/types';
import { executeSqlQuery, fetchSchema } from '../sql/tools';

export const supabaseProvider = registerProvider({
  id: 'supabase',
  name: 'Supabase',
  description: 'Connect to your Supabase database to query data and schemas.',
  type: ProviderType.Native,
  auth: {
    type: AuthType.ConnectionString,
  },
  tools: [
    executeSqlQuery,
    fetchSchema,
  ],
});
