import { ToolContext } from '../core/types';

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

  const email = headers.join('\r\n') + params.body;
  
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
