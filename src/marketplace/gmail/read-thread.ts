import { z } from 'zod';
import { defineTool } from '../core/types';
import { queryGmailApi } from './utils';

// Helper function to decode base64url content
function decodeBase64Url(data: string): string {
  try {
    const base64 = data.replace(/-/g, '+').replace(/_/g, '/');
    return Buffer.from(base64, 'base64').toString('utf-8');
  } catch {
    return data; // Return original if decoding fails
  }
}

// Helper function to format date from internal timestamp
function formatDate(internalDate: string): string {
  try {
    const date = new Date(parseInt(internalDate));
    return date.toISOString();
  } catch {
    return internalDate;
  }
}

// Helper function to extract essential headers
function parseHeaders(headers: Array<{ name: string; value: string }>) {
  const essentialHeaders: Record<string, string> = {};
  
  for (const header of headers) {
    const name = header.name.toLowerCase();
    switch (name) {
      case 'from':
      case 'to':
      case 'cc':
      case 'bcc':
      case 'subject':
      case 'date':
        essentialHeaders[name] = header.value;
        break;
    }
  }
  
  return essentialHeaders;
}

// Type definitions for Gmail API structures
interface GmailHeader {
  name: string;
  value: string;
}

interface GmailMessageBody {
  size?: number;
  data?: string;
  attachmentId?: string;
}

interface GmailMessagePart {
  partId?: string;
  mimeType?: string;
  filename?: string;
  headers?: GmailHeader[];
  body?: GmailMessageBody;
  parts?: GmailMessagePart[];
}

// Payload is essentially a MessagePart at the root level
type GmailPayload = GmailMessagePart;

// Helper function to extract content from message parts
function extractMessageContent(payload: GmailPayload): {
  textContent?: string;
  htmlContent?: string;
  attachments: Array<{
    filename: string;
    mimeType: string;
    size: number;
    attachmentId?: string;
  }>;
} {
  const result = {
    textContent: undefined as string | undefined,
    htmlContent: undefined as string | undefined,
    attachments: [] as Array<{
      filename: string;
      mimeType: string;
      size: number;
      attachmentId?: string;
    }>
  };

  function processPart(part: GmailMessagePart) {
    const mimeType = part.mimeType || '';
    const filename = part.filename || '';
    
    // Handle attachments (parts with filenames or specific content dispositions)
    if (filename || (part.headers && part.headers.some((h: GmailHeader) => 
      h.name.toLowerCase() === 'content-disposition' && h.value.includes('attachment')))) {
      result.attachments.push({
        filename: filename || 'unnamed_attachment',
        mimeType,
        size: part.body?.size || 0,
        attachmentId: part.body?.attachmentId
      });
      return;
    }

    // Handle text content
    if (mimeType === 'text/plain' && part.body?.data) {
      const decoded = decodeBase64Url(part.body.data);
      if (!result.textContent || decoded.length > result.textContent.length) {
        result.textContent = decoded;
      }
    }
    
    // Handle HTML content
    if (mimeType === 'text/html' && part.body?.data) {
      const decoded = decodeBase64Url(part.body.data);
      if (!result.htmlContent || decoded.length > result.htmlContent.length) {
        result.htmlContent = decoded;
      }
    }

    // Recursively process multipart messages
    if (mimeType.startsWith('multipart/') && part.parts) {
      for (const subPart of part.parts) {
        processPart(subPart);
      }
    }
  }

  // Start processing from the root payload
  processPart(payload);

  return result;
}

export const readGmailThread = defineTool({
  id: 'readGmailThread',
  summary: 'Read a specific email thread',
  description: 'Retrieves a complete email thread/conversation with readable message content, stripped of unnecessary metadata.',
  method: 'GET',
  path: '/tools/gmail/read_thread',
  parameters: z.object({
    threadId: z.string().describe('The unique identifier of the thread to read'),
    includeAttachments: z.boolean().default(true).describe('Whether to include attachment information in the response')
  }),
  responses: {
    '200': {
      description: 'Success response with clean, readable thread data',
      schema: z.object({
        id: z.string().describe('The unique identifier for the thread'),
        messages: z.array(z.object({
          id: z.string().describe('The unique identifier for the message'),
          date: z.string().describe('Human-readable date when the message was sent/received'),
          from: z.string().optional().describe('Sender email address'),
          to: z.string().optional().describe('Recipient email address(es)'),
          cc: z.string().optional().describe('CC email address(es)'),
          bcc: z.string().optional().describe('BCC email address(es)'),
          subject: z.string().optional().describe('Email subject line'),
          textContent: z.string().optional().describe('Plain text content of the message'),
          htmlContent: z.string().optional().describe('HTML content of the message'),
          snippet: z.string().describe('Short preview of the message content'),
          attachments: z.array(z.object({
            filename: z.string().describe('Name of the attached file'),
            mimeType: z.string().describe('MIME type of the attachment'),
            size: z.number().describe('Size of the attachment in bytes'),
            attachmentId: z.string().optional().describe('ID to retrieve the attachment content')
          })).optional().describe('List of attachments in the message')
        }))
      })
    }
  },
  handler: async ({ context, params }) => {
    try {
      const endpoint = `users/me/threads/${params.threadId}?format=full`;
      const result = await queryGmailApi(context, endpoint);

      // Process messages to extract readable content
      const processedMessages = result.messages.map((message: {
        id: string;
        threadId: string;
        labelIds?: string[];
        snippet?: string;
        historyId: string;
        internalDate: string;
        payload?: GmailPayload;
      }) => {
        const headers = parseHeaders(message.payload?.headers || []);
        const content = extractMessageContent(message.payload || {});
        
        const processedMessage: Record<string, unknown> = {
          id: message.id,
          date: formatDate(message.internalDate),
          snippet: message.snippet || '',
          ...headers // Spread essential headers (from, to, subject, etc.)
        };

        // Add content if available
        if (content.textContent) {
          processedMessage.textContent = content.textContent;
        }
        
        if (content.htmlContent) {
          processedMessage.htmlContent = content.htmlContent;
        }

        // Add attachments if requested and available
        if (params.includeAttachments && content.attachments.length > 0) {
          processedMessage.attachments = content.attachments;
        }

        // If no content was extracted, try to use the snippet or indicate empty message
        if (!content.textContent && !content.htmlContent) {
          processedMessage.textContent = message.snippet || '[No readable content available]';
        }

        return processedMessage;
      });

      return {
        id: result.id,
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
