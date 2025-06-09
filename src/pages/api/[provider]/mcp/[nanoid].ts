import { NextApiRequest, NextApiResponse } from 'next';
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

import { configureMcpServer } from '@/lib/services/mcp-server';
import { getAuthUserId } from '@/lib/utils/auth-userid';
import { registry } from '@/marketplace';

// Add this at the top of the file
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {provider, nanoid} = req.query;

  const providerId = Array.isArray(provider) ? provider[0] : provider

  if (!providerId || !registry.getProvider(providerId))
    return res.status(404).json({ error: 'Provider not found' });

  if (req.method !== 'POST') 
    return res.redirect(`/mcp/sse/${nanoid}?provider=${provider}`);
  
  const userId = await getAuthUserId(req, Array.isArray(nanoid) ? nanoid[0] : nanoid);

  if (!userId)
    return res.status(401).json({ error: 'Unauthorized' });

  // Create MCP server
  const server = await configureMcpServer(userId, Array.isArray(provider) ? provider[0] : provider);
  
  // Connect transport to server
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });
  await server.connect(transport);

  await transport.handleRequest(req, res);
}