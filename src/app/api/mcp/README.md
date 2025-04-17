# Model Context Protocol (MCP) Implementation

This directory contains the implementation of the Model Context Protocol (MCP) for WayStation.

## Transport Implementations

### Streamable HTTP Transport

The main implementation is in `route.ts`, which provides a Streamable HTTP transport as specified in the MCP 2025-03-26 specification. This transport:

- Uses a single endpoint for both POST and GET requests
- Supports session management with the `Mcp-Session-Id` header
- Supports resumability with event IDs
- Handles both direct responses and SSE streams

### Legacy HTTP+SSE Transport

For backward compatibility, the implementation also includes the older HTTP+SSE transport from the 2024-11-05 specification:

- `sse/route.ts` - Handles GET requests for SSE connections
- `messages/route.ts` - Handles POST requests for sending messages

## Key Features

### Session Management

The Streamable HTTP transport uses the `Mcp-Session-Id` header for session management:

- For initialization requests, a new session ID is generated and returned in the `Mcp-Session-Id` header
- For subsequent requests, the client must include the session ID in the `Mcp-Session-Id` header
- Sessions can be explicitly terminated with a DELETE request

### Resumability

The Streamable HTTP transport supports resumability with event IDs:

- Each SSE event includes an ID
- Clients can include the `Last-Event-ID` header to resume from a specific point
- This helps prevent message loss due to disconnections

### Backward Compatibility

The implementation maintains backward compatibility with the older HTTP+SSE transport:

- The legacy endpoints continue to work as before
- Sessions created with the legacy transport can be accessed through the new transport
- This allows for a smooth transition to the new transport

## Usage

### Initialization

To initialize a connection:

```http
POST /api/mcp
Content-Type: application/json
Accept: application/json, text/event-stream

{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "capabilities": {
      "tools": {}
    }
  }
}
```

The server will respond with a session ID in the `Mcp-Session-Id` header.

### Sending Messages

To send a message:

```http
POST /api/mcp
Content-Type: application/json
Accept: application/json
Mcp-Session-Id: <session-id>

{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "some-method",
  "params": {}
}
```

### Establishing an SSE Connection

To establish an SSE connection:

```http
GET /api/mcp
Accept: text/event-stream
Mcp-Session-Id: <session-id>
```

### Terminating a Session

To terminate a session:

```http
DELETE /api/mcp
Mcp-Session-Id: <session-id>
