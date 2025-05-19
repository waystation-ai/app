import { NextRequest, NextResponse } from 'next/server';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';

import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { authUserId } from '@/lib/utils/auth-userid';
import { registry } from '@/marketplace';
import { NextJsSSETransport } from '@/lib/services/next-sse-transport';

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

export async function SSE(request: NextRequest) {
  console.log('[SSE] Connection attempt started');
  
  try {
    // Authentication
    console.log('[SSE] Starting authentication');
    const userId = await authUserId();
    if (!userId) {
      console.log('[SSE] Authentication failed - no user ID');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log(`[SSE] Authentication successful for user: ${userId.substring(0, 8)}...`);

    // Set up SSE headers
    const headers = new Headers({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    });

    // Create a new ReadableStream with a controller
    const encoder = new TextEncoder();
    console.log('[SSE] Creating ReadableStream');
    const stream = new ReadableStream({
      async start(controller) {
        console.log('[SSE] Stream controller started');
        // Function to send data through the controller
        const sendData = (data: string) => {
          controller.enqueue(encoder.encode(data));
        };
        
        // Send an initial comment and data event to establish the connection
        console.log('[SSE] Sending initial connection messages');
        sendData(": connection initializing\n\n");
        sendData("data: {\"status\":\"connecting\"}\n\n");
        
        // Send a test event to help with debugging
        sendData("event: debug\ndata: {\"message\":\"SSE connection test\"}\n\n");
        console.log('[SSE] Initial messages sent');
        
        try {
          // Create a TransformStream for the transport to write to
          console.log('[SSE] Creating transform stream');
          const transformStream = new TransformStream();
          const writer = transformStream.writable.getWriter();
          
          // Set up a reader to forward messages from the transform stream to the main stream
          console.log('[SSE] Setting up message forwarding');
          const reader = transformStream.readable.getReader();
          const forwardMessages = async () => {
            try {
              console.log('[SSE] Message forwarding started');
              while (true) {
                const { value, done } = await reader.read();
                if (done) {
                  console.log('[SSE] Message forwarding complete - stream closed');
                  break;
                }
                controller.enqueue(value);
              }
            } catch (error) {
              console.error('[SSE] Error forwarding messages:', error);
            }
          };
          forwardMessages();
          
          // Create our custom transport with the endpoint for message posting
          console.log('[SSE] Creating SSE transport');
          const transport = new NextJsSSETransport(writer, '/mcp/messages');
          
          // Store the transport for later use
          NextJsSSETransport.setTransport(transport.sessionId, transport);
          console.log(`[SSE] Transport created and stored with session ID: ${transport.sessionId.substring(0, 8)}...`);

          // Create MCP server
          console.log('[SSE] Creating MCP server');
          const server = new Server(
            { name: "waystation", version: "0.2.0" },
            { capabilities: { tools: {} } }
          );
          
          // Set up error handler
          server.onerror = (error) => {
            console.error('[SSE] MCP Server error:', error);
          };

          configureMcpServer(server, userId);

          // Connect transport to server
          console.log('[SSE] Connecting transport to server');
          await server.connect(transport);
          console.log('[SSE] Transport connected to server');
          
          // Clean up on close
          console.log('[SSE] Setting up abort listener for cleanup');
          request.signal.addEventListener('abort', () => {
            console.log(`[SSE] Connection aborted for session: ${transport.sessionId.substring(0, 8)}...`);
            NextJsSSETransport.deleteTransport(transport.sessionId);
            server.close();
            console.log('[SSE] Resources cleaned up after abort');
          });

          // Send initial connection message
          console.log('[SSE] Sending connection established message');
          await transport.send({
            jsonrpc: "2.0",
            method: "connection/established",
            params: { sessionId: transport.sessionId }
          }).catch((error) => {
            // Continue anyway - this is not critical
            console.warn('[SSE] Failed to send connection established message:', error);
          });
          console.log('[SSE] Connection established message sent (or attempted)');
          
          // Set up a periodic ping to help keep the connection alive
          console.log('[SSE] Setting up ping interval (every 10 seconds)');
          const pingInterval = setInterval(() => {
            if (NextJsSSETransport.hasTransport(transport.sessionId)) {
              const timestamp = new Date().toISOString();
              console.log(`[SSE] Sending ping at ${timestamp} for session: ${transport.sessionId.substring(0, 8)}...`);
              sendData("event: debug\ndata: {\"ping\":\"" + timestamp + "\"}\n\n");
            } else {
              console.log(`[SSE] Transport no longer exists for session: ${transport.sessionId.substring(0, 8)}..., clearing ping interval`);
              clearInterval(pingInterval);
            }
          }, 10000); // Send a ping every 10 seconds
          
          // Clean up ping interval on abort
          request.signal.addEventListener('abort', () => {
            console.log('[SSE] Abort signal received, cleaning up ping interval');
            clearInterval(pingInterval);
            controller.close();
            console.log('[SSE] Stream controller closed');
          });

        } catch (error) {
          // Send error to client
          console.error('[SSE] Error in stream processing:', error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          console.log(`[SSE] Sending error to client: ${errorMessage}`);
          sendData(`event: error\ndata: ${JSON.stringify({
            error: errorMessage
          })}\n\n`);
          
          // Close the controller
          console.log('[SSE] Closing stream controller due to error');
          controller.close();
        }
      }
    });
    
    console.log('[SSE] Returning stream response');
    return new Response(stream, { headers });
  } catch (error) {
    console.error('[SSE] Fatal error in SSE handler:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.log(`[SSE] Returning error response: ${errorMessage}`);
    return NextResponse.json({ 
      error: 'Internal server error', 
      message: errorMessage 
    }, { status: 500 });
  }
}
