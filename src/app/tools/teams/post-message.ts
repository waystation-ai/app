import { z } from 'zod';
import { defineTool } from '../core/types';
import { queryTeamsApi } from './utils';

interface MessageResponse {
  id: string;
  createdDateTime: string;
}

export const postTeamsMessage = defineTool({
  id: 'postTeamsMessage',
  summary: 'Post a message to a Microsoft Teams channel',
  description: 'Sends a text message to a specified Microsoft Teams channel.',
  method: 'POST',
  path: '/tools/teams/post_message',
  parameters: z.object({
    teamId: z.string().describe('The ID of the team'),
    channelId: z.string().describe('The ID of the channel to post to'),
    message: z.string().describe('The message text to post')
  }),
  responses: {
    '200': {
      description: 'Success response with message details',
      schema: z.object({
        id: z.string().describe('The message ID'),
        createdDateTime: z.string().describe('The timestamp when the message was created')
      })
    }
  },
  handler: async ({ context, params }) => {
    try {
      const result = await queryTeamsApi<MessageResponse>(
        context.userId,
        `teams/${params.teamId}/channels/${params.channelId}/messages`,
        {
          method: 'POST',
          body: {
            body: {
              content: params.message
            }
          }
        }
      );
      
      return {
        id: result.id,
        createdDateTime: result.createdDateTime
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Failed to post Teams message: ${JSON.stringify(error)}`);
    }
  }
});
