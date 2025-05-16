import { NextRequest, NextResponse } from 'next/server';
import { JSONRPCMessageSchema } from '@modelcontextprotocol/sdk/types.js';
import { NextJsSSETransport } from '@/lib/services/next-sse-transport';

// Maximum message size (from official SDK)
const MAXIMUM_MESSAGE_SIZE = 4 * 1024 * 1024; // 4MB

export async function POST(request: NextRequest) {
  try {
    // We don't need to authenticate the request here, as the session ID is already validated in the transport

    // Get session ID from request
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('sessionId') || request.headers.get('x-session-id');
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session ID' }, { status: 400 });
    }
    
    if (!NextJsSSETransport.hasTransport(sessionId)) { 
      return NextResponse.json({ 
        error: 'Invalid session', 
        message: 'No active transport found for this session ID. The connection may have been closed or timed out.' 
      }, { status: 400 });
    }

    // Get transport
    const transport = NextJsSSETransport.getTransport(sessionId)!;
    
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

    // Parse and validate message
    const message = await request.json();
    try {
      JSONRPCMessageSchema.parse(message);
    } catch (error) {
      return NextResponse.json({ 
        error: `Invalid message format: ${error instanceof Error ? error.message : String(error)}` 
      }, { status: 400 });
    }
    
    // Handle message
    await transport.handleMessage(message);
    return NextResponse.json({ success: true }, { status: 202 });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Internal server error', 
      message: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 });
  }
}
