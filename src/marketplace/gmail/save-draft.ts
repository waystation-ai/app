import { z } from 'zod';
import { defineTool } from '../core/types';
import { queryGmailApi, formatEmailAddress, createEmailMessage } from './utils';

export const saveGmailDraft = defineTool({
  id: 'saveGmailDraft',
  summary: 'Save a draft email in Gmail',
  description: 'Creates and saves a draft email in the user\'s Gmail account that can be edited and sent later.',
  method: 'POST',
  path: '/tools/gmail/save_draft',
  parameters: z.object({
    to: z.union([z.string(), z.array(z.string())]).describe('Recipient email address(es)'),
    subject: z.string().describe('Email subject line'),
    body: z.string().describe('Email body content (supports HTML)'),
    cc: z.union([z.string(), z.array(z.string())]).optional().describe('CC recipient email address(es)'),
    bcc: z.union([z.string(), z.array(z.string())]).optional().describe('BCC recipient email address(es)'),
    threadId: z.string().optional().describe('Thread ID if this is a reply to an existing conversation')
  }),
  responses: {
    '200': {
      description: 'Success response with draft details',
      schema: z.object({
        id: z.string().describe('The unique identifier for the draft'),
        message: z.object({
          id: z.string().describe('The message ID of the draft'),
          threadId: z.string().optional().describe('The thread ID if this is part of a conversation'),
          labelIds: z.array(z.string()).describe('Array of label IDs applied to the draft')
        }).describe('The draft message details')
      })
    }
  },
  handler: async ({ context, params }) => {
    try {
      const toAddresses = formatEmailAddress(params.to);
      const ccAddresses = params.cc ? formatEmailAddress(params.cc) : undefined;
      const bccAddresses = params.bcc ? formatEmailAddress(params.bcc) : undefined;

      const message = createEmailMessage({
        to: toAddresses,
        subject: params.subject,
        body: params.body,
        cc: ccAddresses,
        bcc: bccAddresses,
        threadId: params.threadId
      });

      const draftData = {
        message
      };

      const result = await queryGmailApi(context, 'users/me/drafts', 'POST', draftData);

      return {
        id: result.id,
        message: {
          id: result.message.id,
          threadId: result.message.threadId,
          labelIds: result.message.labelIds || []
        }
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Failed to save Gmail draft: ${JSON.stringify(error)}`);
    }
  }
});
