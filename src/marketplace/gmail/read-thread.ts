import { z } from 'zod';
import { defineTool } from '../core/types';
import { queryGmailApi } from './utils';

export const readGmailThread = defineTool({
  id: 'readGmailThread',
  summary: 'Read a specific email thread',
  description: 'Retrieves a complete email thread/conversation with all messages and their content.',
  method: 'GET',
  path: '/tools/gmail/read_thread',
  parameters: z.object({
    threadId: z.string().describe('The unique identifier of the thread to read'),
    format: z.enum(['full', 'metadata', 'minimal']).default('full').describe('The format of the message data to return')
  }),
  responses: {
    '200': {
      description: 'Success response with complete thread data',
      schema: z.object({
        id: z.string().describe('The unique identifier for the thread'),
        historyId: z.string().describe('The history ID of the thread'),
        messages: z.array(z.object({
          id: z.string().describe('The unique identifier for the message'),
          threadId: z.string().describe('The thread ID this message belongs to'),
          labelIds: z.array(z.string()).describe('Array of label IDs applied to this message'),
          snippet: z.string().describe('A short snippet of the message content'),
          historyId: z.string().describe('The history ID of the message'),
          internalDate: z.string().describe('The internal date of the message'),
          payload: z.object({
            partId: z.string().optional().describe('The part ID of the message part'),
            mimeType: z.string().describe('The MIME type of the message part'),
            filename: z.string().optional().describe('The filename of the attachment, if any'),
            headers: z.array(z.object({
              name: z.string().describe('The header name'),
              value: z.string().describe('The header value')
            })).describe('Array of message headers'),
            body: z.object({
              size: z.number().describe('The size of the message body in bytes'),
              data: z.string().optional().describe('The body data (base64url encoded)')
            }).optional().describe('The message body'),
            parts: z.array(z.any()).optional().describe('Array of message parts for multipart messages')
          }).describe('The message payload containing headers and body')
        }))
      })
    }
  },
  handler: async ({ context, params }) => {
    try {
      const endpoint = `users/me/threads/${params.threadId}?format=full`;
      const result = await queryGmailApi(context, endpoint);

      // Process messages to decode body content when available
      const processedMessages = result.messages.map((message: {
        id: string;
        threadId: string;
        labelIds?: string[];
        snippet?: string;
        historyId: string;
        internalDate: string;
        payload?: {
          partId?: string;
          mimeType?: string;
          filename?: string;
          headers?: Array<{ name: string; value: string }>;
          body?: { size?: number; data?: string };
          parts?: unknown[];
        };
      }) => {
        const processedMessage = {
          id: message.id,
          threadId: message.threadId,
          labelIds: message.labelIds || [],
          snippet: message.snippet || '',
          historyId: message.historyId,
          internalDate: message.internalDate,
          payload: {
            partId: message.payload?.partId,
            mimeType: message.payload?.mimeType || '',
            filename: message.payload?.filename,
            headers: message.payload?.headers || [],
            body: message.payload?.body ? {
              size: message.payload.body.size || 0,
              data: message.payload.body.data
            } : undefined,
            parts: message.payload?.parts
          }
        };

        // If body data exists and format is full, try to decode it
        if (params.format === 'full' && message.payload?.body?.data) {
          try {
            const decodedData = Buffer.from(
              message.payload.body.data.replace(/-/g, '+').replace(/_/g, '/'),
              'base64'
            ).toString('utf-8');
            processedMessage.payload.body!.data = decodedData;
          } catch {
            // Keep original encoded data if decoding fails
          }
        }

        return processedMessage;
      });

      return {
        id: result.id,
        historyId: result.historyId,
        messages: processedMessages
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Failed to read Gmail thread: ${JSON.stringify(error)}`);
    }
  }
});
