import { NextRequest, NextResponse } from 'next/server';
import { JSONRPCMessageSchema } from '@modelcontextprotocol/sdk/types.js';
import { NextJsSSETransport } from '@/lib/services/next-sse-transport';

// Maximum message size (from official SDK)
const MAXIMUM_MESSAGE_SIZE = 4 * 1024 * 1024; // 4MB

export async function POST(request: NextRequest) {
  console.log('[Messages] Received POST request');
  try {
    // We don't need to authenticate the request here, as the session ID is already validated in the transport

    // Get session ID from request
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('sessionId') || request.headers.get('x-session-id');
    
    if (!sessionId) {
      console.log('[Messages] Request missing session ID');
      return NextResponse.json({ error: 'Missing session ID' }, { status: 400 });
    }
    
    console.log(`[Messages] Processing message for session: ${sessionId.substring(0, 8)}...`);
    
    if (!NextJsSSETransport.hasTransport(sessionId)) { 
      console.log(`[Messages] No active transport found for session: ${sessionId.substring(0, 8)}...`);
      return NextResponse.json({ 
        error: 'Invalid session', 
        message: 'No active transport found for this session ID. The connection may have been closed or timed out.' 
      }, { status: 400 });
    }

    // Get transport
    const transport = NextJsSSETransport.getTransport(sessionId)!;
    console.log(`[Messages] Retrieved transport for session: ${sessionId.substring(0, 8)}...`);
    
    // Validate content type
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.log(`[Messages] Invalid content type: ${contentType}`);
      return NextResponse.json({ 
        error: `Unsupported content-type: ${contentType}` 
      }, { status: 400 });
    }

    // Check message size
    const contentLength = parseInt(request.headers.get('content-length') || '0', 10);
    console.log(`[Messages] Message size: ${contentLength} bytes`);
    if (contentLength > MAXIMUM_MESSAGE_SIZE) {
      console.log(`[Messages] Message too large: ${contentLength} bytes (max: ${MAXIMUM_MESSAGE_SIZE} bytes)`);
      return NextResponse.json({ 
        error: `Message too large: ${contentLength} bytes (max: ${MAXIMUM_MESSAGE_SIZE} bytes)` 
      }, { status: 413 });
    }

    // Parse and validate message
    console.log(`[Messages] Parsing message`);
    const message = await request.json();
    try {
      JSONRPCMessageSchema.parse(message);
      console.log(`[Messages] Message validated successfully`);
    } catch (error) {
      console.log(`[Messages] Invalid message format:`, error);
      return NextResponse.json({ 
        error: `Invalid message format: ${error instanceof Error ? error.message : String(error)}` 
      }, { status: 400 });
    }
    
    // Handle message
    console.log(`[Messages] Forwarding message to transport handler`);
    await transport.handleMessage(message);
    console.log(`[Messages] Message handled successfully`);
    return NextResponse.json({ success: true }, { status: 202 });
  } catch (error) {
    console.error(`[Messages] Error processing message:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ 
      error: 'Internal server error', 
      message: errorMessage 
    }, { status: 500 });
  }
}
