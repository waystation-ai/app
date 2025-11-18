import { ToolContext } from '../core/types';

// Type definitions for Gmail API structures
export interface GmailHeader {
  name: string;
  value: string;
}

export interface GmailMessageBody {
  size?: number;
  data?: string;
  attachmentId?: string;
}

export interface GmailMessagePart {
  partId?: string;
  mimeType?: string;
  filename?: string;
  headers?: GmailHeader[];
  body?: GmailMessageBody;
  parts?: GmailMessagePart[];
}

export type GmailPayload = GmailMessagePart;

export async function queryGmailApi(
  context: ToolContext,
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: Record<string, unknown>
) {
  try {
    const accessToken = await context.getAccessToken();

    const response = await fetch(`https://gmail.googleapis.com/gmail/v1/${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      ...(body && { body: JSON.stringify(body) })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Gmail API error: ${response.status} ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Unknown error: ${JSON.stringify(error)}`);
  }
}

export function formatEmailAddress(email: string | string[]): string {
  if (Array.isArray(email)) {
    return email.join(', ');
  }
  return email;
}

export function createEmailMessage(params: {
  to: string;
  subject: string;
  body: string;
  cc?: string;
  bcc?: string;
  threadId?: string;
  inReplyTo?: string;
  references?: string;
}) {
  const headers = [
    `To: ${params.to}`,
    `Subject: ${params.subject}`
  ];

  if (params.cc) {
    headers.push(`Cc: ${params.cc}`);
  }

  if (params.bcc) {
    headers.push(`Bcc: ${params.bcc}`);
  }

  if (params.inReplyTo) {
    headers.push(`In-Reply-To: ${params.inReplyTo}`);
  }

  if (params.references) {
    headers.push(`References: ${params.references}`);
  }

  headers.push('Content-Type: text/html; charset=utf-8');
  headers.push('');

  const email = headers.join('\r\n') + '\r\n' + params.body;
  
  // Base64url encode the email
  const encodedEmail = Buffer.from(email)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const message: Record<string, unknown> = {
    raw: encodedEmail
  };

  if (params.threadId) {
    message.threadId = params.threadId;
  }

  return message;
}

// Helper function to extract threading-related headers from Gmail message payload
export function extractMessageHeaders(payload: GmailPayload | undefined): Record<string, string> {
  const headers: Record<string, string> = {};
  const headerList = payload?.headers || [];

  for (const header of headerList) {
    const name = header.name.toLowerCase();
    if (name === 'message-id' || name === 'in-reply-to' || name === 'references') {
      headers[name] = header.value;
    }
  }

  return headers;
}

// Helper function to get the last message's Message-ID from a thread
export async function getThreadLastMessageId(context: ToolContext, threadId: string): Promise<string | null> {
  try {
    const endpoint = `users/me/threads/${threadId}?format=full`;
    const threadData = await queryGmailApi(context, endpoint);

    if (threadData.messages && threadData.messages.length > 0) {
      const lastMessage = threadData.messages[threadData.messages.length - 1];
      const headers = extractMessageHeaders(lastMessage.payload);
      return headers['message-id'] || null;
    }

    return null;
  } catch {
    return null; // If we fail to fetch thread, continue without In-Reply-To
  }
}

// Helper function to decode base64url encoded data
export function decodeBase64Url(data: string): string {
  try {
    const base64 = data.replace(/-/g, '+').replace(/_/g, '/');
    return Buffer.from(base64, 'base64').toString('utf-8');
  } catch {
    return data; // Return original if decoding fails
  }
}

// Helper function to extract essential headers from a list of Gmail headers
export function parseHeaders(headers: GmailHeader[]): Record<string, string> {
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
      case 'message-id':
      case 'in-reply-to':
      case 'references':
        essentialHeaders[name] = header.value;
        break;
    }
  }

  return essentialHeaders;
}

// Helper function to format Gmail's internal timestamp to ISO string
export function formatDate(internalDate: string): string {
  try {
    const date = new Date(parseInt(internalDate));
    return date.toISOString();
  } catch {
    return internalDate;
  }
}
