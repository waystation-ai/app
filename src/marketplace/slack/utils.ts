import { ToolContext } from '../core/types';

interface SlackChannel {
  id: string;
  name: string;
}

export async function querySlackApi(
  context: ToolContext, 
  endpoint: string, 
  method: 'GET' | 'POST' = 'GET', 
  body?: Record<string, unknown>
) {
  try {
    const accessToken = await context.getAccessToken();

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

export async function findSlackChannel(context: ToolContext, channel: string): Promise<SlackChannel> {
  // Handle channel name with or without # prefix
  const channelName = channel.startsWith('#') ? channel.substring(1) : channel;

  // Get channel ID if name was provided
  const response = await querySlackApi(context, 'conversations.list?types=public_channel,private_channel');
  const result = response.channels.find((c: SlackChannel) => c.name === channelName || c.id === channelName);
  
  if (!result) {
    throw new Error(`Channel #${channelName} not found. Use the listSlackChannels tool to see available channels.`);
  }

  return result;
}
