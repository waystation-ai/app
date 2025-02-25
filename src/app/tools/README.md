# WayStation Tools Architecture

This directory contains the tools implementation for WayStation, which allows LLMs to interact with various services like Monday.com, Slack, Google Drive, etc.

## Architecture Overview

The tools architecture follows a provider-based approach:

```
src/app/tools/
├── core/                  # Core infrastructure
│   ├── types.ts           # Type definitions
│   ├── registry.ts        # Provider and tool registry
│   └── openapi.ts         # OpenAPI generation
├── [provider]/            # Dynamic route handler
│   └── [tool]/
│       └── route.ts
├── call/                  # MCP tool call endpoint
│   └── route.ts
├── list/                  # MCP tool listing endpoint
│   └── route.ts
├── main.ts                # Main entry point
└── {provider}/            # Provider-specific implementations
    ├── index.ts           # Provider registration
    ├── utils.ts           # Shared utilities
    └── {tool-name}.ts     # Individual tool implementations
```

## Key Concepts

- **Provider**: A service like Monday, Slack, Google Drive, etc.
- **Tool**: A specific operation like listMondayBoards, postSlackMessage, etc.
- **Registry**: Central registry for all providers and tools
- **Dynamic Routes**: Routes that handle requests to tool endpoints

## Adding a New Tool

1. Create a new file for your tool in the appropriate provider directory:

```typescript
// src/app/tools/example-provider/my-new-tool.ts
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
    // context.userId contains the authenticated user ID
    
    // Return data matching the response schema
    return {
      result: `Processed ${params.param1}`
    };
  }
});
```

2. Register the tool in the provider's index.ts file:

```typescript
// src/app/tools/example-provider/index.ts
import { registerProvider } from '../core/registry';
import { myNewTool } from './my-new-tool';
import { otherTool } from './other-tool';

export const exampleProvider = registerProvider({
  name: 'example-provider',
  description: 'Description of the provider',
  tools: [
    myNewTool,
    otherTool
  ]
});

// Re-export tools
export {
  myNewTool,
  otherTool
};
```

3. Import the provider in main.ts:

```typescript
// src/app/tools/main.ts
import './monday';
import './example-provider'; // Add your new provider
// import other providers
```

## Benefits of This Architecture

1. **Unified Definition**: Each tool has its metadata and implementation in one place
2. **Type Safety**: Zod schemas provide runtime validation and TypeScript types
3. **Auto-generated OpenAPI**: No need to manually maintain JSON files
4. **Dynamic Discovery**: Tools are registered in a central registry
5. **Simplified Routing**: Dynamic route handlers reduce code duplication
6. **Better Developer Experience**: Easier to add new tools and operations
