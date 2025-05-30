import { NextApiRequest, NextApiResponse } from 'next';
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

import { getAuth } from '@clerk/nextjs/server';
import { configureMcpServer } from '@/lib/services/mcp-server';
import { createPubSub } from '@/lib/services/pubsub';

// Add this at the top of the file
export const config = {
  api: {
    bodyParser: false,
  },
};

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
  const server = await configureMcpServer(userId as string) ;
  
  // Connect transport to server
  await server.connect(transport);
}
