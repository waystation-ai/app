import { JSONSchema7 } from 'json-schema';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

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
  inputSchema?: JSONSchema7; 
  responses: Record<string, {
    description: string;
    schema: z.ZodType<R>;
    contentTypes?: string[];
  }>;
  handler: ToolHandler<T, R>;
}

export interface NativeTool<T, R> extends Tool<T, R> {
  parameters: z.ZodType<T>;
}

export interface BaseProvider {
  id: string;
  name: string;
  description: string;
  
  // Marketing fields
  bullets?: string[];
  chat?: Array<{
    role: 'user' | 'agent';
    content: string;
  }>;
}

export interface NativeProvider extends BaseProvider {
  tools: Tool<any, any>[]; // eslint-disable-line @typescript-eslint/no-explicit-any

  // OAuth fields (optional for OAuth-free providers)
  clientId?: string;
  clientSecret?: string;
  authorizationUrl?: string;
  tokenUrl?: string;
  scopes?: string[];
  group?: string;

  requiresOAuth?: boolean;

  getResources?: (context: ToolContext) => Promise<Resource[]>;
  getResourceContent?: (context: ToolContext, resource: Resource) => Promise<ResourceContent>;

  search?: (context: ToolContext, query: string) => Promise<Resource[]>;
}

export interface RemoteProvider extends BaseProvider {
  serverUrl: string; // URL for the remote MCP server

  getResources?: (context: ToolContext) => Promise<Resource[]>;
  getResourceContent?: (context: ToolContext, resource: Resource) => Promise<ResourceContent>;
}

export type Provider = BaseProvider | NativeProvider | RemoteProvider;

export type FullProvider = NativeProvider | RemoteProvider;

export function isNativeProvider(provider: Provider): provider is NativeProvider { 
  return 'authorizationUrl' in provider || 
         ('tools' in provider && 'requiresOAuth' in provider && provider.requiresOAuth === false);
}

export function isRemoteProvider(provider: Provider): provider is RemoteProvider { return 'serverUrl' in provider; }

export function isFullProvider(provider: Provider): provider is FullProvider {
  return isNativeProvider(provider) || isRemoteProvider(provider);
}

export function requiresOAuth(provider: Provider): boolean {
  if (isNativeProvider(provider)) {
    return provider.requiresOAuth !== false;
  }
  return false;
}

export function isOAuthFreeProvider(provider: Provider): boolean {
  return isNativeProvider(provider) && !requiresOAuth(provider);
}

export interface ProviderTool {
  provider: Provider;
  tool: Tool;
}

export function defineTool<T, R>(tool: NativeTool<T, R>): Tool<T, R> {
  return {
    ...tool,
    inputSchema: zodToJsonSchema(tool.parameters) as JSONSchema7,
  };
}

export type Resource = {
  id: string;
  name: string;
  url: string;
};

export type ProviderResource = Resource & {
  provider: Provider;
};

export type ResourceContent = { 
  text: string;
  mimeType?: string; 
}

export type ProviderResourceContent = ProviderResource & ResourceContent;
