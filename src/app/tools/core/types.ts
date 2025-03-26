import { z } from 'zod';

export interface ToolContext {
  getAccessToken: () => Promise<string>;
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
    contentTypes?: string[];
  }>;
  handler: ToolHandler<T, R>;
}

export interface Provider {
  id: string;
  name: string;
  description: string;
  tools: Tool<any, any>[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  
  // OAuth fields (optional for providers without OAuth)
  clientId?: string;
  clientSecret?: string;
  authorizationUrl?: string;
  tokenUrl?: string;
  scopes?: string[];
  group?: string;
  
  // Marketing fields
  bullets?: string[];
  chat?: Array<{
    role: 'user' | 'agent';
    content: string;
  }>;
}

export interface ProviderTool {
  provider: Provider;
  tool: Tool;
}



export function defineTool<T, R>(tool: Tool<T, R>): Tool<T, R> {
  return tool;
}
