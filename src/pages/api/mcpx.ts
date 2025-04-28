import { NextApiRequest, NextApiResponse } from 'next';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { registry } from '@/marketplace';
import { zodToJsonSchema } from 'zod-to-json-schema';

import { oauthService } from '@/lib/services/oauth-service';
import { getAuth } from '@clerk/nextjs/server';

// Add this at the top of the file
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = getAuth(req);
  let userId = session.userId;

  if (!userId) {
    console.log('Session userId is missing');
    const accessToken = req.headers.authorization;

    if (!accessToken)
      return res.status(401).json({ error: 'Unauthorized' });

    const response = await fetch(`https://clerk.${process.env.APP_DOMAIN}/oauth/userinfo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': accessToken
      }
    });
    console.log(response);

    if (!response.ok) 
      return res.status(401).json({ error: 'Unauthorized' });
      
    const data = await response.json();
    console.log(data);
    userId = data.user_id;
  }

  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });
    
  // Create MCP server
  const server = new Server(
    { name: "waystation", version: "0.2.0" },
    { capabilities: { tools: {} } }
  );
  
  // Set up error handler
  server.onerror = (error) => {
    console.error('[SSE] MCP Server error:', error);
  };

  // Set up request handlers
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    const tools = [];
    
    for (const tool of registry.getAllTools()) {
      const schema = zodToJsonSchema(tool.parameters);
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
    const tool = registry.getTool(request.params.name);
    if (!tool) {
      return {
        error: true, 
        content: [{type: "text", text: `Tool '${request.params.name}' not found`}]
      };
    }

    // Execute the tool
    try {
      const result = await tool.tool.handler({
        context: { 
          getAccessToken: () => { 
            return oauthService.getValidAccessToken(tool.provider.id, userId);
          }
        },
        params: request.params.arguments
      });
      
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
  
  // Connect transport to server
  await server.connect(transport);

  return transport.handleRequest(req, res);
}