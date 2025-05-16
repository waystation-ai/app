import { pgTable, serial, text, timestamp, varchar, jsonb, unique } from 'drizzle-orm/pg-core';
import { OAuthClientMetadata } from '@modelcontextprotocol/sdk/shared/auth.js';

// Table for storing OAuth clients registered via dynamic client registration
export const oauthClients = pgTable('oauth_clients', {
  id: serial('id').primaryKey(),
  clientId: text('client_id').notNull().unique(),
  clientSecret: text('client_secret').notNull(),
  clientMetadata: jsonb('client_metadata').$type<OAuthClientMetadata>(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Table for storing the mapping between client redirect URIs and our internal state
export const oauthRedirectMappings = pgTable('oauth_redirect_mappings', {
  id: serial('id').primaryKey(),
  state: text('state').notNull().unique(),
  clientId: text('client_id').notNull(),
  originalRedirectUri: text('original_redirect_uri').notNull(),
  originalState: text('original_state'),
  codeVerifier: text('code_verifier'),
  expiresAt: timestamp('expires_at').notNull()
});

// New unified table for remote provider metadata
export const remoteProviders = pgTable('remote_providers', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  provider: varchar('provider', { length: 50 }).notNull(),
  serverUrl: text('server_url'),
  oauthMetadata: jsonb('oauth_metadata'),
  clientRegistration: jsonb('client_registration'),
  providerMetadata: jsonb('provider_metadata'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
}, (table) => {
  return {
    // Create a unique constraint to prevent duplicate entries
    userProviderIdx: unique().on(table.userId, table.provider)
  };
});

export const waitlistEntries = pgTable('waitlist_entries', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  provider: varchar('provider', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').defaultNow()
}, (table) => {
  return {
    // Create a unique constraint to prevent duplicate entries
    userProviderIdx: unique().on(table.userId, table.provider)
  };
});

export const oauthStates = pgTable('oauth_states', {
  id: serial('id').primaryKey(),
  state: text('state').notNull().unique(),
  provider: varchar('provider', { length: 50 }).notNull(),
  codeVerifier: text('code_verifier'),
  userId: text('user_id').notNull(),
  redirectUri: text('redirect_uri'),
  createdAt: timestamp('created_at').defaultNow(),
  expiresAt: timestamp('expires_at').notNull()
});

export const oauthConnections = pgTable('oauth_connections', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  provider: varchar('provider', { length: 50 }).notNull(),
  accessToken: text('access_token').notNull(),
  refreshToken: text('refresh_token'),
  expiresAt: timestamp('expires_at'),
  scopes: text('scopes').array(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Create indexes for common queries
export const indexes = {
  userProviderIdx: 'CREATE INDEX IF NOT EXISTS user_provider_idx ON oauth_connections (user_id, provider)',
  expiresAtIdx: 'CREATE INDEX IF NOT EXISTS expires_at_idx ON oauth_connections (expires_at)'
};


// New table for nano IDs
export const nanoIds = pgTable('nano_ids', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().unique(),
  nanoId: varchar('nano_id', { length: 21 }).notNull().unique(), // Nano ID length is typically 21
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});
