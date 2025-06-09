import { NextApiRequest, NextApiResponse } from 'next';
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

import { configureMcpServer } from '@/lib/services/mcp-server';
import { createPubSub } from '@/lib/services/pubsub';
import { getAuthUserId } from '@/lib/utils/auth-userid';

// Add this at the top of the file
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function sseHandler(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { provider } = req.query;
  
  const transport = new SSEServerTransport("/mcp/messages", res);

  const sessionId = transport.sessionId;

  const pubSub = await createPubSub();
  await pubSub.listen(`mcp_messages_${sessionId.replaceAll('-', '_')}`, async (message) => {
    if (!message)
      return;

    await transport.handleMessage(JSON.parse(message));
  });

  // Add timeout to close connection after 85 seconds to avoid Vercel's 90s timeout
  const timeoutId = setTimeout(() => {
    console.log(`Closing SSE connection after 85s timeout for session ${sessionId}`);
    transport.close();
  }, 85000);

  // Set up onclose handler to clean up transport when closed
  transport.onclose = async () => {
    console.log(`SSE transport closed for session ${sessionId}`);
    clearTimeout(timeoutId);
    await pubSub.disconnect();
  };

  // Create MCP server
  const server = await configureMcpServer(userId, provider ? Array.isArray(provider) ? provider[0] : provider : undefined);

  // Connect transport to server
  await server.connect(transport);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = await getAuthUserId(req);  

  if (!userId)
    return res.status(401).json({ error: 'Unauthorized' });

  await sseHandler(req, res, userId);
}
