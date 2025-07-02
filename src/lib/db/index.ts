import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import { and, eq, lt } from 'drizzle-orm';
import * as schema from './schema';
import { OAuthClientInformationFull, OAuthMetadata, OAuthTokens } from '@modelcontextprotocol/sdk/shared/auth.js';
import { ListToolsResult, ListResourcesResult } from '@modelcontextprotocol/sdk/types.js';
import { Connection, OAuthConnection, DatabaseConnection, hasValidConnectionStringMetadata } from './types';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });

interface StateData {
  state: string;
  provider: string;
  codeVerifier?: string;
  userId: string;
  redirectUri?: string;
}

export class StateStore {
  async saveState(stateData: StateData, expirationMinutes: number = 5): Promise<void> {
    try {
      const expiresAt = new Date(Date.now() + expirationMinutes * 60 * 1000);
      
      await db.insert(schema.oauthStates).values({
        state: stateData.state,
        provider: stateData.provider,
        codeVerifier: stateData.codeVerifier,
        userId: stateData.userId,
        redirectUri: stateData.redirectUri,
        expiresAt
      });
      
      console.log(`Successfully saved OAuth state: ${stateData.state} for provider: ${stateData.provider}`);
    } catch (error) {
      console.error(`Failed to save OAuth state ${stateData.state}:`, error);
      // We rethrow this error since failing to save the state would break the OAuth flow
      throw error;
    }
  }

  async getState(state: string): Promise<StateData | null> {
    try {
      const results = await db.select().from(schema.oauthStates).where(eq(schema.oauthStates.state, state));
      
      if (!results.length) {
        console.log(`No OAuth state found for: ${state}`);
        return null;
      }
      
      const stateRecord = results[0];
      console.log(`Retrieved OAuth state: ${state} for provider: ${stateRecord.provider}`);
      
      return {
        state: stateRecord.state,
        provider: stateRecord.provider,
        codeVerifier: stateRecord.codeVerifier || undefined,
        userId: stateRecord.userId,
        redirectUri: stateRecord.redirectUri || undefined
      };
    } catch (error) {
      console.error(`Failed to retrieve OAuth state ${state}:`, error);
      // We rethrow this error since failing to get the state would break the OAuth flow
      throw error;
    }
  }

  async deleteState(state: string): Promise<void> {
    try {
      await db.delete(schema.oauthStates).where(eq(schema.oauthStates.state, state));
      console.log(`Successfully deleted OAuth state: ${state}`);
    } catch (error) {
      console.error(`Failed to delete OAuth state ${state}:`, error);
      // We don't rethrow the error to prevent disrupting the OAuth flow
      // but we log it for monitoring and debugging
    }
  }

  async cleanupExpiredStates(): Promise<void> {
    try {
      const now = new Date();
      await db.delete(schema.oauthStates).where(lt(schema.oauthStates.expiresAt, now));
      console.log(`Cleaned up expired OAuth states`);
    } catch (error) {
      console.error(`Failed to clean up expired OAuth states:`, error);
      // We don't rethrow the error to prevent disrupting the OAuth flow
      // but we log it for monitoring and debugging
    }
  }
}


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
export async function getValidConnection(
  userId: string,
  provider: string,
): Promise<OAuthConnection | DatabaseConnection | null> {
  const [oauthConn] = await db
    .select()
    .from(schema.oauthConnections)
    .where(
      and(
        eq(schema.oauthConnections.userId, userId),
        eq(schema.oauthConnections.provider, provider),
      ),
    )
    .limit(1);

  if (oauthConn) {
    return oauthConn as OAuthConnection;
  }

  const [conn] = await db
    .select()
    .from(schema.connections)
    .where(
      and(
        eq(schema.connections.userId, userId),
        eq(schema.connections.provider, provider),
      ),
    )
    .limit(1);

  if (conn && hasValidConnectionStringMetadata(conn.metadata)) {
      return conn as DatabaseConnection;
  }

  return null;
}

