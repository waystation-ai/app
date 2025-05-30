import { NextApiRequest, NextApiResponse } from 'next';
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

import { getAuth } from '@clerk/nextjs/server';
import { configureMcpServer } from '@/lib/services/mcp-server';

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

  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });
    
  // Create MCP server

  const server = await configureMcpServer(userId as string);
  
  // Connect transport to server
  await server.connect(transport);

  return transport.handleRequest(req, res);
}