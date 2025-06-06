import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';

import { getRemoteProviderMetadata, storeRemoteProviderMetadata, RemoteProviderMetadata} from '@/lib/db';
import { RemoteOAuthClientProvider } from './oauth-client';
import { RemoteProvider } from '@/marketplace/core/types';
import { ListResourcesResult, ListToolsResult, ReadResourceResult } from '@modelcontextprotocol/sdk/types.js';

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

export async function fetchResourcesFromRemoteProvider(provider: RemoteProvider, userId: string): Promise<ListResourcesResult> {
  try {
    console.log(`Fetching resources from remote provider "${provider.id}" at ${provider.serverUrl}`);
    
    const client = new RemoteProviderClient(provider, userId);
              
    // Connect to the MCP server
    await client.connect();
    
    // List tools
    const resourcesList = await client.listResources();
    
    // Close the connection
    await client.close();
    
    console.log(`Successfully fetched ${resourcesList.resources.length} tools from provider "${provider.id}"`);
    
    // Convert to our Tool type
    return resourcesList;
  } catch (error) {
    console.error(`Error fetching tools from provider "${provider.id}":`, error);
    return { resources: []};
  }
}

export async function readResourceContentFromRemoteProvider(provider: RemoteProvider, userId: string, uri: string): Promise<ReadResourceResult|undefined> { 
  try {
    console.log(`Reading resource for remote provider "${provider.id}" at ${provider.serverUrl}`);
    
    const client = new RemoteProviderClient(provider, userId);
              
    // Connect to the MCP server
    await client.connect();
    
    // List tools
    const response: ReadResourceResult = await client.readResource({ uri });

    // Close the connection
    await client.close();
    
    console.log(`Successfully read resource ${uri} from provider "${provider.id}"`);
    
    return response;
  } catch (error) {
    console.error(`Error reading resource from provider "${provider.id}":`, error);
    return undefined;
  }
}

export async function getMetadataForRemoteProvider(provider: RemoteProvider, userId: string): Promise<RemoteProviderMetadata | undefined> {
  // Try to get cached tools
  const cachedMetadata = await getRemoteProviderMetadata(userId, provider.id);
  
  if (cachedMetadata) {
    console.log(`Using cached metadata for provider "${provider}" for user "${userId}"`);
    return cachedMetadata;
  }
  
  // No cached tools, fetch them
  try {
    const tools = await fetchToolsFromRemoteProvider(provider, userId);
    const resources = await fetchResourcesFromRemoteProvider(provider, userId);

    const result = {
      ...tools,
      ...resources
    };

    if (tools.tools.length > 0) {
      // Cache the tools
      await storeRemoteProviderMetadata(userId, provider.id, result);
      console.log(`Cached tools for provider "${provider}" for user "${userId}"`);
    }
    
    return result;
  } catch (error) {
    console.error(`Error getting tools for provider "${provider}":`, error);
    return undefined;
  }
}
