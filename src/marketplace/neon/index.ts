import { registerProvider } from '../core/registry';
import {
  createExecuteSqlQueryTool,
  createFetchSchemaTool,
} from '../sql/tools';

const provider = {
  id: 'neon',
  name: 'Neon',
};

export const neonProvider = registerProvider({
  ...provider,
  description: `Connect to your ${provider.name} database to query data and schemas.`,
  auth: {
    type: 'connection_string',
  },
  tools: [
    createExecuteSqlQueryTool(provider),
    createFetchSchemaTool(provider),
  ],
});
