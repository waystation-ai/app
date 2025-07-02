
export interface BaseConnection {
  id: number;
  userId: string;
  provider: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OAuthConnection extends BaseConnection {
  accessToken: string;
  refreshToken: string | null;
  expiresAt: Date | null;
  scopes: string[] | null;
  metadata: Record<string, unknown> | null;
}

export interface DatabaseConnection extends BaseConnection {
  metadata: { connectionString: string } & Record<string, unknown>;
  name: string;
}

export type Connection = OAuthConnection | DatabaseConnection;

// Type guard functions for runtime type checking
export function isOAuthConnection(conn: Connection): conn is OAuthConnection {
  return 'accessToken' in conn;
}

export function isDatabaseConnection(conn: Connection): conn is DatabaseConnection {
  return 'name' in conn && 'metadata' in conn && 
         hasValidConnectionStringMetadata(conn.metadata);
}

// Utility function to validate metadata contains a valid connectionString
export function hasValidConnectionStringMetadata(metadata: unknown): metadata is { connectionString: string } & Record<string, unknown> {
  if (metadata === null || typeof metadata !== 'object' || !('connectionString' in metadata)) {
    return false;
  }
  
  const metadataObj = metadata as Record<string, unknown>;
  return typeof metadataObj.connectionString === 'string' && 
         metadataObj.connectionString.length > 0;
}