// Helper function to get all valid connections for a specific user
export async function getValidConnections(userId: string): Promise<Map<string, Connection>> {
  // Get OAuth connections
  const oauthConnections = await db.select().from(schema.oauthConnections)
    .where(eq(schema.oauthConnections.userId, userId));

  // Get database connections
  const connectionsResult = await db.select().from(schema.connections)
    .where(eq(schema.connections.userId, userId));

  // Combine all connections
  const allConnections = [
    ...oauthConnections.map(conn => conn as OAuthConnection),
    ...connectionsResult
      .filter(conn => hasValidConnectionStringMetadata(conn.metadata))
      .map(conn => conn as DatabaseConnection)
  ];

  // Convert to Map for efficient provider-based lookup
  const connectionMap = new Map<string, Connection>();
  for (const conn of allConnections) {
    connectionMap.set(conn.provider, conn);
  }
  return connectionMap;
}


// Helper function to store or update OAuth tokens
export async function storeOAuthTokens(
  userId: string,
  provider: string,
  tokens: OAuthTokens
) {
  const existing = await db.select().from(schema.oauthConnections)
    .where(and(
      eq(schema.oauthConnections.userId, userId),
      eq(schema.oauthConnections.provider, provider)
    ));

  if (existing.length) {
    console.log(`Updating tokens for user "${userId}" for provider "${provider}" saved`);
    
    // Update existing connection
    return db.update(schema.oauthConnections)
      .set({
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000) : undefined,
        scopes: tokens.scope?.split(' '),
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
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000) : undefined,
        scopes: tokens.scope?.split(' '),
    metadata: null
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

// Helper function to store or update a connection string
export async function addConnection(userId: string, provider: string, name: string, metadata: object) {
  // Validate that metadata contains connectionString
  if (!hasValidConnectionStringMetadata(metadata)) {
    throw new Error(`Invalid metadata: connectionString is required for database connections`);
  }

  const existing = await db.select().from(schema.connections)
    .where(and(
      eq(schema.connections.userId, userId),
      eq(schema.connections.provider, provider)
    ));

  if (existing.length) {
    console.log(`Updating connection for user "${userId}" for provider "${provider}"`);
    
    // Update existing connection
    return db.update(schema.connections)
      .set({
        name,
        metadata,
        updatedAt: new Date()
      })
      .where(and(
        eq(schema.connections.userId, userId),
        eq(schema.connections.provider, provider)
      ));
  }

  console.log(`Saving connection for user "${userId}" for provider "${provider}"`);

  // Create new connection
  return db.insert(schema.connections).values({
    userId,
    provider,
    name,
    metadata,
  });
}

// Helper function to remove a database connection
export async function removeConnection(userId: string, provider: string) {
  return db.delete(schema.connections)
    .where(and(
      eq(schema.connections.userId, userId),
      eq(schema.connections.provider, provider)
    ));
}


// Helper function to update OAuth connection metadata
export async function updateConnectionMetadata(userId: string, provider: string, metadata: Record<string, unknown>) {
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

export interface OAuthClientInformationWithMetadata {
  oauthMetadata?: OAuthMetadata;
  clientMetadata: OAuthClientInformationFull;
};

// Helper function to get OAuth metadata for a provider and server URL
export async function getOAuthMetadata(userId: string, provider: string, serverUrl: string): Promise<OAuthMetadata | undefined> {
  const result = await db.select().from(schema.remoteProviders)
    .where(and(
      eq(schema.remoteProviders.userId, userId),
      eq(schema.remoteProviders.provider, provider),
      eq(schema.remoteProviders.serverUrl, serverUrl)
    ));

  if (!result.length || !result[0].oauthMetadata) {
    return undefined;
  }

  return result[0].oauthMetadata as OAuthMetadata;
}

// Helper function to store or update OAuth metadata
export async function storeOAuthMetadata(userId: string, provider: string, serverUrl: string, metadata: OAuthMetadata) {
  const existing = await db.select().from(schema.remoteProviders)
    .where(and(
      eq(schema.remoteProviders.userId, userId),
      eq(schema.remoteProviders.provider, provider),
      eq(schema.remoteProviders.serverUrl, serverUrl)
    ));

  if (existing.length) {
    // Update existing entry
    return db.update(schema.remoteProviders)
      .set({
        oauthMetadata: metadata,
        updatedAt: new Date()
      })
      .where(and(
        eq(schema.remoteProviders.userId, userId),
        eq(schema.remoteProviders.provider, provider),
        eq(schema.remoteProviders.serverUrl, serverUrl)
      ));
  }

  // Create new entry
  return db.insert(schema.remoteProviders).values({
    userId,
    provider,
    serverUrl,
    oauthMetadata: metadata
  });
}

// Helper function to get client registration info for a provider and server URL
export async function getClientRegistration(userId: string, provider: string, serverUrl: string): Promise<OAuthClientInformationFull | null> {
  const result = await db.select().from(schema.remoteProviders)
    .where(and(
      eq(schema.remoteProviders.userId, userId),
      eq(schema.remoteProviders.provider, provider),
      eq(schema.remoteProviders.serverUrl, serverUrl)
    ));

  if (!result.length || !result[0].clientRegistration) {
    return null;
  }

  return result[0].clientRegistration as OAuthClientInformationFull;
}

// Helper function to store or update client registration info
export async function storeClientRegistration(userId: string, provider: string, serverUrl: string, clientInfo: OAuthClientInformationFull) {
  const existing = await db.select().from(schema.remoteProviders)
    .where(and(
      eq(schema.remoteProviders.userId, userId),
      eq(schema.remoteProviders.provider, provider),
      eq(schema.remoteProviders.serverUrl, serverUrl)
    ));

  if (existing.length) {
    // Update existing entry
    return db.update(schema.remoteProviders)
      .set({
        clientRegistration: clientInfo,
        updatedAt: new Date()
      })
      .where(and(
        eq(schema.remoteProviders.userId, userId),
        eq(schema.remoteProviders.provider, provider),
        eq(schema.remoteProviders.serverUrl, serverUrl)
      ));
  }

  // Create new entry
  return db.insert(schema.remoteProviders).values({
    userId,
    provider,
    serverUrl,
    clientRegistration: clientInfo
  });
}

export type RemoteProviderMetadata = ListToolsResult & ListResourcesResult;

// Helper function to get provider metadata for a remote provider
export async function getRemoteProviderMetadata(userId: string, provider: string): Promise<RemoteProviderMetadata | undefined> {
  const result = await db.select().from(schema.remoteProviders)
    .where(and(
      eq(schema.remoteProviders.userId, userId),
      eq(schema.remoteProviders.provider, provider)
    ));

  if (!result.length || !result[0].providerMetadata) {
    return undefined;
  }

  return result[0].providerMetadata as RemoteProviderMetadata;
}

// Helper function to store provider metadata for a remote provider
export async function storeRemoteProviderMetadata(userId: string, provider: string, metadata: Partial<RemoteProviderMetadata>) {
  const existing = await db.select().from(schema.remoteProviders)
    .where(and(
      eq(schema.remoteProviders.userId, userId),
      eq(schema.remoteProviders.provider, provider)
    ));

  let mergedMetadata: RemoteProviderMetadata;
  
  if (existing.length) {
    // Merge with existing metadata
    const currentMetadata = (existing[0].providerMetadata as RemoteProviderMetadata) || { tools: [], resources: [] };
    
    mergedMetadata = {
      tools: metadata.tools !== undefined ? metadata.tools : currentMetadata.tools || [],
      resources: metadata.resources !== undefined ? metadata.resources : currentMetadata.resources || []
    };
    
    // Update existing entry
    return db.update(schema.remoteProviders)
      .set({
        providerMetadata: mergedMetadata,
        updatedAt: new Date()
      })
      .where(and(
        eq(schema.remoteProviders.userId, userId),
        eq(schema.remoteProviders.provider, provider)
      ));
  }

  // Create new entry with provided metadata
  mergedMetadata = {
    tools: metadata.tools || [],
    resources: metadata.resources || []
  };
  
  return db.insert(schema.remoteProviders).values({
    userId,
    provider,
    providerMetadata: mergedMetadata
  });
}
