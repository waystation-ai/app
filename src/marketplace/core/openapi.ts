import { zodToJsonSchema } from 'zod-to-json-schema';
import { ProviderRegistry } from './registry';
import { Tool } from './types';

export function generateOpenApiSpec(registry: ProviderRegistry) {
  const paths: Record<string, Record<string, unknown>> = {};
  
  for (const provider of registry.getAllProviders()) {
    for (const tool of provider.tools) {
      // Add path to OpenAPI spec
      if (!paths[tool.path]) {
        paths[tool.path] = {};
      }
      paths[tool.path][tool.method.toLowerCase()] = toolToOpenApiOperation(tool);
    }
  }
  
  return {
    openapi: '3.1.0',
    info: {
      title: 'Waystation API',
      description: 'A set of tools that connect ChatGPT to productivity apps',
      version: '0.2.0'
    },
    servers: [{
      url: process.env.NEXT_PUBLIC_APP_URL,
      description: 'Waystation Server'
    }],
    paths
  };
}

function toolToOpenApiOperation(tool: Tool) {
  // Convert Zod schemas to OpenAPI schemas
  const requestSchema = zodToJsonSchema(tool.parameters) as Record<string, unknown>;
  
  const operation: Record<string, unknown> = {
    operationId: tool.id,
    summary: tool.summary,
    description: tool.description,
  };
  
  // Generate requestBody from Zod schema if needed
  if (tool.method !== 'GET') {
    operation.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: requestSchema
        }
      }
    };
  }
  
  // Generate parameters for GET requests
  if (tool.method === 'GET' && requestSchema.properties) {
    operation.parameters = Object.entries(requestSchema.properties).map(([name, schema]) => ({
      name,
      in: 'query',
      required: Array.isArray(requestSchema.required) ? requestSchema.required.includes(name) : false,
      schema,
      description: (schema as Record<string, unknown>).description
    }));
  }
  
  // Generate response schemas with standard error responses
  operation.responses = {
    ...Object.entries(tool.responses).reduce((acc: Record<string, unknown>, [code, response]) => {
      const schema = zodToJsonSchema(response.schema);
      
      acc[code] = {
        description: response.description,
        content: response.contentTypes ? 
          response.contentTypes.reduce((contentObj, mimeType) => ({
            ...contentObj,
            [mimeType]: {
              schema: {
                type: 'string',
                format: 'binary'
              }
            }
          }), {}) : 
          {
            'application/json': {
              schema
            }
          }
      };
      return acc;
    }, {}),
    '400': {
      description: 'Bad Request - Invalid parameters'
    },
    '401': {
      description: 'Unauthorized - Authentication is required'
    },
    '500': {
      description: 'Internal Server Error - Something went wrong on the server'
    }
  };
  
  return operation;
}
