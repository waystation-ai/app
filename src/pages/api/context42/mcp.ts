import { NextApiRequest, NextApiResponse } from 'next';
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from 'zod';

import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

import path from 'path';
import { promises as fs } from 'fs';

// Add this at the top of the file
export const config = {
  api: {
    bodyParser: false,
  },
};

async function getSystemPrompt() {
  try {
    const filePath = path.join(process.cwd(), 'src/app/api/context42/system.MD');
    return await fs.readFile(filePath, 'utf8');
  } catch (error) {
    console.error('Error reading instructions file:', error);
    return ''; // Return empty string if file cannot be read
  }
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  // Create MCP server
  const server = new McpServer({
    name: "Context42",
    version: "0.1.0"
  });

  server.registerTool("generateCodeSnippet", {
    description: "Generates high-quality integration code snippets in any programming language based on the specific use case provided by user and most recent documentation and code for APIs being used.",
    inputSchema: { useCase: z.string().describe("The specific use case or problem statement for which the code snippet is needed.") },
    },
    async ({ useCase }) => {
      const { text } = await generateText({
          model: openai.responses("gpt-4.1"),
          system: await getSystemPrompt(),
          prompt: useCase,
          tools: {
            web_search_preview: openai.tools.webSearchPreview({
              searchContextSize: 'high',
            }),
          }
        });
      return {
        content: [{
          type: "text",
          text,
        }],
      }
    }
  );  

  
  // Connect transport to server
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });    
  await server.connect(transport);

  await transport.handleRequest(req, res);
}
