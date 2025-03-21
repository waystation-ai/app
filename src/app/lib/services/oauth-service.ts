import { auth } from '@clerk/nextjs/server';
import { getProviderConfig } from '@/app/lib/services/provider-config';
import { getValidConnection, storeOAuthTokens } from '@/app/lib/db';
import { z } from 'zod';
import { Buffer } from 'buffer';

// Helper function for base64URL encoding
function base64URLEncode(buffer: Uint8Array): string {
  return Buffer.from(buffer)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

const TokenResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string().optional(),
  expires_in: z.number().optional(),
  scope: z.string().optional(),
  authed_user: z.object({
    access_token: z.string(),
    scope: z.string().optional()
  }).optional()
});

export class OAuthService {
  private generateState(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private generateCodeVerifier(): string {
    const array = new Uint8Array(64);
    crypto.getRandomValues(array);
    return base64URLEncode(array);
  }

  private async generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return base64URLEncode(new Uint8Array(digest));
  }

  private getExpiryDate(expiresIn?: number): Date | undefined {
    if (!expiresIn) return undefined;
    return new Date(Date.now() + expiresIn * 1000);
  }

  private getScopesArray(scope?: string): string[] | undefined {
    return scope?.split(' ');
  }

  async buildAuthorizationUrl(provider: string): Promise<{ url: string; state: string; codeVerifier: string }> {
    const config = getProviderConfig(provider);
    
    if (!config.clientId) {
      throw new Error(`Client ID not configured for provider: ${provider}`);
    }
    if (!config.redirectUri) {
      throw new Error(`Redirect URI not configured for provider: ${provider}`);
    }
    if (!config.authorizationUrl) {
      throw new Error(`Authorization URL not configured for provider: ${provider}`);
    }
    if (!config.scopes) {
      throw new Error(`Scopes not configured for provider: ${provider}`);
    }

    const state = this.generateState();
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);

    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      response_type: 'code',
      access_type: 'offline',
      scope: config.scopes.join(' '),
      state
    });

    // Add provider-specific parameters
    if (provider === 'slack') {
      params.append('user_scope', config.scopes.join(' '));
    }

    // Add PKCE parameters for Airtable
    if (provider === 'airtable') {
      params.append('code_challenge', codeChallenge);
      params.append('code_challenge_method', 'S256');
    }

    return {
      url: `${config.authorizationUrl}?${params.toString()}`,
      state,
      codeVerifier
    };
  }

  async exchangeCodeForTokens(provider: string, code: string, codeVerifier?: string):
   Promise<{ accessToken: string; refreshToken?: string; expiresAt?: Date; scopes?: string[];}> {
    const config = getProviderConfig(provider);
    
    if (!config.clientId) {
      throw new Error(`Client ID not configured for provider: ${provider}`);
    }
    if (!config.clientSecret) {
      throw new Error(`Client secret not configured for provider: ${provider}`);
    }
    if (!config.redirectUri) {
      throw new Error(`Redirect URI not configured for provider: ${provider}`);
    }
    if (!config.tokenUrl) {
      throw new Error(`Token URL not configured for provider: ${provider}`);
    }

    const params = new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      redirect_uri: config.redirectUri,
      grant_type: 'authorization_code'
    });

    // Add code verifier for Airtable PKCE
    if (provider === 'airtable' && codeVerifier) {
      params.delete('client_secret');
      params.append('code_verifier', codeVerifier);
    }

    const response = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
        Authorization: `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64')}`
      },
      body: params.toString()
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to exchange code for tokens: ${error}`);
    }

    const data = await response.json();
    const tokens = TokenResponseSchema.parse(data);

    // For Slack, use the user token from authed_user if available
    if (provider === 'slack' && data.authed_user?.access_token) {
      return {
        accessToken: data.authed_user.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: this.getExpiryDate(tokens.expires_in),
        scopes: this.getScopesArray(data.authed_user.scope)
      };
    }

    return {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: this.getExpiryDate(tokens.expires_in),
      scopes: this.getScopesArray(tokens.scope)
    };
  }

  async refreshAccessToken(provider: string, refreshToken: string): Promise<{ accessToken: string; refreshToken?: string; expiresAt?: Date; scopes?: string[];}> {
    const config = getProviderConfig(provider);
    
    if (!config.clientId) {
      throw new Error(`Client ID not configured for provider: ${provider}`);
    }
    if (!config.clientSecret) {
      throw new Error(`Client secret not configured for provider: ${provider}`);
    }
    if (!config.tokenUrl) {
      throw new Error(`Token URL not configured for provider: ${provider}`);
    }

    const params = new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
    });

    // Add code verifier for Airtable PKCE
    if (provider === 'airtable') {
      params.delete('client_secret');
    }

    const response = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
        Authorization: `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64')}`
      },
      body: params.toString()
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to refresh access token: ${error}`);
    }

    const data = await response.json();
    const tokens = TokenResponseSchema.parse(data);

    return {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: this.getExpiryDate(tokens.expires_in),
      scopes: this.getScopesArray(tokens.scope)
    };
  }

  async getValidAccessToken(provider: string, userId: string | null): Promise<string> {
    if (!userId) {
      const session = await auth();
      userId = session.userId;
    }
    
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const connection = await getValidConnection(userId, provider);
    if (!connection) {
      throw new Error(`No valid connection found for provider: ${provider}. Ask user to set up a connection with ${provider} by visiting https://${process.env.APP_DOMAIN}/dashboard`);
    }

    // If token is expired and we have a refresh token, try to refresh it
    if (connection.expiresAt && new Date(connection.expiresAt) < new Date() && connection.refreshToken) {
      const tokens = await this.refreshAccessToken(
        provider,
        connection.refreshToken
      );

      // Store the new tokens
      await storeOAuthTokens(userId, provider, tokens);
      console.log(`Access token of user "${userId}" for provider "${provider}" saved`)

      return tokens.accessToken;
    }

    console.log(`Get access token for user "${userId}" for provider "${provider}"`)

    return connection.accessToken;
  }
}

// Export singleton instance
export const oauthService = new OAuthService();
