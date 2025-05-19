import { JSONRPCMessage, JSONRPCMessageSchema } from '@modelcontextprotocol/sdk/types.js';
import { Transport } from '@modelcontextprotocol/sdk/shared/transport.js';

// Next.js-compatible SSE transport implementation
// Enhanced with detailed logging for troubleshooting connection issues

export class NextJsSSETransport implements Transport {
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

  private static _activeTransports = new Map<string, NextJsSSETransport>();

  constructor(writer: WritableStreamDefaultWriter<Uint8Array>, endpoint: string) {
    this.writer = writer;
    this.encoder = new TextEncoder();
    this._sessionId = crypto.randomUUID();
    this._endpoint = endpoint;
    console.log(`[Transport] Created new transport with session ID: ${this._sessionId.substring(0, 8)}... for endpoint: ${endpoint}`);
  }

  async start(): Promise<void> {
    console.log(`[Transport] Starting transport: ${this._sessionId.substring(0, 8)}...`);
    if (this.connected) {
      console.warn(`[Transport] Transport already started: ${this._sessionId.substring(0, 8)}...`);
      throw new Error(
        "NextJsSSETransport already started! If using Server class, note that connect() calls start() automatically."
      );
    }

    try {
      // Send the endpoint event (following the official SDK format)
      const endpointUrl = `${encodeURI(this._endpoint)}?sessionId=${this._sessionId}`;
      console.log(`[Transport] Sending endpoint event with URL: ${endpointUrl}`);
      await this.writer.write(
        this.encoder.encode(`event: endpoint\ndata: ${endpointUrl}\n\n`)
      );
      
      this.connected = true;
      console.log(`[Transport] Transport started successfully: ${this._sessionId.substring(0, 8)}...`);
    } catch (error) {
      console.error(`[Transport] Error starting transport: ${this._sessionId.substring(0, 8)}...`, error);
      if (this.onerror) {
        this.onerror(error instanceof Error ? error : new Error(String(error)));
      }
      throw error;
    }
  }

  async send(message: JSONRPCMessage): Promise<void> {
    if (!this.connected) {
      console.error(`[Transport] Attempted to send message on disconnected transport: ${this._sessionId.substring(0, 8)}...`);
      throw new Error("Not connected");
    }

    try {
      // Use the named event format from the official SDK
      const messageStr = JSON.stringify(message);
      // Log different message types appropriately
      const messageType = 'method' in message ? `request: ${message.method}` : 
                         ('result' in message ? 'response' : 'notification');
      console.log(`[Transport] Sending message on transport ${this._sessionId.substring(0, 8)}...: ${messageType}`);
      
      await this.writer.write(
        this.encoder.encode(`event: message\ndata: ${messageStr}\n\n`)
      );
      console.log(`[Transport] Message sent successfully on transport: ${this._sessionId.substring(0, 8)}...`);
    } catch (error) {
      console.error(`[Transport] Error sending message on transport: ${this._sessionId.substring(0, 8)}...`, error);
      if (this.onerror) {
        this.onerror(error instanceof Error ? error : new Error(String(error)));
      }
    }
  }

  async close(): Promise<void> {
    console.log(`[Transport] Closing transport: ${this._sessionId.substring(0, 8)}...`);
    try {
      await this.writer.close();
      this.connected = false;
      console.log(`[Transport] Transport closed successfully: ${this._sessionId.substring(0, 8)}...`);
      
      if (this.onclose) {
        this.onclose();
      }
    } catch (error) {
      console.error(`[Transport] Error closing transport: ${this._sessionId.substring(0, 8)}...`, error);
      if (this.onerror) {
        this.onerror(error instanceof Error ? error : new Error(String(error)));
      }
    }
  }

  // Handle incoming messages with validation
  async handleMessage(message: unknown): Promise<void> {
    console.log(`[Transport] Received message on transport: ${this._sessionId.substring(0, 8)}...`);
    try {
      const parsedMessage = JSONRPCMessageSchema.parse(message);
      // Determine message type for logging
      let messageType = 'unknown';
      if ('method' in parsedMessage) {
        messageType = `request: ${parsedMessage.method}`;
      } else if ('result' in parsedMessage) {
        messageType = 'response';
      } else if ('error' in parsedMessage) {
        messageType = 'error response';
      } else {
        messageType = 'notification';
      }
      
      console.log(`[Transport] Message validated for transport ${this._sessionId.substring(0, 8)}...: ${messageType}`);
      
      if (this.onmessage) {
        console.log(`[Transport] Dispatching message to handler for transport: ${this._sessionId.substring(0, 8)}...`);
        this.onmessage(parsedMessage);
      } else {
        // Queue the message if no handler is registered yet
        console.log(`[Transport] No message handler registered, queueing message for transport: ${this._sessionId.substring(0, 8)}...`);
        this.messageQueue.push(parsedMessage);
      }
    } catch (error) {
      console.error(`[Transport] Error handling message for transport: ${this._sessionId.substring(0, 8)}...`, error);
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

  public static getTransport(sessionId: string): NextJsSSETransport | undefined {
    return this._activeTransports.get(sessionId);
  }
  public static setTransport(sessionId: string, transport: NextJsSSETransport): void {
    console.log(`[Transport-Static] Registering transport with session ID: ${sessionId.substring(0, 8)}...`);
    this._activeTransports.set(sessionId, transport);
    console.log(`[Transport-Static] Active transports count: ${this._activeTransports.size}`);
  }
  
  public static deleteTransport(sessionId: string): void {
    console.log(`[Transport-Static] Removing transport with session ID: ${sessionId.substring(0, 8)}...`);
    this._activeTransports.delete(sessionId);
    console.log(`[Transport-Static] Active transports count: ${this._activeTransports.size}`);
  }
  
  public static clearTransports(): void { 
    console.log(`[Transport-Static] Clearing all transports. Count before clear: ${this._activeTransports.size}`);
    this._activeTransports.clear();
    console.log(`[Transport-Static] All transports cleared`);
  }

  public static hasTransport(sessionId: string): boolean {  
    const exists = this._activeTransports.has(sessionId);
    if (!exists) {
      console.log(`[Transport-Static] Transport not found for session ID: ${sessionId.substring(0, 8)}...`);
    }
    return exists;
  }
}
