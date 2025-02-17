import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import { and, eq } from 'drizzle-orm';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });

// Helper function to get a valid connection for a specific user and provider
export async function getValidConnection(userId: string, provider: string) {
  const connections = await db.select().from(schema.oauthConnections)
    .where(and(
      eq(schema.oauthConnections.userId, userId),
      eq(schema.oauthConnections.provider, provider)
    ));

  if (!connections.length) {
    return null;
  }

  const connection = connections[0];
  
  // Check if token is expired
  if (connection.expiresAt && new Date(connection.expiresAt) < new Date()) {
    // Token is expired, needs refresh
    return null;
  }

  return connection;
}

// Helper function to store or update OAuth tokens
export async function storeOAuthTokens(
  userId: string,
  provider: string,
  tokens: {
    accessToken: string;
    refreshToken?: string;
    expiresAt?: Date;
    scopes?: string[];
  }
) {
  const existing = await db.select().from(schema.oauthConnections)
    .where(and(
      eq(schema.oauthConnections.userId, userId),
      eq(schema.oauthConnections.provider, provider)
    ));

  if (existing.length) {
    // Update existing connection
    return db.update(schema.oauthConnections)
      .set({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt: tokens.expiresAt,
        scopes: tokens.scopes,
        updatedAt: new Date()
      })
      .where(and(
        eq(schema.oauthConnections.userId, userId),
        eq(schema.oauthConnections.provider, provider)
      ));
  }

  // Create new connection
  return db.insert(schema.oauthConnections).values({
    userId,
    provider,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    expiresAt: tokens.expiresAt,
    scopes: tokens.scopes
  });
}

// Helper function to remove an OAuth connection
export async function removeOAuthConnection(userId: string, provider: string) {
  return db.delete(schema.oauthConnections)
    .where(and(
      eq(schema.oauthConnections.userId, userId),
      eq(schema.oauthConnections.provider, provider)
    ));
}
