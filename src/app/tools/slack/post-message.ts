import { z } from 'zod';
import { defineTool } from '../core/types';
import { querySlackApi } from './utils';

export const postSlackMessage = defineTool({
  id: 'postSlackMessage',
  summary: 'Post a message to a Slack channel',
  description: 'Sends a text message to a specified Slack channel in the authenticated user\'s workspace.',
  method: 'POST',
  path: '/tools/slack/post_message',
  parameters: z.object({
    channel: z.string().describe('The channel to post to (with or without # prefix)'),
    message: z.string().describe('The message text to post')
  }),
  responses: {
    '200': {
      description: 'Success response with message details',
      schema: z.object({
        channel: z.string().describe('The channel the message was posted to'),
        ts: z.string().describe('The timestamp of the message'),
        message_id: z.string().describe('The unique identifier for the message')
      })
    }
  },
  handler: async ({ context, params }) => {
    try {
      // Handle channel name with or without # prefix
      const channelName = params.channel.startsWith('#') 
        ? params.channel.substring(1) 
        : params.channel;

      const result = await querySlackApi(
        context,
        'chat.postMessage',
        'POST',
        {
          channel: channelName,
          text: params.message
        }
      );
      
      // Return a simplified response with just the essential information
      return {
        channel: result.channel,
        ts: result.ts,
        message_id: result.ts // Slack uses the timestamp as the message ID
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Failed to post Slack message: ${JSON.stringify(error)}`);
    }
  }
});
