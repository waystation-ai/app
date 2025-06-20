import { auth } from '@clerk/nextjs/server';
import { getProviderConfig } from '@/lib/services/provider-config';
import { 
  getValidConnection, 
  storeOAuthTokens, 
  getOAuthMetadata,
  storeOAuthMetadata,
  getClientRegistration,
  storeClientRegistration,
} from '@/lib/db';
import { Buffer } from 'buffer';
import { isRemoteProvider, RemoteProvider, NativeProvider, isNativeProvider, FullProvider } from '@/marketplace/core/types';
import { discoverOAuthMetadata, OAuthClientProvider, registerClient } from '@modelcontextprotocol/sdk/client/auth.js';
import { OAuthClientInformation, OAuthClientMetadata, OAuthTokens, OAuthTokensSchema } from '@modelcontextprotocol/sdk/shared/auth.js';

// Helper function for base64URL encoding
function base64URLEncode(buffer: Uint8Array): string {
  return Buffer.from(buffer)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export class OAuthClient {
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

  async buildAuthorizationUrl(userId: string, provider: string): Promise<{ url: string; state: string; codeVerifier: string }> {
    const config = getProviderConfig(provider);
    
    // Check if this is a remote provider that needs dynamic registration
    if (isRemoteProvider(config)) {
      // Enhance the provider config with client registration data
      const enhancedConfig = await this.convertRemotetoNativeConfig(userId, config);
      
      // Now we can use the existing code path with the enhanced config
      return this.buildAuthorizationUrlWithConfig(provider, enhancedConfig);
    }
    
    // Use existing code for native providers
    if (isNativeProvider(config)) 
      return this.buildAuthorizationUrlWithConfig(provider, config);

    throw new Error(`Provider ${provider} is not supported`);
  }

  private async buildAuthorizationUrlWithConfig(provider: string, config: NativeProvider): Promise<{ url: string; state: string; codeVerifier: string }> {
    // This is the existing implementation, extracted to a separate method
    if (!config.clientId) {
      throw new Error(`Client ID not configured for provider: ${provider}`);
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
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/${provider}/callback`,
      response_type: 'code',
      access_type: 'offline',
      scope: config.scopes.join(' '),
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });

    // Add provider-specific parameters
    if (provider === 'slack') {
      params.append('user_scope', config.scopes.join(' '));
    }

    return {
      url: `${config.authorizationUrl}?${params.toString()}`,
      state,
      codeVerifier
    };
  }

  private getOAuthClientMetadata(provider: RemoteProvider): OAuthClientMetadata {
    return {
      client_name: `WayStation`,
      redirect_uris: [`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/${provider.id}/callback`],
      grant_types: ['authorization_code', 'refresh_token'],
      response_types: ['code'],
      //token_endpoint_auth_method: 'none', // Public client
    }
  }

  private async convertRemotetoNativeConfig(userId: string, provider: RemoteProvider): Promise<NativeProvider> {
    if (!provider.serverUrl) {
      throw new Error(`Server URL not configured for provider: ${provider}`);
    }

    // Get OAuth metadata and client registration info separately
    let oauthMetadata = await getOAuthMetadata(userId, provider.id, provider.serverUrl);
    let clientInfo = await getClientRegistration(userId, provider.id, provider.serverUrl);
    
    if (!clientInfo) {
      // Discover server metadata if not available
      if (!oauthMetadata) {
        oauthMetadata = await discoverOAuthMetadata(provider.serverUrl);
        
        // Store the OAuth metadata
        if (oauthMetadata) {
          await storeOAuthMetadata(userId, provider.id, provider.serverUrl, oauthMetadata);
        }
      }

      // Register a new client
      const registrationEndpoint = oauthMetadata?.registration_endpoint || 
                                  new URL('/token', provider.serverUrl).toString();
      
      const clientMetadata = await registerClient(registrationEndpoint, {
        metadata: oauthMetadata,
        clientMetadata: this.getOAuthClientMetadata(provider)
      });
      
      // Store client registration info separately
      await storeClientRegistration(userId, provider.id, provider.serverUrl, clientMetadata);
      
      // Retrieve the stored client info
      clientInfo = await getClientRegistration(userId, provider.id, provider.serverUrl);
      
      if (!clientInfo) {
        throw new Error(`Failed to store client registration for provider: ${provider}`);
      }
    }
    
    // Create an enhanced provider config with the client registration data
    return {
      ...provider,
      clientId: clientInfo.client_id,
      clientSecret: clientInfo.client_secret,
      authorizationUrl: oauthMetadata?.authorization_endpoint,
      tokenUrl: oauthMetadata?.token_endpoint,
      scopes: ['openid', 'profile', 'email'], // Default scopes, can be customized
      tools: []
    };
  }

  async exchangeCodeForTokens(userId: string,provider: FullProvider, code: string, codeVerifier?: string): Promise<OAuthTokens> {

    // Check if this is a remote provider
    if (isRemoteProvider(provider)) {
      // Enhance the provider config with client registration data
      const native = await this.convertRemotetoNativeConfig(userId,provider);
      
      // Now we can use the existing code path with the enhanced config
      return this.exchangeCodeForTokensWithConfig(native, code, codeVerifier);
    }
    
    // Use existing code for native providers
    return this.exchangeCodeForTokensWithConfig(provider, code, codeVerifier);
  }

  private async exchangeCodeForTokensWithConfig(provider: NativeProvider, code: string, codeVerifier?: string): Promise<OAuthTokens> {
    if (!provider.clientId) {
      throw new Error(`Client ID not configured for provider: ${provider}`);
    }

    if (!provider.clientSecret) {
      throw new Error(`Client secret not configured for provider: ${provider}`);
    }

    if (!provider.tokenUrl) {
      throw new Error(`Token URL not configured for provider: ${provider}`);
    }

    const params = new URLSearchParams({
      client_id: provider.clientId,
      client_secret: provider.clientSecret || '',
      code,
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/${provider.id}/callback`,
      grant_type: 'authorization_code',
      code_verifier: codeVerifier || '',
    });

    // Add code verifier for Airtable PKCE and remote providers
    if ((provider.id === 'airtable') && codeVerifier) {
      params.delete('client_secret');
    }

    const response = await fetch(provider.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
        Authorization: `Basic ${Buffer.from(`${provider.clientId}:${provider.clientSecret}`).toString('base64')}`
      },
      body: params.toString()
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to exchange code for tokens: ${error}`);
    }

    const data = await response.json();
    const tokens = OAuthTokensSchema.parse(data);

    // For Slack, use the user token from authed_user if available
    if (provider.id === 'slack' && data.authed_user?.access_token) {
      return {
        ...tokens,
        access_token: data.authed_user.access_token,
      };
    }

    return tokens;
  }

  async refreshAccessToken(userId: string, provider: FullProvider, refreshToken: string): Promise<OAuthTokens> {    
    // Check if this is a remote provider
    if (isRemoteProvider(provider)) {
      // Enhance the provider config with client registration data
      const native = await this.convertRemotetoNativeConfig(userId, provider);
      
      // Now we can use the existing code path with the enhanced config
      return this.refreshAccessTokenWithConfig(native, refreshToken);
    }
    
    // Use existing code for native providers
    return this.refreshAccessTokenWithConfig(provider, refreshToken);
  }

  private async refreshAccessTokenWithConfig(provider: NativeProvider, refreshToken: string): Promise<OAuthTokens> {
    if (!provider.clientId) {
      throw new Error(`Client ID not configured for provider: ${provider}`);
    }

    if (!provider.clientSecret) {
      throw new Error(`Client secret not configured for provider: ${provider}`);
    }

    if (!provider.tokenUrl) {
      throw new Error(`Token URL not configured for provider: ${provider}`);
    }

    const params = new URLSearchParams({
      client_id: provider.clientId,
      client_secret: provider.clientSecret || '',
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
    });

    // Add code verifier for Airtable PKCE
    if (provider.id === 'airtable') {
      params.delete('client_secret');
    }

    const response = await fetch(provider.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
        Authorization: `Basic ${Buffer.from(`${provider.clientId}:${provider.clientSecret}`).toString('base64')}`
      },
      body: params.toString()
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to refresh access token: ${error}`);
    }

    const data = await response.json();
    return OAuthTokensSchema.parse(data);
  }

  async getValidAccessToken(provider: FullProvider, userId: string | null): Promise<string> {
    if (!userId) {
      const session = await auth();
      userId = session.userId;
    }
    
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const connection = await getValidConnection(userId, provider.id);
    if (!connection) {
      throw new Error(`No valid connection found for provider: ${provider.id}. Ask user to set up a connection with ${provider.id} by visiting https://${process.env.APP_DOMAIN}/`);
    }

    // If token is expired and we have a refresh token, try to refresh it
    if (connection.expiresAt && new Date(connection.expiresAt) < new Date() && connection.refreshToken) {
      const tokens = await this.refreshAccessToken(userId, provider, connection.refreshToken);

      // Store the new tokens
      await storeOAuthTokens(userId, provider.id, tokens);
      console.log(`Access token of user "${userId}" for provider "${provider.id}" saved`)

      return tokens.access_token;
    }

    console.log(`Get access token for user "${userId}" for provider "${provider.id}"`)

    return connection.accessToken;
  }
}

