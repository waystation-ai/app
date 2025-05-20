import { NextApiRequest, NextApiResponse } from 'next';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

import { getAuth } from '@clerk/nextjs/server';
import { configureMcpServer } from '@/lib/services/mcp-server';

// Add this at the top of the file
export const config = {
  api: {
    bodyParser: false,
  },
};

// Store transports by session ID
export const transports: Record<string, SSEServerTransport> = {};

export function getTransport(sessionId: string) {
  return transports[sessionId];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = getAuth(req);
  let userId = session.userId;

  if (!userId) {
    console.log('Session userId is missing');
    const accessToken = req.headers.authorization;

    if (!accessToken)
      return res.status(401).json({ error: 'Unauthorized' });

    const response = await fetch(`https://clerk.${process.env.APP_DOMAIN}/oauth/userinfo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': accessToken
      }
    });
    console.log(response);

    if (!response.ok) 
      return res.status(401).json({ error: 'Unauthorized' });
      
    const data = await response.json();
    console.log(data);
    userId = data.user_id;
  }

  const transport = new SSEServerTransport("/mcp/messages", res);
    
  // Create MCP server
  const server = new Server(
    { name: "waystation", version: "0.2.0" },
    { capabilities: { tools: {} } }
  );

  configureMcpServer(server, userId as string);
  
  // Connect transport to server
  await server.connect(transport);
}
