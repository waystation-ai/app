import { registerProvider } from '../core/registry';
import { executeSqlQuery, fetchSchema } from '../sql/tools';

export const supabaseProvider = registerProvider({
  id: 'supabase',
  name: 'Supabase',
  description: 'Connect to your Supabase database to query data and schemas.',
  type: 'native',
  auth: {
    type: 'connection_string',
  },
  tools: [
    executeSqlQuery,
    fetchSchema,
  ],
});
