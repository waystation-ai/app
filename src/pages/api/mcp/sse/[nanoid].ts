import { NextApiRequest, NextApiResponse } from 'next';
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

import { db } from '@/lib/db';
import { nanoIds } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

import { configureMcpServer } from '@/lib/services/mcp-server';
import { transports } from '../sse';

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

  // Store the transport by session ID
  const sessionId = transport.sessionId;
  transports[sessionId] = transport;

  // Set up onclose handler to clean up transport when closed
  transport.onclose = () => {
    console.log(`SSE transport closed for session ${sessionId}`);
    delete transports[sessionId];
  };  
    
  // Create MCP server
  const server = await configureMcpServer(userId);
  
  // Connect transport to server
  await server.connect(transport);
}
