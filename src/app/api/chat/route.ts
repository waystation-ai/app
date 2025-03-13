import { azure } from '@ai-sdk/azure';
import { streamText, tool } from 'ai';
import { auth } from '@clerk/nextjs/server';
import { registry } from '@/app/tools/core/registry';
import { getValidConnections } from '@/app/lib/db';

// Import all providers to ensure they're registered
import '@/app/tools/main';

const systemPrompt = `WayStation connects ChatGPT to popular productivity apps, such as Google Drive, Monday, Slack, and Gmail. It makes it possible for ChatGPT to find and read files, work with projects and tasks, engage in conversation on Slack, and communicate over email on behalf of users.

** System instructions **
- Always generate text response after calling a tool and processing tool response.
- Every time you're about to call a tool that modifies data (create, update, post) describe to the user what you're going to do and ask for their confirmation to proceed.

** Monday instructions **
- When creating new items, use the column_values parameter to pass additional field values like person, status, etc. 
- When the user asks to assign an item to someone, read the board first, identify the first column of people type, and set the value of this column. If you're unsure what field names to use, read the board first and use the output as a reference
- When you use the updateMondayItem tool, make sure you populate column_values with the IDs and values of columns to be modified. Example: column_values: {"person": user_id, "status": "status_label"} 

** Slack instructions **
Convert formatted text to Slack message markup before posting it`;

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  // Get the current user
  const session = await auth();
  const userId = session.userId;
  
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
        const connection = connections.get(provider.name);

        if (!connection)
          continue;
        
        // User is connected to this provider, add its tools
        for (const providerTool of provider.tools) {
          allTools[providerTool.id] = tool({    
            description: providerTool.description || providerTool.summary,
            parameters: providerTool.parameters,
            execute: async (params) => {
              try {
                // Call the tool handler with the user context
                const result = await providerTool.handler({
                  context: { userId },
                  params
                });
                
                return result;
              } catch (error) {
                console.error(`Error executing tool ${providerTool.id}:`, error);
                throw error;
              }
            }
          });
        }
      }
    } catch (error) {
      console.error('Error fetching user connections:', error);
      // Continue with default tools if there's an error
    }
  }

  const result = streamText({
    model: azure('gpt-4o-mini'),
    system: systemPrompt,
    messages,
    tools: allTools,
  });

  return result.toDataStreamResponse();
}