// Export singleton instance
export const oauthService = new OAuthClient();

export class RemoteOAuthClientProvider implements OAuthClientProvider {
  private provider: RemoteProvider;
  private userId: string;
  
  constructor(provider: RemoteProvider, userId: string) {
    this.provider = provider;
    this.userId = userId;
  }

  get redirectUrl(): string | URL {
    throw new Error('Method not implemented');
  }

  get clientMetadata(): OAuthClientMetadata {
    return {
      client_name: `WayStation`,
      redirect_uris: [`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/${this.provider.id}/callback`],
      grant_types: ['authorization_code', 'refresh_token'],
      response_types: ['code'],
      //token_endpoint_auth_method: 'none', // Public client
    }
  };
 
  async clientInformation(): Promise<OAuthClientInformation | undefined> {
    const registration = await getClientRegistration(this.userId,this.provider.id, this.provider.serverUrl);

    return registration || undefined;
  }

  saveClientInformation?(/*clientInformation: OAuthClientInformationFull*/): void | Promise<void> {
    throw new Error('Method not implemented.');
  }

  async tokens(): Promise<OAuthTokens | undefined> {
    const connection = await getValidConnection(this.userId, this.provider.id);
    
    if (!connection) 
      return undefined;

    return {
      access_token: connection.accessToken,
      refresh_token: connection.refreshToken || undefined,
      expires_in: connection.expiresAt ? Math.floor((new Date(connection.expiresAt).getTime() - Date.now()) / 1000) : undefined,
      scope: connection.scopes?.join(' '),
      token_type: 'bearer',
    };
  }

  async saveTokens(tokens: OAuthTokens): Promise<void> {
    await storeOAuthTokens(this.userId, this.provider.id, tokens);
  }

  redirectToAuthorization(/*authorizationUrl: URL*/): void | Promise<void> {
    throw new Error('Method not implemented.');
  }

  saveCodeVerifier(/*codeVerifier: string*/): void | Promise<void> {
    throw new Error('Method not implemented.');
  }

  codeVerifier(): string | Promise<string> {
    throw new Error('Method not implemented.');
  }

}
