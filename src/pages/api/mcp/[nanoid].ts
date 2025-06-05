import { NextApiRequest, NextApiResponse } from 'next';
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

import { configureMcpServer } from '@/lib/services/mcp-server';
import { db } from '@/lib/db';
import { nanoIds } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// Add this at the top of the file
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {nanoid} = req.query;

  if (req.method !== 'POST') {
    return res.redirect(`/mcp/sse/${nanoid}`);
    /*
    res.writeHead(405).end(JSON.stringify({
      jsonrpc: "2.0",
      error: {
        code: -32000,
        message: "Method not allowed."
      },
      id: null
    }));

    return;
    */
  }
  
  const nanoIdEntry = await db.query.nanoIds.findFirst({
    where: eq(nanoIds.nanoId, nanoid as string),
  });

  const userId = nanoIdEntry?.userId;
  if (!userId) {
    console.log(`Invalid nano ID provided: ${nanoid}`);
    return res.status(401).json({ error: 'Unauthorized' }); // Invalid nano ID, immediately return unauthorized  
  }

  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });
    
  // Create MCP server
  const server = await configureMcpServer(userId);
  
  // Connect transport to server
  await server.connect(transport);

  await transport.handleRequest(req, res);
}