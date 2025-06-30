// Unified connection types to handle both OAuth and database connections

export enum ConnectionType {
  OAUTH = 'oauth',
  DATABASE = 'database'
}

export interface BaseConnection {
  id: number;
  userId: string;
  provider: string;
  createdAt: Date;
  updatedAt: Date;
  type: 'oauth' | 'database';
}

export interface OAuthConnection extends BaseConnection {
  type: 'oauth';
  accessToken: string;
  refreshToken: string | null;
  expiresAt: Date | null;
  scopes: string[] | null;
  metadata: Record<string, unknown> | null;
}

export interface DatabaseConnection extends BaseConnection {
  type: 'database';
  connectionString: string;
  name: string;
}

export type Connection = OAuthConnection | DatabaseConnection;
