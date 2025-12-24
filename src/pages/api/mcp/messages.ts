import { NextApiRequest, NextApiResponse } from 'next';

import { publishToSession } from '@/lib/services/pubsub';
import { isSSEEnabled, handleDeprecatedSSE } from '@/lib/utils/sse-deprecation';

// Add this at the top of the file
/*
export const config = {
  api: {
    bodyParser: false,
  },
};
*/

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!isSSEEnabled()) {
    return handleDeprecatedSSE(res, '/api/mcp/messages');
  }

  console.log('Received POST request to /messages');

  // Extract session ID from URL query parameter
  // In the SSE protocol, this is added by the client based on the endpoint event
  const sessionId = req.query.sessionId as string | undefined;

  if (!sessionId) {
    console.error('No session ID provided in request URL');
    res.status(400).send('Missing sessionId parameter');
    return;
  }
  
  await publishToSession(`mcp_messages_${sessionId.replaceAll('-', '_')}`, JSON.stringify(req.body));

  res.writeHead(202).end("Accepted");
}

