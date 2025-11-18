import { z } from 'zod';
import { defineTool } from '../core/types';
import { queryGmailApi } from './utils';

interface GmailLabel {
  id: string;
  name: string;
  type: 'system' | 'user';
  messageListVisibility?: 'show' | 'hide';
  labelListVisibility?: 'labelShow' | 'labelShowIfUnread' | 'labelHide';
  messagesTotal?: number;
  messagesUnread?: number;
  threadsTotal?: number;
  threadsUnread?: number;
}

export const listGmailLabels = defineTool({
  id: 'listGmailLabels',
  summary: 'List Gmail labels',
  description: 'Retrieves a list of all labels in the user\'s Gmail account, including system labels like Inbox, Sent, Draft, and custom labels.',
  method: 'GET',
  path: '/tools/gmail/list_labels',
  parameters: z.object({}),
  responses: {
    '200': {
      description: 'Success response with list of Gmail labels',
      schema: z.object({
        labels: z.array(z.object({
          id: z.string().describe('The unique identifier for the label'),
          name: z.string().describe('The display name of the label'),
          type: z.enum(['system', 'user']).describe('The label type (system or user-created)'),
          messageListVisibility: z.enum(['show', 'hide']).optional().describe('Visibility of the label in the message list'),
          labelListVisibility: z.enum(['labelShow', 'labelShowIfUnread', 'labelHide']).optional().describe('Visibility of the label in the label list'),
          messagesTotal: z.number().optional().describe('Total number of messages with this label'),
          messagesUnread: z.number().optional().describe('Number of unread messages with this label'),
          threadsTotal: z.number().optional().describe('Total number of threads with this label'),
          threadsUnread: z.number().optional().describe('Number of unread threads with this label')
        }))
      })
    }
  },
  handler: async ({ context }) => {
    try {
      const endpoint = 'users/me/labels';
      const result = await queryGmailApi(context, endpoint);

      return {
        labels: (result.labels || []).map((label: GmailLabel) => ({
          id: label.id,
          name: label.name,
          type: label.type,
          messageListVisibility: label.messageListVisibility,
          labelListVisibility: label.labelListVisibility,
          messagesTotal: label.messagesTotal,
          messagesUnread: label.messagesUnread,
          threadsTotal: label.threadsTotal,
          threadsUnread: label.threadsUnread
        }))
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Failed to list Gmail labels: ${JSON.stringify(error)}`);
    }
  }
});
