import { db } from '@/lib/db';
import { oauthClients, oauthRedirectMappings } from '@/lib/db/schema';
import { eq, lt } from 'drizzle-orm';
import { Buffer } from 'buffer';
import { nanoid } from 'nanoid';
import { 
  OAuthClientMetadata, 
  OAuthClientInformationFull, 
  OAuthTokens,
  OAuthMetadata
} from '@modelcontextprotocol/sdk/shared/auth.js';

// Helper function for base64URL encoding
function base64URLEncode(buffer: Uint8Array): string {
  return Buffer.from(buffer)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export class OAuthServer {
  // Generate a secure random string for client_id
  private generateClientId(): string {
    return `waystation-${nanoid(16)}`;
  }

  // Generate a secure random string for client_secret
  private generateClientSecret(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return base64URLEncode(array);
  }

  // Generate a secure random string for state
  private generateState(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  // Generate a secure random string for code verifier (PKCE)
  private generateCodeVerifier(): string {
    const array = new Uint8Array(64);
    crypto.getRandomValues(array);
    return base64URLEncode(array);
  }

  // Generate code challenge from code verifier (PKCE)
  private async generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return base64URLEncode(new Uint8Array(digest));
  }

  // Register a new OAuth client
  async registerClient(clientMetadata: OAuthClientMetadata): Promise<OAuthClientInformationFull> {
    // Validate client metadata
    if (!clientMetadata.redirect_uris || clientMetadata.redirect_uris.length === 0) {
      throw new Error('At least one redirect URI is required');
    }

    // Ensure token_endpoint_auth_method is valid
    const authMethod = clientMetadata.token_endpoint_auth_method || 'client_secret_post';
    if (!['client_secret_basic', 'client_secret_post', 'none'].includes(authMethod)) {
      throw new Error('Invalid token_endpoint_auth_method');
    }

    // For public clients (auth_method=none), ensure PKCE is required
    if (authMethod === 'none') {
      // Set token_endpoint_auth_method to 'none' explicitly
      clientMetadata.token_endpoint_auth_method = 'none';
    }

    // Generate client_id and client_secret
    const clientId = this.generateClientId();
    const clientSecret = authMethod === 'none' ? '' : this.generateClientSecret();
    const now = Math.floor(Date.now() / 1000);

    // Create client information
    const clientInfo: OAuthClientInformationFull = {
      client_id: clientId,
      client_secret: clientSecret,
      client_id_issued_at: now,
      client_secret_expires_at: 0, // Never expires
      ...clientMetadata
    };

    // Store client in database
    await db.insert(oauthClients).values({
      clientId,
      clientSecret,
      clientMetadata
    });

    return clientInfo;
  }

  // Get client by client_id
  async getClient(clientId: string): Promise<{ clientId: string; clientSecret: string; clientMetadata: OAuthClientMetadata } | null> {
    const clients = await db.select().from(oauthClients).where(eq(oauthClients.clientId, clientId));
    
    if (clients.length === 0 || !clients[0].clientMetadata) {
      return null;
    }

    return {
      clientId: clients[0].clientId,
      clientSecret: clients[0].clientSecret,
      clientMetadata: clients[0].clientMetadata as OAuthClientMetadata
    };
  }

  // Validate client credentials
  async validateClientCredentials(clientId: string, clientSecret: string): Promise<boolean> {
    const client = await this.getClient(clientId);
    
    if (!client) {
      return false;
    }

    return client.clientSecret === clientSecret;
  }

  // Store redirect mapping with client's code challenge
  async storeRedirectMapping(clientId: string, originalRedirectUri: string, codeChallenge: string|null, codeChallengeMethod: string|null,
    expirationMinutes: number = 10,  originalState?: string | null): Promise<{ state: string }> {
    const state = this.generateState();
    const expiresAt = new Date(Date.now() + expirationMinutes * 60 * 1000);
    
    await db.insert(oauthRedirectMappings).values({
      state,
      clientId,
      originalRedirectUri,
      originalState: originalState || null,
      codeVerifier: null, // We don't need to store a code verifier since we're using the client's challenge
      expiresAt
    });

    return { state };
  }

  // Get redirect mapping by state
  async getRedirectMapping(state: string): Promise<{ clientId: string; originalRedirectUri: string; originalState?: string; codeVerifier: string } | null> {
    console.log('Getting redirect mapping for state:', state);
    
    const mappings = await db.select().from(oauthRedirectMappings).where(eq(oauthRedirectMappings.state, state));
    
    if (mappings.length === 0) {
      console.log('No redirect mapping found for state:', state);
      return null;
    }

    return {
      clientId: mappings[0].clientId,
      originalRedirectUri: mappings[0].originalRedirectUri,
      originalState: mappings[0].originalState || undefined,
      codeVerifier: mappings[0].codeVerifier || ''
    };
  }

  // Delete redirect mapping
  async deleteRedirectMapping(state: string): Promise<void> {
    console.log('Deleting redirect mapping for state:', state);
    await db.delete(oauthRedirectMappings).where(eq(oauthRedirectMappings.state, state));
    console.log('Redirect mapping deleted for state:', state);
  }

  // Clean up expired redirect mappings
  async cleanupExpiredRedirectMappings(): Promise<void> {
    const now = new Date();
    await db.delete(oauthRedirectMappings).where(lt(oauthRedirectMappings.expiresAt, now));
  }

  // Get Clerk base URL
  private getClerkBaseUrl(): string {
    if (!process.env.APP_DOMAIN) {
      throw new Error('APP_DOMAIN environment variable is not set');
    }
    return `https://clerk.${process.env.APP_DOMAIN}`;
  }

  // Get Clerk authorization URL
  private getClerkAuthorizationUrl(): string {
    return `${this.getClerkBaseUrl()}/oauth/authorize`;
  }

  // Get Clerk token URL
  private getClerkTokenUrl(): string {
    return `${this.getClerkBaseUrl()}/oauth/token`;
  }

  // Get Clerk revocation URL
  private getClerkRevocationUrl(): string {
    return `${this.getClerkBaseUrl()}/oauth/revoke`;
  }

  // Get Clerk userinfo URL
  private getClerkUserinfoUrl(): string {
    return `${this.getClerkBaseUrl()}/oauth/userinfo`;
  }
  
  // Build authorization URL for Clerk using client's code challenge
  async buildClerkAuthorizationUrl(state: string, codeChallenge: string|null, codeChallengeMethod: string|null): Promise<string> {
    if (!process.env.CLERK_OAUTH_CLIENT_ID) {
      throw new Error('CLERK_OAUTH_CLIENT_ID environment variable is not set');
    }
    const params = new URLSearchParams({
      client_id: process.env.CLERK_OAUTH_CLIENT_ID,
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/callback`,
      response_type: 'code',
      state,
      scope: 'openid profile email'
    });

    if (codeChallenge)
      params.append('code_challenge', codeChallenge);

    if (codeChallengeMethod)
      params.append('code_challenge_method', codeChallengeMethod);

    return `${this.getClerkAuthorizationUrl()}?${params.toString()}`;
  }

  // Exchange code for tokens with Clerk
  async exchangeCodeForTokens(code: string, codeVerifier: string|null): Promise<OAuthTokens> {
    if (!process.env.CLERK_OAUTH_CLIENT_ID) {
      throw new Error('CLERK_OAUTH_CLIENT_ID environment variable is not set');
    }

    if (!process.env.CLERK_OAUTH_CLIENT_SECRET) {
      throw new Error('CLERK_OAUTH_CLIENT_SECRET environment variable is not set');
    }

    const params = new URLSearchParams({
      client_id: process.env.CLERK_OAUTH_CLIENT_ID,
      client_secret: process.env.CLERK_OAUTH_CLIENT_SECRET,
      code,
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/callback`,
      grant_type: 'authorization_code',
    });

    if (codeVerifier)
      params.append('code_verifier', codeVerifier);

    console.log('Token request URL:', this.getClerkTokenUrl());
    console.log('Token request params:', params.toString());
    
    const response = await fetch(this.getClerkTokenUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json'
      },
      body: params.toString()
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Token exchange failed with status:', response.status);
      console.error('Token exchange error response:', error);
      throw new Error(`Failed to exchange code for tokens: ${error}`);
    }

    const data = await response.json();
    console.log('Token exchange successful, received tokens');
    
    return {
      access_token: data.access_token,
      token_type: data.token_type || 'bearer',
      expires_in: data.expires_in,
      refresh_token: data.refresh_token,
      scope: data.scope
    };
  }

  // Refresh access token with Clerk
  async refreshAccessToken(refreshToken: string): Promise<OAuthTokens> {
    if (!process.env.CLERK_OAUTH_CLIENT_ID) {
      throw new Error('CLERK_OAUTH_CLIENT_ID environment variable is not set');
    }

    if (!process.env.CLERK_OAUTH_CLIENT_SECRET) {
      throw new Error('CLERK_OAUTH_CLIENT_SECRET environment variable is not set');
    }

    const params = new URLSearchParams({
      client_id: process.env.CLERK_OAUTH_CLIENT_ID,
      client_secret: process.env.CLERK_OAUTH_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
    });

    const response = await fetch(this.getClerkTokenUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json'
      },
      body: params.toString()
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to refresh access token: ${error}`);
    }

    const data = await response.json();
    
    return {
      access_token: data.access_token,
      token_type: data.token_type || 'bearer',
      expires_in: data.expires_in,
      refresh_token: data.refresh_token,
      scope: data.scope
    };
  }

  // Revoke token with Clerk
  async revokeToken(token: string, tokenTypeHint?: string): Promise<void> {
    if (!process.env.CLERK_OAUTH_CLIENT_ID) {
      throw new Error('CLERK_OAUTH_CLIENT_ID environment variable is not set');
    }

    if (!process.env.CLERK_OAUTH_CLIENT_SECRET) {
      throw new Error('CLERK_OAUTH_CLIENT_SECRET environment variable is not set');
    }

    const params = new URLSearchParams({
      client_id: process.env.CLERK_OAUTH_CLIENT_ID,
      client_secret: process.env.CLERK_OAUTH_CLIENT_SECRET,
      token
    });

    if (tokenTypeHint) {
      params.append('token_type_hint', tokenTypeHint);
    }

    const response = await fetch(this.getClerkRevocationUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json'
      },
      body: params.toString()
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to revoke token: ${error}`);
    }
  }

  // Get user info with Clerk
  async getUserInfo(accessToken: string): Promise<Record<string, unknown>> {
    const response = await fetch(this.getClerkUserinfoUrl(), {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to get user info: ${error}`);
    }

    return response.json();
  }

  // Get OAuth server metadata
  getServerMetadata(): OAuthMetadata {
    return {
      issuer: process.env.NEXT_PUBLIC_APP_URL || '',
      authorization_endpoint: `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/authorize`,
      token_endpoint: `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/token`,
      registration_endpoint: `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/register`,
      response_types_supported: ['code'],
      grant_types_supported: ['authorization_code', 'refresh_token'],
      token_endpoint_auth_methods_supported: ['client_secret_basic', 'client_secret_post', 'none'],
      revocation_endpoint: `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/revoke`,
      scopes_supported: ['openid', 'profile', 'email'],
      code_challenge_methods_supported: ['S256']
    };
  }
}

// Export singleton instance
export const oauthServerService = new OAuthServer();
