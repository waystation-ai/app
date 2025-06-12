import { z } from 'zod';
import { ToolContext } from '../core/types';

// Base Airtable API types
export const AirtableBaseSchema = z.object({
  id: z.string(),
  name: z.string(),
  permissionLevel: z.string()
});

export const AirtableTableSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  primaryFieldId: z.string()
});

export const AirtableFieldSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  description: z.string().optional()
});

export const AirtableRecordSchema = z.object({
  id: z.string(),
  createdTime: z.string(),
  fields: z.record(z.unknown())
});

// API client configuration
const AIRTABLE_API_BASE = 'https://api.airtable.com/v0';

export async function callAirtableApi(context: ToolContext, path: string, options: { method?: string; body?: unknown; }) {
  const { method = 'GET', body} = options;

  const accessToken = await context.getAccessToken();

  console.log(`Calling Airtable API: ${method} ${AIRTABLE_API_BASE}${path}`, body);
    
  const response = await fetch(`${AIRTABLE_API_BASE}${path}`, {
    method,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(`Airtable API error: ${error.error || response.statusText}\n${method} ${AIRTABLE_API_BASE}${path}\n${JSON.stringify(body || {})}`);
  }

  return response.json();
}

// Error handling utilities
export class AirtableError extends Error {
  constructor(message: string, public statusCode: number, public code: string) {
    super(message);
    this.name = 'AirtableError';
  }
}

export function handleAirtableError(error: unknown): never {
  if (error instanceof AirtableError) {
    throw error;
  }
  
  if (error instanceof Error) {
    throw new AirtableError(error.message, 500, 'INTERNAL_ERROR');
  }
  
  throw new AirtableError('Unknown error', 500, 'INTERNAL_ERROR');
}
