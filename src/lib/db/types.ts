import { AuthType } from "@/marketplace/core/types";

export interface BaseConnection {
  id: number;
  userId: string;
  provider: string;
  createdAt: Date;
  updatedAt: Date;
  type: AuthType;
}

export interface OAuthConnection extends BaseConnection {
  type: AuthType.OAuth;
  accessToken: string;
  refreshToken: string | null;
  expiresAt: Date | null;
  scopes: string[] | null;
  metadata: Record<string, unknown> | null;
}

export interface DatabaseConnection extends BaseConnection {
  type: AuthType.ConnectionString;
  connectionString: string;
  name: string;
}

export type Connection = OAuthConnection | DatabaseConnection;
