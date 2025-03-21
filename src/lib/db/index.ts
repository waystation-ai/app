import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import { and, eq } from 'drizzle-orm';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });

// Helper function to check if a user is on the waitlist for a specific provider
export async function checkWaitlistStatus(userId: string, provider: string): Promise<boolean> {
  const existingEntry = await db.select()
    .from(schema.waitlistEntries)
    .where(
      and(
        eq(schema.waitlistEntries.userId, userId),
        eq(schema.waitlistEntries.provider, provider)
      )
    )
    .limit(1);
  
  return existingEntry.length > 0;
}

// Helper function to add a user to the waitlist for a specific provider
export async function addToWaitlist(userId: string, provider: string): Promise<void> {
  // Check if already on waitlist
  const isOnWaitlist = await checkWaitlistStatus(userId, provider);
  
  if (!isOnWaitlist) {
    await db.insert(schema.waitlistEntries).values({
      userId,
      provider
    });
  }
}

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

  return connections[0];
}

// Helper function to get all valid connections for a specific user
export async function getValidConnections(userId: string) {
  const connections = await db.select().from(schema.oauthConnections)
    .where(eq(schema.oauthConnections.userId, userId));

  // Create a map of provider -> connection for easy lookup
  const connectionMap = new Map();
  for (const connection of connections) {
    connectionMap.set(connection.provider, connection);
  }

  return connectionMap;
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
    metadata?: Record<string, unknown>; 
  }
) {
  const existing = await db.select().from(schema.oauthConnections)
    .where(and(
      eq(schema.oauthConnections.userId, userId),
      eq(schema.oauthConnections.provider, provider)
    ));

  if (existing.length) {
    console.log(`Updating tokens for user "${userId}" for provider "${provider}" saved`);
    
    // If updating and we have new metadata but want to preserve existing metadata
    let updatedMetadata = tokens.metadata;
    if (tokens.metadata && existing[0].metadata) {
      updatedMetadata = { ...existing[0].metadata, ...tokens.metadata };
    }

    // Update existing connection
    return db.update(schema.oauthConnections)
      .set({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt: tokens.expiresAt,
        scopes: tokens.scopes,
        metadata: updatedMetadata || existing[0].metadata,
        updatedAt: new Date()
      })
      .where(and(
        eq(schema.oauthConnections.userId, userId),
        eq(schema.oauthConnections.provider, provider)
      ));
  }

  console.log(`Saving tokens for user "${userId}" for provider "${provider}" saved`)

  // Create new connection
  return db.insert(schema.oauthConnections).values({
    userId,
    provider,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    expiresAt: tokens.expiresAt,
    scopes: tokens.scopes,
    metadata: tokens.metadata
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

// Helper function to update OAuth connection metadata
export async function updateConnectionMetadata(
  userId: string, 
  provider: string, 
  metadata: Record<string, unknown>
) {
  const existing = await db.select().from(schema.oauthConnections)
    .where(and(
      eq(schema.oauthConnections.userId, userId),
      eq(schema.oauthConnections.provider, provider)
    ));
  
  if (!existing.length) {
    throw new Error(`No connection found for user ${userId} and provider ${provider}`);
  }

  // Merge with existing metadata if it exists
  const updatedMetadata = existing[0].metadata 
    ? { ...existing[0].metadata, ...metadata }
    : metadata;

  return db.update(schema.oauthConnections)
    .set({
      metadata: updatedMetadata,
      updatedAt: new Date()
    })
    .where(and(
      eq(schema.oauthConnections.userId, userId),
      eq(schema.oauthConnections.provider, provider)
    ));
}
