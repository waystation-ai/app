import { z } from 'zod';

export interface ToolContext {
  userId: string;
}

export interface ToolResult {
  error: boolean;
  content: unknown;
}

export interface ToolHandler<T = unknown, R = unknown> {
  (params: { context: ToolContext; params: T }): Promise<R>;
}

export interface Tool<T = unknown, R = unknown> {
  id: string;
  summary: string;
  description?: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  parameters: z.ZodType<T>;
  responses: Record<string, {
    description: string;
    schema: z.ZodType<R>;
  }>;
  handler: ToolHandler<T, R>;
}

export interface Provider {
  name: string;
  description: string;
  tools: Tool<any, any>[]; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export function defineTool<T, R>(tool: Tool<T, R>): Tool<T, R> {
  return tool;
}
