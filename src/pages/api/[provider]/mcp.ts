import { NextApiRequest, NextApiResponse } from 'next';
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

import { configureMcpServer } from '@/lib/services/mcp-server';
import { getAuthUserId } from '@/lib/utils/auth-userid';
import { generateWWWAuthenticateHeader } from '@/lib/utils/www-authenticate';

import { registry } from '@/marketplace';

// Add this at the top of the file
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { provider } = req.query;

  const providerId = Array.isArray(provider) ? provider[0] : provider

  if (!providerId || !registry.getProvider(providerId))
    return res.status(404).json({ error: 'Provider not found' });

  if (req.method !== 'POST') 
    return res.redirect(`/mcp/sse?provider=${provider}`);

  const userId = await getAuthUserId(req);  

  if (!userId) {
    res.setHeader('WWW-Authenticate', generateWWWAuthenticateHeader());
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Create MCP server
  const server = await configureMcpServer(userId, providerId);
  
  // Connect transport to server
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });    
  await server.connect(transport);

  await transport.handleRequest(req, res);
}
