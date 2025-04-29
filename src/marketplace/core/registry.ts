import { Provider, ProviderTool, Tool, ToolContext } from './types';
import PostHogClient from '@/lib/utils/posthog-client'; // Using the existing PostHog client
import { oauthService } from '@/lib/services/oauth-service'; // Assuming oauthService is accessible or passed

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
  
  getTool(toolId: string): ProviderTool | undefined {
    for (const provider of this.providers.values()) {
      const tool = provider.tools.find(t => t.id === toolId);
      if (tool) return {provider, tool};
    }
    return undefined;
  }
  
  getAllTools(): Tool[] {
    return this.getAllProviders().flatMap(provider => provider.tools);
  }

  async executeTool(toolIdOrProviderTool: string | ProviderTool, userId: string, params: any): Promise<any> { //eslint-disable-line @typescript-eslint/no-explicit-any
    let providerTool: ProviderTool | undefined;
    if (typeof toolIdOrProviderTool === 'string') {
      providerTool = this.getTool(toolIdOrProviderTool);
      if (!providerTool) {
        throw new Error(`Tool '${toolIdOrProviderTool}' not found`);
      }
    } else {
      providerTool = toolIdOrProviderTool;
    }
    
    const { provider, tool } = providerTool;

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
          return oauthService.getValidAccessToken(provider.id, userId);
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
}

export const registry = new ProviderRegistry();

export function registerProvider(provider: Provider): Provider {
  return registry.registerProvider(provider);
}
