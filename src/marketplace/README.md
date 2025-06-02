# WayStation Tools Architecture

This directory contains the tools implementation for WayStation, which allows LLMs to interact with various services like Monday.com, Slack, Google Drive, etc.

## Architecture Overview

The tools architecture follows a provider-based approach:

```
src/app/tools/
├── [provider]/            # Dynamic route handler
│   └── [tool]/
│       └── route.ts
├── call/                  # MCP tool call endpoint
│   └── route.ts
└── list/                  # MCP tool listing endpoint
    └── route.ts

src/marketplace/
├── index.ts               # Main entry point
├── core/                  # Core infrastructure
│   ├── types.ts           # Type definitions
│   ├── registry.ts        # Provider and tool registry
│   └── openapi.ts         # OpenAPI generation
├── remote-mcps/           # Remote MCP provider definitions
│   ├── index.ts           # Imports all remote providers
│   └── {provider}.ts      # Individual remote provider configurations
├── shared/                # Shared utilities across providers
│   └── {utility}.ts
└── {provider}/            # Provider-specific implementations
    ├── index.ts           # Provider registration
    ├── utils.ts           # Shared utilities for the provider
    └── {tool-name}.ts     # Individual tool implementations
```

## Key Concepts

- **Provider**: A service like Monday, Slack, Google Drive, etc.
- **Tool**: A specific operation like listMondayBoards, postSlackMessage, etc.
- **Registry**: Central registry for all providers and tools
- **Dynamic Routes**: Routes that handle requests to tool endpoints
- **Native Provider**: A provider implemented directly within WayStation using OAuth for authentication
- **Remote Provider**: A provider hosted on a remote server and accessed via a serverUrl
- **Resource**: A data source that can be accessed (e.g., documents, boards, files)

## Adding a New Tool

1. Create a new file for your tool in the appropriate provider directory:

```typescript
// src/marketplace/example-provider/my-new-tool.ts
import { z } from 'zod';
import { defineTool } from '../core/types';

export const myNewTool = defineTool({
  id: 'myNewTool',
  summary: 'Description of what the tool does',
  description: 'Longer description with more details',
  method: 'GET', // or POST, PUT, DELETE
  path: '/tools/example-provider/my_new_tool',
  parameters: z.object({
    // Define parameters with Zod
    param1: z.string().describe('Description of param1'),
    param2: z.number().optional().describe('Optional parameter')
  }),
  responses: {
    '200': {
      description: 'Success response description',
      schema: z.object({
        // Define response schema with Zod
        result: z.string().describe('Description of result')
      })
    }
  },
  handler: async ({ context, params }) => {
    // Implement the tool logic
    // context.getAccessToken() returns access token for a provider
    
    // Return data matching the response schema
    return {
      result: `Processed ${params.param1}`
    };
  }
});
```

2. Register the tool in the provider's index.ts file:

```typescript
// src/marketplace/example-provider/index.ts
import { registerProvider } from '../core/registry';
import { myNewTool } from './my-new-tool';
import { otherTool } from './other-tool';

export const exampleProvider = registerProvider({
  id: 'example-provider',
  name: 'Example Provider',
  description: 'Description of the provider',
  clientId: process.env.EXAMPLE_CLIENT_ID || '',
  clientSecret: process.env.EXAMPLE_CLIENT_SECRET || '',
  authorizationUrl: 'https://example.com/oauth/authorize',
  tokenUrl: 'https://example.com/oauth/token',
  scopes: ['read', 'write'],
  tools: [
    myNewTool,
    otherTool
  ]
});
```

3. Import the provider in index.ts:

```typescript
// src/marketplace/index.ts
import './monday';
import './example-provider'; // Add your new provider
// import other providers
```

## Adding a Remote Provider

Remote providers allow you to connect to external MCP servers that provide their own tools and resources.

1. Create a new file for your remote provider in the remote-mcps directory:

```typescript
// src/marketplace/remote-mcps/example-remote.ts
import { registerProvider } from '../core/registry';

export const exampleRemoteProvider = registerProvider({
  id: 'example-remote',
  name: 'Example Remote Provider',
  description: 'Description of the remote provider',
  
  // The URL of the remote MCP server
  serverUrl: 'https://example.com/mcp',
    
  // Marketing information
  bullets: [
    "Feature 1 of the remote provider",
    "Feature 2 of the remote provider",
    "Feature 3 of the remote provider"
  ],
  chat: [
    { role: 'user', content: "Example user message" },
    { role: 'agent', content: "Example agent response" }
  ]
});
```

2. Import the remote provider in the remote-mcps/index.ts file:

```typescript
// src/marketplace/remote-mcps/index.ts
import './asana';
import './example-remote'; // Add your new remote provider
// import other remote providers
```

## Benefits of This Architecture

1. **Unified Definition**: Each tool has its metadata and implementation in one place
2. **Type Safety**: Zod schemas provide runtime validation and TypeScript types
3. **Auto-generated OpenAPI**: No need to manually maintain JSON files
4. **Dynamic Discovery**: Tools are registered in a central registry
5. **Simplified Routing**: Dynamic route handlers reduce code duplication
6. **Better Developer Experience**: Easier to add new tools and operations
7. **Extensibility**: Support for both native and remote providers allows for a wide range of integrations
8. **Resource Access**: Ability to access data sources from both native and remote providers
