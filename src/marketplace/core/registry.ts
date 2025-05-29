import { JSONSchema7 } from 'json-schema';
import { z } from 'zod';

import { isFullProvider, isNativeProvider, isRemoteProvider, NativeProvider, Provider, ProviderResource, ProviderResourceContent, ProviderTool, RemoteProvider, Resource, ResourceContent, Tool, ToolContext } from './types';
import PostHogClient from '@/lib/utils/posthog-client'; // Using the existing PostHog client
import { oauthService } from '@/lib/services/oauth-service'; // Assuming oauthService is accessible or passed
import { getRemoteProviderMetadata, getValidConnections } from '@/lib/db';
import { callToolFromRemoteProvider, readResourceContentFromRemoteProvider } from '@/lib/services/mcp-remote';
import { generateText } from 'ai';
import { azure } from '@ai-sdk/azure';

export class ProviderRegistry {
  private providers: Map<string, Provider> = new Map();

  registerProvider(provider: Provider): Provider {
    this.providers.set(provider.id, provider);
    return provider;
  }

  getProvider(id: string): Provider | undefined {
    return this.providers.get(id);
  }

  getAllProviders(): Provider[] {
    return Array.from(this.providers.values());
  }

  getVetoedProviders(): Provider[] {
    // All providers except atlassian, linear-official, and asana-official
    return this.getAllProviders().filter(provider => !['atlassian', 'linear-official', 'asana-official'].includes(provider.id));
  }

  private async getRemoteProviderTools(provider: RemoteProvider, userId: string): Promise<Tool[]> {
    const cache = await getRemoteProviderMetadata(userId, provider.id);

    if (!cache)
      return [];

    return cache.tools.map(tool => ({
      id: tool.name,
      summary: tool.description || '',
      description: tool.description,
      path: `/tools/${provider.id}/{tool.name}`,
      method: 'POST',
      inputSchema: tool.inputSchema as JSONSchema7,
      responses: {
        '200': {
          description: 'Successfully created task',
          schema: z.any(), // Assuming you have a ZodType for the response
        }
      },
      handler: async ({ params }) => {
        return await callToolFromRemoteProvider(provider, userId, tool.name, params);
      }
    }));
  }

  private async getRemoteProviderResources(provider: RemoteProvider, userId: string): Promise<Resource[]> {
    const cache = await getRemoteProviderMetadata(userId, provider.id);

    if (!cache || !cache.resources)
      return [];

    return cache.resources.map(resource => ({
      id: resource.uri,
      name: resource.name,
      url: resource.uri
    }));
  }

  private async getRemoteProviderResourceContent(provider: RemoteProvider, userId: string, resource: Resource): Promise<ResourceContent> {
    try {
      const result = await readResourceContentFromRemoteProvider(provider, userId, resource.url);
      
      if (!result) {
        throw new Error(`No content found for resource ${resource.id}`);
      }

      return result.contents[0] as ResourceContent; // Assuming contents is an array and we take the first one
      
    } catch (error) {
      console.error(`Error reading resource content from provider "${provider.id}":`, error);
      throw new Error(`Failed to read resource content: ${error}`);
    }
  }

  async getProviderTools(provider: Provider, userId?: string): Promise<Tool[]> {
    if (isNativeProvider(provider))
      return provider.tools;

    if (isRemoteProvider(provider) && userId)
      return this.getRemoteProviderTools(provider, userId);

    return [];
  }

  async getAllTools(userId?: string): Promise<ProviderTool[]> {
    let providers = this.getAllProviders();

    if (userId) {
      const connections = await getValidConnections(userId);
      const providerIds = Array.from(connections.values()).map(conn => conn.provider);
      providers = providers.filter(provider => providerIds.includes(provider.id));
    }

    const providerToolsArrays = await Promise.all(
      providers.map(async provider => {
        const tools = await this.getProviderTools(provider, userId);
        return tools.map(tool => ({ provider, tool }));
      })
    );
    return providerToolsArrays.flat();
  }

  async getTool(toolId: string, userId?: string): Promise<ProviderTool | undefined> {
    const tools = await this.getAllTools(userId);

    return tools.find(t => t.tool.id === toolId);
  }

  async executeTool(providerTool: ProviderTool, userId: string, params: unknown): Promise<unknown> {
    const { provider, tool } = providerTool;

    if (!isFullProvider(provider)) {
      throw new Error(`Provider '${provider.id}' is not supported yet`);
    }

    const posthog = PostHogClient(); // Get the PostHog client instance

    try {

      // Log the event before calling the handler
      posthog.capture({
        distinctId: userId,
        event: 'toolCall',
        properties: {
          tool: tool.id,
          provider: provider.id,
        },
      });

      // Create the context for the tool handler
      const context: ToolContext = {
        getAccessToken: () => {
          return oauthService.getValidAccessToken(provider, userId);
        }
      };

      // Call the original handler
      const result = await tool.handler({ context, params });

      return result;
    } catch (error) {
      console.error(`Error executing tool ${tool.id}:`, error);
      // Optionally log error details
      // posthog.capture({ ... event: 'tool_called_error', tool_name: toolId, error_message: error.message, ... });
      throw error; // Re-throw the error
    } finally {
      if (posthog) { // Only shutdown if the client was successfully initialized
        await posthog.shutdown(); // Shutdown the client after capturing
      }
    }
  }

  async getProviderResources(provider: Provider, userId: string): Promise<Resource[]> {
    if (isNativeProvider(provider)) {
      if (!provider.getResources)
        return [];

      return await provider.getResources({ getAccessToken: () => oauthService.getValidAccessToken(provider, userId) });
    }
    
    if (isRemoteProvider(provider)) 
      return await this.getRemoteProviderResources(provider, userId);
    
    return [];
  }
    
  async getResources(userId: string): Promise<ProviderResource[]> {
   let providers = this.getAllProviders();

    const connections = await getValidConnections(userId);
    const providerIds = Array.from(connections.values()).map(conn => conn.provider);
    providers = providers.filter(provider => providerIds.includes(provider.id));

    const providerResourceArrays = await Promise.all(
      providers.map(async provider => {
        const resources = await this.getProviderResources(provider, userId);
        return resources.map(resource => ({
          ...resource,
          provider
        }));
    }));

    return providerResourceArrays.flat();  
  }

  async getResourceContent(userId: string, resource: ProviderResource): Promise<ProviderResourceContent[]> {
    if (isNativeProvider(resource.provider)) {
      const provider = resource.provider as NativeProvider;

      const content = await provider.getResourceContent?.({ getAccessToken: () => oauthService.getValidAccessToken(provider, userId) }, resource);

      if (!content) {
        throw new Error(`No content found for resource ${resource.id}`);
      };

      const result: ProviderResourceContent[] = [];
      
      if (content.mimeType === 'application/json') {
        const { text } = await generateText({
          model: azure.responses("gpt-4.1-nano"),
          prompt: `Please convert JSON output below into the readable markdown. Respond only with the converted markdown. Making it human-digestible avoiding ids etc.\n\n${content.text}`,
        });

        result.push({
          ...resource,
          text,
          mimeType: 'text/markdown',
        });
      }

      result.push({
        ...resource,
        ...content,
      });

      return result;
    }

    if (isRemoteProvider(resource.provider)) {
      const provider = resource.provider as RemoteProvider;
      
      const content = await this.getRemoteProviderResourceContent(provider, userId, resource);

      return [{
        ...resource,
        ...content,
      }];
    } 

    return [];
  }
}

export const registry = new ProviderRegistry();

export function registerProvider(provider: Provider): Provider {
  return registry.registerProvider(provider);
}
