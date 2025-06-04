import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { promises as fs } from 'fs';
import path from 'path';
import { ListToolsRequestSchema, CallToolRequestSchema, ListResourcesRequestSchema, ReadResourceRequestSchema, ListPromptsRequestSchema, GetPromptRequestSchema } from '@modelcontextprotocol/sdk/types.js';
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

export async function configureMcpServer(userId: string): Promise<Server> {
  // Read instructions from file
  const instructions = await readInstructionsFile();
  
  // Create MCP server
  const server = new Server(
    { name: "waystation", version: "0.2.0" },
    { capabilities: { tools: {}, resources: {}, prompts: {} },
      instructions,
    }
  );  
  
  // Set up request handlers
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    const tools = [];
    
    for (const {tool} of await registry.getAllTools(userId)) {
      const schema = tool.inputSchema;
      const schemaObj = schema as Record<string, unknown>;
      
      // Ensure we have a valid properties object that satisfies { [x: string]: unknown }
      const properties = schemaObj.properties as Record<string, unknown> || {};
      
      tools.push({
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

    return { tools };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
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
    const resources = await registry.getResources(userId);
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
    
  return server;
}
