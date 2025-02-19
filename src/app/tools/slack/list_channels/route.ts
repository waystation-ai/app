import { NextRequest, NextResponse } from 'next/server';
import { oauthService } from '@/services/oauth-service';
import { authenticateRequest } from '../../shared/utils';

export async function GET(request: NextRequest) {
  const userId = await authenticateRequest(request);
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const accessToken = await oauthService.getValidAccessToken('slack', userId);

    const response = await fetch('https://slack.com/api/conversations.list', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      console.error('Slack API error:', response.statusText);
      return NextResponse.json({ error: 'Failed to fetch channels' }, { status: 500 });
    }

    const data = await response.json();
    
    if (!data.ok) {
      console.error('Slack API error:', data.error);
      return NextResponse.json({ error: data.error }, { status: 500 });
    }

    const channels = data.channels.map((channel: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
      id: channel.id,
      name: channel.name
    }));

    return NextResponse.json(channels);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
