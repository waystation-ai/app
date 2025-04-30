import { NextRequest, NextResponse } from 'next/server';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';

import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { authenticateRequest } from '@/lib/utils/authenticate-request';
import { registry } from '@/marketplace';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { NextJsSSETransport } from '@/lib/services/mcp';

// Debug flag - set to false in production
const DEBUG = false;

export async function SSE(request: NextRequest, nanoId?: string) {
  try {
    
    // Authentication
    const userId = await authenticateRequest(request, nanoId);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Set up SSE headers
    const headers = new Headers({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    });

    // Create a new ReadableStream with a controller
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        // Function to send data through the controller
        const sendData = (data: string) => {
          controller.enqueue(encoder.encode(data));
        };
        
        // Send an initial comment and data event to establish the connection
        sendData(": connection initializing\n\n");
        sendData("data: {\"status\":\"connecting\"}\n\n");
        
        // Send a test event to help with debugging
        if (DEBUG) {
          sendData("event: debug\ndata: {\"message\":\"SSE connection test\"}\n\n");
        }
        
        try {
          // Create a TransformStream for the transport to write to
          const transformStream = new TransformStream();
          const writer = transformStream.writable.getWriter();
          
          // Set up a reader to forward messages from the transform stream to the main stream
          const reader = transformStream.readable.getReader();
          const forwardMessages = async () => {
            try {
              while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                controller.enqueue(value);
              }
            } catch (error) {
              console.error('[SSE] Error forwarding messages:', error);
            }
          };
          forwardMessages();
          
          // Create our custom transport with the endpoint for message posting
          const transport = new NextJsSSETransport(writer, '/mcp/messages');
          
          // Store the transport for later use
          NextJsSSETransport.setTransport(transport.sessionId, transport);

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
          
          // Connect transport to server
          await server.connect(transport);
          
          // Clean up on close
          request.signal.addEventListener('abort', () => {
            NextJsSSETransport.deleteTransport(transport.sessionId);
            server.close();
          });

          // Send initial connection message
          await transport.send({
            jsonrpc: "2.0",
            method: "connection/established",
            params: { sessionId: transport.sessionId }
          }).catch(() => {
            // Continue anyway - this is not critical
          });
          
          // Set up a periodic ping to help keep the connection alive
          if (DEBUG) {
            const pingInterval = setInterval(() => {
              if (NextJsSSETransport.hasTransport(transport.sessionId)) {
                sendData("event: debug\ndata: {\"ping\":\"" + new Date().toISOString() + "\"}\n\n");
              } else {
                clearInterval(pingInterval);
              }
            }, 10000); // Send a ping every 10 seconds
            
            // Clean up ping interval on abort
            request.signal.addEventListener('abort', () => {
              clearInterval(pingInterval);
              controller.close();
            });
          }
        } catch (error) {
          // Send error to client
          sendData(`event: error\ndata: ${JSON.stringify({
            error: error instanceof Error ? error.message : 'Unknown error occurred'
          })}\n\n`);
          
          // Close the controller
          controller.close();
        }
      }
    });
    
    return new Response(stream, { headers });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Internal server error', 
      message: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 });
  }
}


