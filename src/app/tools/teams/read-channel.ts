import { z } from 'zod';
import { defineTool } from '../core/types';
import { queryTeamsApi } from './utils';

interface Team {
  id: string;
  displayName: string;
}

interface Channel {
  id: string;
  displayName: string;
}

interface Message {
  id: string;
  body: {
    content: string;
  };
  from: {
    user?: {
      id: string;
      displayName: string;
    };
  };
  createdDateTime: string;
}

interface MessagesResponse {
  value: Message[];
}

const MessageSchema = z.object({
  id: z.string().describe('Message ID'),
  content: z.string().describe('Message text content'),
  from: z.object({
    user: z.object({
      id: z.string().describe('User ID'),
      displayName: z.string().describe('User display name')
    })
  }).describe('Sender information'),
  createdDateTime: z.string().describe('Message timestamp'),
});

export const readTeamsChannel = defineTool({
  id: 'readTeamsChannel',
  summary: 'Read messages from a Microsoft Teams channel',
  description: 'Retrieves conversation history from a specified Microsoft Teams channel.',
  method: 'GET',
  path: '/tools/teams/read_channel',
  parameters: z.object({
    teamId: z.string().describe('The ID of the team'),
    channelId: z.string().describe('The ID of the channel to read from'),
    limit: z.number().optional().default(50).describe('Number of messages to return')
  }),
  responses: {
    '200': {
      description: 'Channel messages',
      schema: z.object({
        teamId: z.string().describe('Team ID'),
        teamName: z.string().describe('Team name'),
        channelId: z.string().describe('Channel ID'),
        channelName: z.string().describe('Channel name'),
        messages: z.array(MessageSchema).describe('Channel messages'),
      }),
    },
  },
  handler: async ({ context, params }) => {
    try {
      // Get team details
      const teamResult = await queryTeamsApi<Team>(
        context.userId,
        `teams/${params.teamId}`
      );
      
      // Get channel details
      const channelResult = await queryTeamsApi<Channel>(
        context.userId,
        `teams/${params.teamId}/channels/${params.channelId}`
      );
      
      // Get messages from the channel
      const messagesResult = await queryTeamsApi<MessagesResponse>(
        context.userId,
        `teams/${params.teamId}/channels/${params.channelId}/messages`,
        {
          params: { '$top': params.limit?.toString() || '50' }
        }
      );
      
      // Process and format messages
      const messages = messagesResult.value.map((msg) => ({
        id: msg.id,
        content: msg.body.content,
        from: {
          user: {
            id: msg.from?.user?.id || 'unknown',
            displayName: msg.from?.user?.displayName || 'Unknown User'
          }
        },
        createdDateTime: msg.createdDateTime
      }));
      
      return {
        teamId: teamResult.id,
        teamName: teamResult.displayName,
        channelId: channelResult.id,
        channelName: channelResult.displayName,
        messages,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Failed to read Teams channel: ${JSON.stringify(error)}`);
    }
  },
});
