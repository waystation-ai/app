import { Server } from '@modelcontextprotocol/sdk/server/index.js';

import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { registry } from '@/marketplace';

export async function configureMcpServer(server: Server, userId: string) {
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
    
}

