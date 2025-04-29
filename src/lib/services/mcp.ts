import { Transport } from '@modelcontextprotocol/sdk/shared/transport.js';
import { JSONRPCMessage, JSONRPCMessageSchema } from '@modelcontextprotocol/sdk/types.js';

// Next.js-compatible SSE transport implementation

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

  public static getTransport(sessionId: string): NextJsSSETransport | undefined {
    return this._activeTransports.get(sessionId);
  }
  public static setTransport(sessionId: string, transport: NextJsSSETransport): void {
    this._activeTransports.set(sessionId, transport);
  }
  public static deleteTransport(sessionId: string): void {
    this._activeTransports.delete(sessionId);
  }
  public static clearTransports(): void { 
    this._activeTransports.clear();
  }

  public static hasTransport(sessionId: string): boolean {  
    return this._activeTransports.has(sessionId);
  }
}
