import { NextApiRequest, NextApiResponse } from 'next';
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

import { configureMcpServer } from '@/lib/services/mcp-server';
import { getAuthUserId } from '@/lib/utils/auth-userid';
import { generateWWWAuthenticateHeader } from '@/lib/utils/www-authenticate';

// Add this at the top of the file
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {nanoid} = req.query;

  if (req.method !== 'POST') 
    return res.redirect(`/mcp/sse/${nanoid}`);
  
  const userId = await getAuthUserId(req, Array.isArray(nanoid) ? nanoid[0] : nanoid);

  if (!userId) {
    res.setHeader('WWW-Authenticate', generateWWWAuthenticateHeader());
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Create MCP server
  const server = await configureMcpServer(userId);
  
  // Connect transport to server
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });
  await server.connect(transport);

  await transport.handleRequest(req, res);
}
