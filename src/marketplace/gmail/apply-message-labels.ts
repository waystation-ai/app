import { z } from 'zod';
import { defineTool } from '../core/types';
import { queryGmailApi } from './utils';

export const applyGmailMessageLabels = defineTool({
  id: 'applyGmailMessageLabels',
  summary: 'Apply labels to a Gmail message',
  description: 'Adds or removes labels from a Gmail message. This can be used to label drafts, sent emails, or any existing message in the user\'s Gmail account.',
  method: 'POST',
  path: '/tools/gmail/apply_message_labels',
  parameters: z.object({
    messageId: z.string().describe('The unique identifier of the message to modify'),
    addLabelIds: z.array(z.string()).optional().describe('Array of label IDs to add to the message'),
    removeLabelIds: z.array(z.string()).optional().describe('Array of label IDs to remove from the message')
  }),
  responses: {
    '200': {
      description: 'Success response with updated message details',
      schema: z.object({
        id: z.string().describe('The unique identifier for the message'),
        threadId: z.string().optional().describe('The thread ID the message belongs to'),
        labelIds: z.array(z.string()).describe('Array of label IDs currently applied to the message')
      })
    }
  },
  handler: async ({ context, params }) => {
    try {
      // Build the request payload with only the provided labels
      const modifyData: Record<string, string[]> = {};

      if (params.addLabelIds && params.addLabelIds.length > 0) {
        modifyData.addLabelIds = params.addLabelIds;
      }

      if (params.removeLabelIds && params.removeLabelIds.length > 0) {
        modifyData.removeLabelIds = params.removeLabelIds;
      }

      // If no labels to add or remove, return early
      if (Object.keys(modifyData).length === 0) {
        // Fetch and return the current message state
        const messageResult = await queryGmailApi(
          context,
          `users/me/messages/${params.messageId}?format=minimal`,
          'GET'
        );

        return {
          id: messageResult.id,
          threadId: messageResult.threadId,
          labelIds: messageResult.labelIds || []
        };
      }

      // Apply the label modifications
      const endpoint = `users/me/messages/${params.messageId}/modify`;
      const result = await queryGmailApi(context, endpoint, 'POST', modifyData);

      return {
        id: result.id,
        threadId: result.threadId,
        labelIds: result.labelIds || []
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Failed to apply labels to Gmail message: ${JSON.stringify(error)}`);
    }
  }
});
