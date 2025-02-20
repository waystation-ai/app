import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const oauthConnections = pgTable('oauth_connections', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  provider: varchar('provider', { length: 50 }).notNull(),
  accessToken: text('access_token').notNull(),
  refreshToken: text('refresh_token'),
  expiresAt: timestamp('expires_at'),
  scopes: text('scopes').array(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Create indexes for common queries
export const indexes = {
  userProviderIdx: 'CREATE INDEX IF NOT EXISTS user_provider_idx ON oauth_connections (user_id, provider)',
  expiresAtIdx: 'CREATE INDEX IF NOT EXISTS expires_at_idx ON oauth_connections (expires_at)'
};
