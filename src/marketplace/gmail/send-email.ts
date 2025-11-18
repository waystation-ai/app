import { z } from 'zod';
import { defineTool } from '../core/types';
import { queryGmailApi, formatEmailAddress, createEmailMessage, getThreadLastMessageId } from './utils';

export const sendGmailEmail = defineTool({
  id: 'sendGmailEmail',
  summary: 'Send an email via Gmail',
  description: 'Sends an email directly through the user\'s Gmail account. Can optionally be sent as a reply to an existing thread.',
  method: 'POST',
  path: '/tools/gmail/send_email',
  parameters: z.object({
    to: z.union([z.string(), z.array(z.string())]).describe('Recipient email address(es)'),
    subject: z.string().describe('Email subject line'),
    body: z.string().describe('Email body content (supports HTML)'),
    cc: z.union([z.string(), z.array(z.string())]).optional().describe('CC recipient email address(es)'),
    bcc: z.union([z.string(), z.array(z.string())]).optional().describe('BCC recipient email address(es)'),
    threadId: z.string().optional().describe('Thread ID if this is a reply to an existing conversation (automatically fetches Message-ID from last message)'),
    inReplyTo: z.string().optional().describe('Message-ID to reply to (overrides automatic fetch if threadId is provided)')
  }),
  responses: {
    '200': {
      description: 'Success response with sent message details',
      schema: z.object({
        id: z.string().describe('The unique identifier for the sent message'),
        threadId: z.string().describe('The thread ID of the conversation'),
        labelIds: z.array(z.string()).describe('Array of label IDs applied to the sent message')
      })
    }
  },
  handler: async ({ context, params }) => {
    try {
      const toAddresses = formatEmailAddress(params.to);
      const ccAddresses = params.cc ? formatEmailAddress(params.cc) : undefined;
      const bccAddresses = params.bcc ? formatEmailAddress(params.bcc) : undefined;

      // Determine inReplyTo value - either explicitly provided or auto-fetch from thread
      let inReplyTo = params.inReplyTo;
      if (!inReplyTo && params.threadId) {
        inReplyTo = await getThreadLastMessageId(context, params.threadId) || undefined;
      }

      const message = createEmailMessage({
        to: toAddresses,
        subject: params.subject,
        body: params.body,
        cc: ccAddresses,
        bcc: bccAddresses,
        threadId: params.threadId,
        inReplyTo
      });

      const result = await queryGmailApi(context, 'users/me/messages/send', 'POST', message);

      return {
        id: result.id,
        threadId: result.threadId,
        labelIds: result.labelIds || []
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Failed to send Gmail email: ${JSON.stringify(error)}`);
    }
  }
});
