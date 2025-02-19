import { NextRequest, NextResponse } from 'next/server';
import { oauthService } from '@/services/oauth-service';
import { authenticateRequest } from '../../shared/utils';

export async function POST(request: NextRequest) {
  const userId = await authenticateRequest(request);
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body = await request.json();
    const { channel, message } = body;

    if (!channel || !message) {
      return NextResponse.json(
        { error: 'Channel and message are required' },
        { status: 400 }
      );
    }

    // Handle channel name with or without # prefix
    const channelName = channel.startsWith('#') ? channel.substring(1) : channel;

    const accessToken = await oauthService.getValidAccessToken('slack', userId);

    const response = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        channel: channelName,
        text: message
      })
    });

    if (!response.ok) {
      console.error('Slack API error:', response.statusText);
      return NextResponse.json(
        { error: 'Failed to post message' },
        { status: 500 }
      );
    }

    const data = await response.json();
    
    if (!data.ok) {
      console.error('Slack API error:', data.error);
      return NextResponse.json(
        { error: data.error },
        { status: data.error === 'channel_not_found' ? 400 : 500 }
      );
    }

    return NextResponse.json({
      ts: data.ts,
      channel: data.channel
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
