import { z } from 'zod';
import { defineTool } from '../core/types';
import { querySlackApi } from './utils';

// Define Slack API response interfaces
interface SlackChannel {
  id: string;
  name: string;
}

interface SlackMessage {
  ts: string;
  text: string;
  user: string;
  thread_ts?: string;
  reply_count?: number;
}

interface SlackUser {
  id: string;
  name: string;
  real_name: string;
  profile: {
    display_name: string;
  };
}

// Function to replace user mentions with @handles
function replaceUserMentions(text: string, userMap: Map<string, SlackUser>): string {
  return text.replace(/<@([A-Z0-9]+)>/g, (match, userId) => {
    const user = userMap.get(userId);
    return user ? `@${user.profile.display_name || user.real_name}` : match;
  });
}

// Define message type shared between top-level messages and replies
const MessageSchema = z.object({
  id: z.string().describe('Message ID (ts)'),
  text: z.string().describe('Message text content'),
  user: z.string().describe('User ID who sent the message'),
  user_name: z.string().describe('Display name of the user'),
  user_handle: z.string().describe('User\'s @handle'),
  timestamp: z.string().describe('Message timestamp'),
});

// Add reply-specific fields for top-level messages
const TopLevelMessageSchema = MessageSchema.extend({
  has_replies: z.boolean().describe('Whether the message has replies'),
  reply_count: z.number().optional().describe('Number of replies if any'),
  replies: z.array(MessageSchema).optional().describe('Thread replies if any'),
});

export const readSlackChannel = defineTool({
  id: 'readSlackChannel',
  summary: 'Read messages from a Slack channel',
  description: 'Retrieves conversation history from a specified Slack channel, including thread replies.',
  method: 'GET',
  path: '/tools/slack/read_channel',
  parameters: z.object({
    channel: z.string().describe('Channel ID or name (with or without # prefix)'),
    limit: z.number().optional().default(50).describe('Number of messages to return'),
    oldest: z.string().optional().describe('Start of time range (timestamp)'),
    latest: z.string().optional().describe('End of time range (timestamp)'),
    includeThreads: z.boolean().optional().default(true).describe('Whether to include thread replies'),
  }),
  responses: {
    '200': {
      description: 'Channel messages with thread replies',
      schema: z.object({
        channel_id: z.string().describe('Channel ID'),
        channel_name: z.string().describe('Channel name'),
        messages: z.array(TopLevelMessageSchema).describe('Channel messages with their thread replies'),
      }),
    },
  },
  handler: async ({ context, params }) => {
    try {
      // Handle channel name with or without # prefix
      const channelName = params.channel.startsWith('#') ? params.channel.substring(1) : params.channel;

      // First, get channel ID if name was provided
      const channelsResult = await querySlackApi(context.userId, 'conversations.list?types=public_channel,private_channel');
      const channel = channelsResult.channels.find((c: SlackChannel) => c.name === channelName || c.id === channelName);
      
      if (!channel) {
        throw new Error(`Channel ${params.channel} not found`);
      }

      // Fetch channel history
      const historyParams = new URLSearchParams({
        channel: channel.id,
        limit: params.limit?.toString() || '50',
        ...(params.oldest && { oldest: params.oldest }),
        ...(params.latest && { latest: params.latest }),
      });

      const historyResult = await querySlackApi(context.userId, `conversations.history?${historyParams}`);

      // Fetch all users to get their information
      const usersResult = await querySlackApi(context.userId, 'users.list');
      const userMap = new Map<string, SlackUser>();
      for (const user of usersResult.members) {
        userMap.set(user.id, user);
      }
      
      // Process messages and fetch thread replies if needed
      const messages = await Promise.all((historyResult.messages || []).map(async (msg: SlackMessage) => {
        const user = userMap.get(msg.user);
        const baseMessage = {
          id: msg.ts,
          text: replaceUserMentions(msg.text, userMap),
          user: msg.user,
          user_name: user ? (user.profile.display_name || user.real_name) : 'Unknown User',
          user_handle: user ? user.name : 'unknown',
          timestamp: msg.ts,
          has_replies: msg.thread_ts !== undefined || (msg.reply_count ?? 0) > 0,
          reply_count: msg.reply_count ?? 0,
        };

        // Fetch thread replies if message has them and includeThreads is true
        if (baseMessage.has_replies && params.includeThreads) {
          const repliesResult = await querySlackApi(
            context.userId,
            `conversations.replies?channel=${channel.id}&ts=${msg.ts}`
          );

          // Skip the first message as it's the parent
          const replies = (repliesResult.messages || [])
            .slice(1)
            .map((reply: SlackMessage) => ({
              id: reply.ts,
              text: replaceUserMentions(reply.text, userMap),
              user: reply.user,
              user_name: userMap.get(reply.user)?.profile.display_name || userMap.get(reply.user)?.real_name || 'Unknown User',
              user_handle: userMap.get(reply.user)?.name || 'unknown',
              timestamp: reply.ts,
            }));

          return { ...baseMessage, replies };
        }

        return baseMessage;
      }));

      return {
        channel_id: channel.id,
        channel_name: channel.name,
        messages,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Failed to read Slack channel: ${JSON.stringify(error)}`);
    }
  },
});
