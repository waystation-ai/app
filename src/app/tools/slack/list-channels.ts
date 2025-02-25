import { z } from 'zod';
import { defineTool } from '../core/types';
import { querySlackApi } from './utils';

// Define the response type to match the schema
type Channel = {
  id: string;
  name: string;
  is_private: boolean;
  is_archived: boolean;
};

export const listSlackChannels = defineTool({
  id: 'listSlackChannels',
  summary: 'List Slack channels',
  description: 'Retrieves a list of public and private channels from the authenticated user\'s Slack workspace.',
  method: 'GET',
  path: '/tools/slack/list_channels',
  parameters: z.object({}), // No parameters needed
  responses: {
    '200': {
      description: 'A JSON array of Slack channels',
      schema: z.array(z.object({
        id: z.string().describe('Unique identifier for the channel'),
        name: z.string().describe('Name of the channel'),
        is_private: z.boolean().describe('Whether the channel is private'),
        is_archived: z.boolean().describe('Whether the channel is archived')
      }))
    }
  },
  handler: async ({ context }) => {
    try {
      const result = await querySlackApi(
        context.userId, 
        'conversations.list?types=public_channel,private_channel&exclude_archived=false'
      );
      
      // Define the Slack channel structure
      interface SlackChannel {
        id: string;
        name: string;
        is_private?: boolean;
        is_archived?: boolean;
      }
      
      // Extract the channels from the response and map to the expected format
      const channels = (result.channels || []) as SlackChannel[];
      
      return channels.map((channel) => ({
        id: channel.id,
        name: channel.name,
        is_private: channel.is_private || false,
        is_archived: channel.is_archived || false
      })) as Channel[];
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Failed to list Slack channels: ${JSON.stringify(error)}`);
    }
  }
});
