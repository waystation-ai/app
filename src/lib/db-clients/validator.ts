import { createDbClient } from './factory';

export interface ConnectionValidationResult {
  isValid: boolean;
  error?: string;
  schema?: unknown;
}

export async function validateDatabaseConnection(
  connectionString: string
): Promise<ConnectionValidationResult> {
  let client;
  
  try {
    // Create database client
    client = createDbClient(connectionString);
    
    // Attempt to fetch schema to validate connection
    const schema = await client.fetchSchema();
    
    // Check if schema fetch returned an error string
    if (typeof schema === 'string') {
      return {
        isValid: false,
        error: schema,
      };
    }
    
    // Connection is valid and schema was fetched successfully
    return {
      isValid: true,
      schema,
    };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Failed to validate database connection',
    };
  } finally {
    // Always close the connection
    if (client) {
      try {
        await client.close();
      } catch (closeError) {
        console.warn('Failed to close database connection:', closeError);
      }
    }
  }
}