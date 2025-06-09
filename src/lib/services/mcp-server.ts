import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { promises as fs } from 'fs';
import path from 'path';
import { ListToolsRequestSchema, CallToolRequestSchema, ListResourcesRequestSchema, ReadResourceRequestSchema,/* ListPromptsRequestSchema, GetPromptRequestSchema*/ } from '@modelcontextprotocol/sdk/types.js';
import { registry } from '@/marketplace';

// Function to read the markdown file
async function readInstructionsFile() {
  try {
    const filePath = path.join(process.cwd(), 'src/lib/services/mcp-server.MD');
    return await fs.readFile(filePath, 'utf8');
  } catch (error) {
    console.error('Error reading instructions file:', error);
    return ''; // Return empty string if file cannot be read
  }
}

export async function configureMcpServer(userId: string, providerId?: string): Promise<Server> {
  const provider = providerId ? registry.getProvider(providerId) : null;;
  
  // Read instructions from file
  const instructions = await readInstructionsFile();
  
  // Create MCP server
  const server = new Server(
    { name: "waystation", version: "0.2.0" },
    { capabilities: { tools: {}, resources: {} },
      instructions,
    }
  );  
  
  // Set up request handlers
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    let tools = await registry.getAllTools(userId);

    if (provider) 
      tools = tools.filter(tool => tool.provider.id === provider.id);
     
    const result = [];
    
    for (const {tool} of tools) {
      const schema = tool.inputSchema;
      const schemaObj = schema as Record<string, unknown>;
      
      // Ensure we have a valid properties object that satisfies { [x: string]: unknown }
      const properties = schemaObj.properties as Record<string, unknown> || {};
      
      result.push({
        name: tool.id,
        description: tool.description || tool.summary,
        inputSchema: {
          type: "object" as const,
          properties,
          ...(Array.isArray(schemaObj.required) && {
            required: schemaObj.required as string[]
          })
        }
      });

    }

    if (!provider) {
      result.push({
        name: "search",
        description: "Search across all connected apps",
        inputSchema: {
          type: "object" as const,
          properties: {
            query: { type: "string", description: "Search query" },
          },
          required: ["query"]
        }
      });

      result.push({
        name: "fetch",
        description: "Search across all connected apps",
        inputSchema: {
          type: "object" as const,
          properties: {
            id: { type: "string", description: "The id of the document to fetch" },
          },
          required: ["id"]
        }
      });
    }

    return { tools: result };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (request.params.name === "search") {
      // Handle search tool separately
       const query = request.params.arguments?.query as string;

       if(!query) {
         return {
           content: [{type: "text", text: `No query provided`}],
           error: true
         };
       }

      const results = await registry.search(userId, query);

      const response = results.map(result => `${result.provider.id}:${result.id}:${result.url}`);

      return {
        content: [
          {type: "text", text: JSON.stringify(response)},
        ]
      };
    }
    
    if (request.params.name === "fetch") {
      // Handle search tool separately
       const resId = request.params.arguments?.id as string;

       if(!resId) {
         return {
           content: [{type: "text", text: `No ID provided`}],
           error: true
         };
       }

      // Parse ID to extract provider and resource ID
      const [providerId, id, url, tail] = resId.split(':'); 

      const provider = registry.getProvider(providerId);
      if (!provider) {
        return {
          error: true, 
          content: [{type: "text", text: `Provider '${providerId}' not found`}]
        };
      }; 

      const result = await registry.getResourceContent(userId, {
        provider,
        id,
        url: url + ':' + tail,
        name: ''
      });

      const item = result[0];
      
      const content = {
        id: item.id,
        title: item.name,
        text: item.text,
        url: item.url,
      };

      return {
        content: [
          {type: "text", text: JSON.stringify(content)},
        ]
      };
    }

    // Find the tool
    const tool = await registry.getTool(request.params.name, userId);
    if (!tool) {
      return {
        error: true, 
        content: [{type: "text", text: `Tool '${request.params.name}' not found`}]
      };
    }

    // Execute the tool
    try {
      const result = await registry.executeTool(tool, userId, request.params.arguments);
      
      return {
        content: [{type: "text", text: JSON.stringify(result)}]
      };
    } catch (error) {
      return {
        error: true,
        content: [{type: "text", text: error instanceof Error ? error.message : 'Unknown error occurred'}]
      };
    }
  });

  server.setRequestHandler(ListResourcesRequestSchema , async () => {
    let resources = await registry.getResources(userId);

    if (provider)
      resources = resources.filter(resource => resource.provider.id === provider.id);

    return {
      resources: resources.map(resource => {
        return {
          name: `${resource.provider.name}: ${resource.name}`,
          uri: resource.url,
          mimeType: "application/json",
        };
      }),
    }; 
  });

  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const uri = request.params.uri;

    const resources = await registry.getResources(userId);
    const resource = resources.find(res => res.url === uri);

    if (resource) {
      const content = await registry.getResourceContent(userId, resource);
      return {
        contents: content.map(content => ({
          text: content.text,
          mimeType: content.mimeType,
          uri: content.url,
        })),  
      };
    }

    throw new Error("Resource not found");
  });
  
  /*
  server.setRequestHandler(ListPromptsRequestSchema, async () => {
    return {
      prompts: [{
        id: "hello_waystation",
        name: "Hello Waystation",
        description: "A simple prompt to greet Waystation",
        inputSchema: {
          type: "object",
          properties: {}, 
        },
      }]
    };
  });
  */
    
  return server;
}
