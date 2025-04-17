import { NextRequest, NextResponse } from 'next/server';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { Transport } from '@modelcontextprotocol/sdk/shared/transport.js';
import { JSONRPCMessage, JSONRPCMessageSchema, ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { authenticateRequest } from '@/lib/utils/authenticate-request';
import { registry } from '@/marketplace';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { oauthService } from '@/lib/services/oauth-service';

// Debug flag - set to false in production
const DEBUG = false;

// Maximum message size (from official SDK)
const MAXIMUM_MESSAGE_SIZE = 4 * 1024 * 1024; // 4MB

// Store active transports with their session IDs
const activeTransports = new Map<string, NextJsStreamableTransport>();

// Next.js-compatible Streamable HTTP transport implementation
class NextJsStreamableTransport implements Transport {
  private writer: WritableStreamDefaultWriter<Uint8Array> | null = null;
  private encoder: TextEncoder;
  private _messageQueue: JSONRPCMessage[] = [];
  private _sessionId: string;
  private connected: boolean = false;
  private eventId: number = 0;
  
  // Transport interface properties
  onmessage?: (message: JSONRPCMessage) => void;
  onclose?: () => void;
  onerror?: (error: Error) => void;

  constructor(sessionId?: string) {
    this.encoder = new TextEncoder();
    this._sessionId = sessionId || crypto.randomUUID();
  }

  async start(): Promise<void> {
    if (this.connected) {
      throw new Error(
        "NextJsStreamableTransport already started! If using Server class, note that connect() calls start() automatically."
      );
    }

    this.connected = true;
  }

  async send(message: JSONRPCMessage): Promise<void> {
    if (!this.connected) {
      throw new Error("Not connected");
    }

    try {
      if (this.writer) {
        // If we have a writer, send as SSE
        const messageStr = JSON.stringify(message);
        const eventId = ++this.eventId;
        
        await this.writer.write(
          this.encoder.encode(`id: ${eventId}\nevent: message\ndata: ${messageStr}\n\n`)
        );
      } else {
        // Otherwise queue the message for later delivery
        this.messageQueue.push(message);
      }
    } catch (error) {
      if (this.onerror) {
        this.onerror(error instanceof Error ? error : new Error(String(error)));
      }
    }
  }

  async close(): Promise<void> {
    try {
      if (this.writer) {
        await this.writer.close();
        this.writer = null;
      }
      
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
        this._messageQueue.push(parsedMessage);
      }
    } catch (error) {
      if (this.onerror) {
        this.onerror(error as Error);
      }
      throw error;
    }
  }
  
  // Get the message queue
  get messageQueue(): JSONRPCMessage[] {
    return this._messageQueue;
  }
  
  // Clear the message queue and return the messages
  getAndClearMessageQueue(): JSONRPCMessage[] {
    const messages = [...this._messageQueue];
    this._messageQueue = [];
    return messages;
  }

  // Attach a writer for SSE streaming
  attachWriter(writer: WritableStreamDefaultWriter<Uint8Array>): void {
    this.writer = writer;
    
    // Process any queued messages
    if (this._messageQueue.length > 0) {
      const messages = [...this._messageQueue];
      this._messageQueue = [];
      
      for (const message of messages) {
        this.send(message).catch((error) => {
          if (this.onerror) {
            this.onerror(error instanceof Error ? error : new Error(String(error)));
          }
        });
      }
    }
  }

  // Get the session ID
  get sessionId(): string {
    return this._sessionId;
  }
  
  // Check if this transport has a writer attached
  hasWriter(): boolean {
    return this.writer !== null;
  }
}

