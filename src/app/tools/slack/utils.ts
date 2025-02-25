import { oauthService } from '@/app/lib/services/oauth-service';

export async function querySlackApi(
  userId: string, 
  endpoint: string, 
  method: 'GET' | 'POST' = 'GET', 
  body?: Record<string, unknown>
) {
  try {
    const accessToken = await oauthService.getValidAccessToken('slack', userId);

    const response = await fetch(`https://slack.com/api/${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      ...(body && { body: JSON.stringify(body) })
    });

    if (!response.ok) {
      throw new Error(`Failed to call Slack API: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Slack API returns { ok: false } for API-level errors
    if (data && data.ok === false) {
      throw new Error(`Slack API error: ${data.error || 'Unknown error'}`);
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Unknown error: ${JSON.stringify(error)}`);
  }
}
