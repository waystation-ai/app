import { NextApiRequest, NextApiResponse } from 'next';
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

import { configureMcpServer } from '@/lib/services/mcp-server';
import { getAuthUserId } from '@/lib/utils/auth-userid';

// Add this at the top of the file
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.redirect('/mcp/sse');
    //return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const userId = await getAuthUserId(req);  

  if (!userId)
    return res.status(401).json({ error: 'Unauthorized' });


  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });
    
  // Create MCP server

  const server = await configureMcpServer(userId);
  
  // Connect transport to server
  await server.connect(transport);

  await transport.handleRequest(req, res);
}