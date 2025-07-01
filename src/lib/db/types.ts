
export interface BaseConnection {
  id: number;
  userId: string;
  provider: string;
  createdAt: Date;
  updatedAt: Date;
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
  type: 'connection_string';
  metadata: Record<string, unknown> | null;
  name: string;
}

export type Connection = OAuthConnection | DatabaseConnection;
