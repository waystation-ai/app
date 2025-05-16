import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';

import { storeRemoteProviderTools, getRemoteProviderTools} from '@/lib/db';
import { RemoteOAuthClientProvider } from './oauth-service';
import { RemoteProvider } from '@/marketplace/core/types';
import { ListToolsResult } from '@modelcontextprotocol/sdk/types.js';

class RemoteProviderClient extends Client {
  private provider: RemoteProvider;
  private userId: string;
  
  constructor(provider: RemoteProvider, userId: string) {
    super({
      name: 'WayStation',
      version: '1.0.0'
    });

    this.provider = provider;
    this.userId = userId;  
  }

  public async connect(){
    await super.connect(new SSEClientTransport(new URL(this.provider.serverUrl), {
        authProvider: new RemoteOAuthClientProvider(this.provider, this.userId),
    }));
  }
}

export async function fetchToolsFromRemoteProvider(provider: RemoteProvider, userId: string): Promise<ListToolsResult> {
  try {
    console.log(`Fetching tools from remote provider "${provider.id}" at ${provider.serverUrl}`);
    
    const client = new RemoteProviderClient(provider, userId);
              
    // Connect to the MCP server
    await client.connect();
    
    // List tools
    const toolsList = await client.listTools();
    
    // Close the connection
    await client.close();
    
    console.log(`Successfully fetched ${toolsList.tools.length} tools from provider "${provider.id}"`);
    
    // Convert to our Tool type
    return toolsList;
  } catch (error) {
    console.error(`Error fetching tools from provider "${provider.id}":`, error);
    return { tools: []};
  }
}

export async function callToolFromRemoteProvider(provider: RemoteProvider, userId: string, toolName: string, params: any): Promise<unknown> { //eslint-disable-line @typescript-eslint/no-explicit-any
  try {
    console.log(`Calling tool for remote provider "${provider.id}" at ${provider.serverUrl}`);
    
    const client = new RemoteProviderClient(provider, userId);
              
    // Connect to the MCP server
    await client.connect();
    
    // List tools
    const response = await client.callTool({
      name: toolName,
      arguments: params
    });

    // Close the connection
    await client.close();
    
    console.log(`Successfully called ${toolName} from provider "${provider.id}"`);

    const result = (response.content as any)[0]?.text;  // eslint-disable-line @typescript-eslint/no-explicit-any
    
    if (response.error) {
      console.error(`Error calling tool "${toolName}" from provider "${provider.id}":`, result.content);
      throw new Error(`Error calling tool "${toolName}": ${result}`);
    }
    
    return JSON.parse(result);
  } catch (error) {
    console.error(`Error fetching tools from provider "${provider.id}":`, error);
    return [];
  }
}

export async function getToolsForRemoteProvider(provider: RemoteProvider, userId: string): Promise<ListToolsResult | undefined> {
  // Try to get cached tools
  const cachedTools = await getRemoteProviderTools(userId, provider.id);
  
  if (cachedTools) {
    console.log(`Using cached tools for provider "${provider}" for user "${userId}"`);
    return cachedTools;
  }
  
  // No cached tools, fetch them
  try {
    const result = await fetchToolsFromRemoteProvider(provider, userId);
    
    if (result.tools.length > 0) {
      // Cache the tools
      await storeRemoteProviderTools(userId, provider.id, result);
      console.log(`Cached tools for provider "${provider}" for user "${userId}"`);
    }
    
    return result;
  } catch (error) {
    console.error(`Error getting tools for provider "${provider}":`, error);
    return undefined;
  }
}
