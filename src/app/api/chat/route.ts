import { azure } from '@ai-sdk/azure';
import { jsonSchema, streamText, tool } from 'ai';
import { auth } from '@clerk/nextjs/server';
import { registry } from '@/marketplace';
import { getValidConnections } from '@/lib/db';
import { builtInTools } from '@/lib/tools';
import { z } from 'zod';
import { JSONSchema7 } from 'json-schema';
import { promises as fs } from 'fs';
import path from 'path';

async function getSystemPrompt() {
  try {
    const filePath = path.join(process.cwd(), 'src/app/api/chat/system.MD');
    return await fs.readFile(filePath, 'utf8');
  } catch (error) {
    console.error('Error reading instructions file:', error);
    return ''; // Return empty string if file cannot be read
  }
}

export async function POST(req: Request) {
  const data = await req.json();
  const { messages/*, id */} = data;
  
  // Get the current user
  const session = await auth();
  const userId = session.userId;

  if (!userId)
    return new Response('Unauthorized', { status: 401 });
  
  // Get all available tools from the registry
  const allTools: Record<string, any> = { };  //eslint-disable-line @typescript-eslint/no-explicit-any
  
  if (userId) {
    // Get user's connected providers
    try {
      // Get all providers from the registry
      const providers = registry.getAllProviders();
      
      // Get all connections for the user in a single query
      const connections = await getValidConnections(userId);
      
      for (const provider of providers) {
        // Check if the user has a valid connection to this provider
        const connection = connections.get(provider.id);

        if (!connection)
          continue;

        function patchSchema(schema: JSONSchema7) {
          if (!schema.$schema) {
            schema.$schema = 'http://json-schema.org/draft-07/schema#';
          }
          if (!schema.properties) {
            schema.properties = {};
            schema.additionalProperties = false;
          }
          return schema
        }

        // User is connected to this provider, add its tools
        for (const providerTool of await registry.getProviderTools(provider, userId)) {
          allTools[providerTool.id] = tool({    
            description: providerTool.description || providerTool.summary,
            parameters: providerTool.inputSchema ? jsonSchema(patchSchema(providerTool.inputSchema)) : z.any(),
            execute: async (params) => {
              // Call the centralized executeTool method
              return registry.executeTool({provider, tool: providerTool}, userId, params);
            }
          });
        }
      }
    } catch (error) {
      console.error('Error fetching user connections:', error);
      // Continue with default tools if there's an error
    }

    // Add built-in platform tools (always available)
    for (const [toolId, builtInTool] of Object.entries(builtInTools)) {
      allTools[toolId] = tool({
        description: builtInTool.description,
        parameters: builtInTool.parameters,
        execute: async (params) => {
          return builtInTool.handler(params);
        }
      });
    }
  }

  const result = streamText({
    model: azure('gpt-4.1-mini', {
      structuredOutputs: false
    }),
    system: await getSystemPrompt(),
    messages,
    tools: allTools,
    onError({ error }) {
      console.error(error); 
    },
    experimental_telemetry: {
      isEnabled: true,
      recordInputs: true,
      recordOutputs: true,
    },
    /*
    async onFinish({ response }) {
      if (id) {
        await saveChat({
          id,
          messages: appendResponseMessages({
            messages,
            responseMessages: response.messages,
          }),
        });
      }
    },
    */
  });

  // Consume stream to ensure it runs to completion even if client disconnects
  result.consumeStream();

  const response = result.toDataStreamResponse({
    getErrorMessage: (error) => {
      console.error('Error in streamText:', error);
      return "error";
    },
    sendReasoning: true,
    sendUsage: false,
  });

  result.usage.then((usage) => {
    console.log('Usage:', usage);
  });

  return response;
}
