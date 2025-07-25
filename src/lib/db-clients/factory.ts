import { DatabaseClient } from './types';
import { PostgreSqlDbClient } from './postgres';

export function createDbClient(connectionString: string): DatabaseClient {
  if (connectionString.startsWith('postgres://') || connectionString.startsWith('postgresql://')) {
    return new PostgreSqlDbClient(connectionString);
  }
  // Future clients will be added here
  throw new Error('Unsupported database type');
}
