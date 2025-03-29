import { NextRequest, NextResponse } from 'next/server';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { Transport } from '@modelcontextprotocol/sdk/shared/transport.js';
import { JSONRPCMessage, JSONRPCMessageSchema, ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { authenticateRequest } from '@/lib/utils/authenticate-request';
import { registry } from '@/marketplace/main';
import { zodToJsonSchema } from 'zod-to-json-schema';

import { oauthService } from '@/lib/services/oauth-service';

// Debug flag - set to false in production
const DEBUG = false;

// Next.js-compatible SSE transport implementation
class NextJsSSETransport implements Transport {
  private writer: WritableStreamDefaultWriter<Uint8Array>;
  private encoder: TextEncoder;
  private messageQueue: JSONRPCMessage[] = [];
  private _sessionId: string;
  private _endpoint: string;
  private connected: boolean = false;
  // Transport interface properties
  onmessage?: (message: JSONRPCMessage) => void;
  onclose?: () => void;
  onerror?: (error: Error) => void;

  constructor(writer: WritableStreamDefaultWriter<Uint8Array>, endpoint: string) {
    this.writer = writer;
    this.encoder = new TextEncoder();
    this._sessionId = crypto.randomUUID();
    this._endpoint = endpoint;
  }

  async start(): Promise<void> {
    if (this.connected) {
      throw new Error(
        "NextJsSSETransport already started! If using Server class, note that connect() calls start() automatically."
      );
    }

    try {
      // Send the endpoint event (following the official SDK format)
      await this.writer.write(
        this.encoder.encode(`event: endpoint\ndata: ${encodeURI(this._endpoint)}?sessionId=${this._sessionId}\n\n`)
      );
      
      this.connected = true;
    } catch (error) {
      if (this.onerror) {
        this.onerror(error instanceof Error ? error : new Error(String(error)));
      }
      throw error;
    }
  }

  async send(message: JSONRPCMessage): Promise<void> {
    if (!this.connected) {
      throw new Error("Not connected");
    }

    try {
      // Use the named event format from the official SDK
      const messageStr = JSON.stringify(message);
      
      await this.writer.write(
        this.encoder.encode(`event: message\ndata: ${messageStr}\n\n`)
      );
    } catch (error) {
      if (this.onerror) {
        this.onerror(error instanceof Error ? error : new Error(String(error)));
      }
    }
  }

  async close(): Promise<void> {
    try {
      await this.writer.close();
      this.connected = false;
      
      if (this.onclose) {
        this.onclose();
      }
    } catch (error) {
      if (this.onerror) {
        this.onerror(error instanceof Error ? error : new Error(String(error)));
      }
    }
  }

  // Handle incoming messages with validation
  async handleMessage(message: unknown): Promise<void> {
    try {
      const parsedMessage = JSONRPCMessageSchema.parse(message);
      
      if (this.onmessage) {
        this.onmessage(parsedMessage);
      } else {
        // Queue the message if no handler is registered yet
        this.messageQueue.push(parsedMessage);
      }
    } catch (error) {
      if (this.onerror) {
        this.onerror(error as Error);
      }
      throw error;
    }
  }

  // Get the session ID
  get sessionId(): string {
    return this._sessionId;
  }
}

// Store active transports with their session IDs
const activeTransports = new Map<string, NextJsSSETransport>();

export async function GET(request: NextRequest) {
  try {
    // Authentication
    const userId = await authenticateRequest(request);
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
          const transport = new NextJsSSETransport(writer, '/api/mcp/messages');
          
          // Store the transport for later use
          activeTransports.set(transport.sessionId, transport);

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
          
          // Clean up on close
          request.signal.addEventListener('abort', () => {
            activeTransports.delete(transport.sessionId);
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
              if (activeTransports.has(transport.sessionId)) {
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

// Export activeTransports and NextJsSSETransport for use in the messages route
export { activeTransports, NextJsSSETransport };
