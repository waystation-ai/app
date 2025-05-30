import { NextApiRequest, NextApiResponse } from 'next';
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

import { db } from '@/lib/db';
import { nanoIds } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

import { configureMcpServer } from '@/lib/services/mcp-server';
import { createPubSub } from '@/lib/services/pubsub';

// Add this at the top of the file
export const config = {
  api: {
    bodyParser: false,
  },
};


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {nanoid} = req.query;

  const nanoIdEntry = await db.query.nanoIds.findFirst({
    where: eq(nanoIds.nanoId, nanoid as string),
  });

  const userId = nanoIdEntry?.userId;
  if (!userId) {
    console.log(`Invalid nano ID provided: ${nanoid}`);
    return res.status(401).json({ error: 'Unauthorized' }); // Invalid nano ID, immediately return unauthorized  
  }

  const transport = new SSEServerTransport("/mcp/messages", res);

  const sessionId = transport.sessionId;

  const pubSub = await createPubSub();  
  await pubSub.listen(`mcp_messages_${sessionId.replaceAll('-', '_')}`, async (message) => {
    if (!message) 
      return;

    await transport.handleMessage(JSON.parse(message));   
  });

  // Set up onclose handler to clean up transport when closed
  transport.onclose = () => {
    console.log(`SSE transport closed for session ${sessionId}`);
    pubSub.disconnect();
  };
  
  // Create MCP server
  const server = await configureMcpServer(userId);
  
  // Connect transport to server
  await server.connect(transport);

}
