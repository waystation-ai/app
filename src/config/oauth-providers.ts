import { z } from 'zod';

export const OAuthProviderSchema = z.object({
  name: z.string(),
  clientId: z.string(),
  clientSecret: z.string(),
  authorizationUrl: z.string().url(),
  tokenUrl: z.string().url(),
  scopes: z.array(z.string()),
  redirectUri: z.string().url()
});

export type OAuthProvider = z.infer<typeof OAuthProviderSchema>;

if (!process.env.NEXT_PUBLIC_APP_URL) {
  throw new Error('NEXT_PUBLIC_APP_URL environment variable is not set');
}

const baseRedirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth`;

export const providers: Record<string, OAuthProvider> = {
  slack: {
    name: 'Slack',
    clientId: process.env.SLACK_CLIENT_ID || '',
    clientSecret: process.env.SLACK_CLIENT_SECRET || '',
    authorizationUrl: 'https://slack.com/oauth/v2/authorize',
    tokenUrl: 'https://slack.com/api/oauth.v2.access',
    scopes: [
      'channels:read',
      'chat:write',
      'chat:write.public',
      'files:read',
      'users:read'
    ],
    redirectUri: `${baseRedirectUri}/slack/callback`
  },
  monday: {
    name: 'Monday',
    clientId: process.env.MONDAY_CLIENT_ID || '',
    clientSecret: process.env.MONDAY_CLIENT_SECRET || '',
    authorizationUrl: 'https://auth.monday.com/oauth2/authorize',
    tokenUrl: 'https://auth.monday.com/oauth2/token',
    scopes: [
      'me:read',
      'boards:read',
      'boards:write',
      'workspaces:read',
      'updates:read',
      'updates:write'
    ],
    redirectUri: `${baseRedirectUri}/monday/callback`
  },
  gdrive: {
    name: 'Google Drive',
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    scopes: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'/*,
       'https://www.googleapis.com/auth/drive.readonly',
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/drive.metadata.readonly'
 */    ],
    redirectUri: `${baseRedirectUri}/gdrive/callback`
  },
  gmail: {
    name: 'Gmail',
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    scopes: [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/gmail.labels'
    ],
    redirectUri: `${baseRedirectUri}/gmail/callback`
  }
};

// Validate provider configurations
Object.entries(providers).forEach(([key, provider]) => {
  try {
    OAuthProviderSchema.parse(provider);
  } catch (error) {
    console.error(`Invalid provider configuration for ${key}:`, error);
    throw error;
  }
});

export type ProviderName = keyof typeof providers;

export function getProviderConfig(provider: string): OAuthProvider {
  const config = providers[provider];
  if (!config) {
    throw new Error(`Unknown provider: ${provider}`);
  }
  return config;
}