// Helper function to create and initialize an MCP server
async function createMcpServer(transport: Transport, userId: string): Promise<Server> {
  const server = new Server(
    { name: "waystation", version: "0.2.0" },
    { capabilities: { tools: {} } }
  );
  
  // Set up error handler
  server.onerror = (error) => {
    console.error('[MCP] Server error:', error);
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
  
  return server;
}

// Helper function to create an SSE stream
function createSseStream(transport: NextJsStreamableTransport): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  
  return new ReadableStream({
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
        
        // Attach the writer to the transport
        transport.attachWriter(writer);
        
        // Set up a periodic ping to help keep the connection alive
        if (DEBUG) {
          const pingInterval = setInterval(() => {
            if (activeTransports.has(transport.sessionId)) {
              sendData("event: debug\ndata: {\"ping\":\"" + new Date().toISOString() + "\"}\n\n");
            } else {
              clearInterval(pingInterval);
            }
          }, 10000); // Send a ping every 10 seconds
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
}

// POST handler for sending messages to the server
export async function POST(request: NextRequest) {
  try {
    // Authentication
    const userId = await authenticateRequest(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate content type
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json({ 
        error: `Unsupported content-type: ${contentType}` 
      }, { status: 400 });
    }

    // Check message size
    const contentLength = parseInt(request.headers.get('content-length') || '0', 10);
    if (contentLength > MAXIMUM_MESSAGE_SIZE) {
      return NextResponse.json({ 
        error: `Message too large: ${contentLength} bytes (max: ${MAXIMUM_MESSAGE_SIZE} bytes)` 
      }, { status: 413 });
    }

    // Check if client accepts SSE
    const acceptHeader = request.headers.get('accept');
    const acceptsSse = acceptHeader && acceptHeader.includes('text/event-stream');
    const acceptsJson = acceptHeader && acceptHeader.includes('application/json');
    
    if (!acceptsSse && !acceptsJson) {
      return NextResponse.json({ 
        error: 'Client must accept either application/json or text/event-stream' 
      }, { status: 406 });
    }

    // Get session ID from header
    const sessionId = request.headers.get('mcp-session-id');
    
    // Parse and validate message
    const message = await request.json();
    try {
      JSONRPCMessageSchema.parse(message);
    } catch (error) {
      return NextResponse.json({ 
        error: `Invalid message format: ${error instanceof Error ? error.message : String(error)}` 
      }, { status: 400 });
    }
    
    // Check if this is an initialization request
    const isInitRequest = 
      typeof message === 'object' && 
      message !== null && 
      'method' in message && 
      message.method === 'initialize';
    
    // Handle based on session state
    if (isInitRequest) {
      // For initialization requests, create a new transport and server
      const transport = new NextJsStreamableTransport();
      const server = await createMcpServer(transport, userId);
      
      // Store the transport
      activeTransports.set(transport.sessionId, transport);
      
      // Handle the message
      await transport.handleMessage(message);
      
      // Clean up on request abort
      request.signal.addEventListener('abort', () => {
        activeTransports.delete(transport.sessionId);
        server.close();
      });
      
      // If client accepts SSE and the message is a request, return an SSE stream
      if (acceptsSse && 'id' in message) {
        const stream = createSseStream(transport);
        
        const headers = new Headers({
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive',
          'Mcp-Session-Id': transport.sessionId
        });
        
        return new Response(stream, { headers });
      } else {
        // Otherwise, return a JSON response
        // For initialization, we need to wait for the response to be queued
        // This is a bit of a hack, but it works for initialization
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (transport.messageQueue.length > 0) {
          // Get the first message and clear the queue
          const messages = transport.getAndClearMessageQueue();
          const response = messages[0];
          
          return NextResponse.json(response, { 
            status: 200,
            headers: { 'Mcp-Session-Id': transport.sessionId }
          });
        } else {
          return NextResponse.json({ 
            error: 'Failed to get initialization response' 
          }, { status: 500 });
        }
      }
    } else if (!sessionId) {
      // Non-initialization requests must include a session ID
      return NextResponse.json({ 
        error: 'Missing session ID. Use Mcp-Session-Id header for all non-initialization requests.' 
      }, { status: 400 });
    } else if (!activeTransports.has(sessionId)) {
      return NextResponse.json({ 
        error: 'Invalid session', 
        message: 'No active transport found for this session ID. The connection may have been closed or timed out.' 
      }, { status: 404 });
    } else {
      // Get the transport for this session
      const transport = activeTransports.get(sessionId)!;
      
      // Handle the message
      await transport.handleMessage(message);
      
      // If this is a notification or response, return 202 Accepted
      if (!('id' in message) || ('result' in message || 'error' in message)) {
        return NextResponse.json({ success: true }, { status: 202 });
      }
      
      // If this is a request and the client accepts SSE, return an SSE stream
      if ('id' in message && acceptsSse) {
        // If the transport already has a writer, we can't attach another one
        if (transport.hasWriter()) {
          return NextResponse.json({ 
            error: 'This session already has an active SSE connection' 
          }, { status: 409 });
        }
        
        const stream = createSseStream(transport);
        
        const headers = new Headers({
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive'
        });
        
        return new Response(stream, { headers });
      } else {
        // Otherwise, return a JSON response
        // For non-initialization requests, we need to wait for the response to be queued
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (transport.messageQueue.length > 0) {
          // Get the first message and clear the queue
          const messages = transport.getAndClearMessageQueue();
          const response = messages[0];
          
          return NextResponse.json(response, { status: 200 });
        } else {
          return NextResponse.json({ success: true }, { status: 202 });
        }
      }
    }
  } catch (error) {
    return NextResponse.json({ 
      error: 'Internal server error', 
      message: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 });
  }
}

// GET handler for establishing SSE connections
export async function GET(request: NextRequest) {
  try {
    // Authentication
    const userId = await authenticateRequest(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if client accepts SSE
    const acceptHeader = request.headers.get('accept');
    if (!acceptHeader || !acceptHeader.includes('text/event-stream')) {
      return NextResponse.json({ 
        error: 'Client must accept text/event-stream for GET requests' 
      }, { status: 406 });
    }

    // Get session ID from header
    const sessionId = request.headers.get('mcp-session-id');
    if (!sessionId) {
      return NextResponse.json({ 
        error: 'Missing session ID. Use Mcp-Session-Id header.' 
      }, { status: 400 });
    }
    
    // Check if session exists
    if (!activeTransports.has(sessionId)) {
      return NextResponse.json({ 
        error: 'Invalid session', 
        message: 'No active transport found for this session ID. The connection may have been closed or timed out.' 
      }, { status: 404 });
    }
    
    // Get transport
    const transport = activeTransports.get(sessionId)!;
    
    // If the transport already has a writer, we can't attach another one
    if (transport.hasWriter()) {
      return NextResponse.json({ 
        error: 'This session already has an active SSE connection' 
      }, { status: 409 });
    }
    
    // Get Last-Event-ID for resumability
    // Note: Last-Event-ID handling would be implemented here in a full solution
    // const lastEventId = request.headers.get('last-event-id');
    
    // Create SSE stream
    const stream = createSseStream(transport);
    
    // Set up SSE headers
    const headers = new Headers({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive'
    });
    
    // Clean up on request abort
    request.signal.addEventListener('abort', () => {
      // Note: We don't delete the transport here, just detach the writer
      if (transport.hasWriter()) {
        transport.close().catch(console.error);
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

// DELETE handler for terminating sessions
export async function DELETE(request: NextRequest) {
  try {
    // Authentication
    const userId = await authenticateRequest(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get session ID from header
    const sessionId = request.headers.get('mcp-session-id');
    if (!sessionId) {
      return NextResponse.json({ 
        error: 'Missing session ID. Use Mcp-Session-Id header.' 
      }, { status: 400 });
    }
    
    // Check if session exists
    if (!activeTransports.has(sessionId)) {
      return NextResponse.json({ 
        error: 'Invalid session', 
        message: 'No active transport found for this session ID. The connection may have been closed or timed out.' 
      }, { status: 404 });
    }
    
    // Get transport and close it
    const transport = activeTransports.get(sessionId)!;
    await transport.close();
    
    // Remove from active transports
    activeTransports.delete(sessionId);
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Internal server error', 
      message: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 });
  }
}

// Export activeTransports and NextJsStreamableTransport for use in other routes
export { activeTransports, NextJsStreamableTransport };
