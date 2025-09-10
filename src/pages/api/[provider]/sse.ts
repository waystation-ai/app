import { NextApiRequest, NextApiResponse } from 'next';

import { getAuthUserId } from '@/lib/utils/auth-userid';
import { generateWWWAuthenticateHeader } from '@/lib/utils/www-authenticate';
import { sseHandler } from '@/pages/api/mcp/sse';

// Add this at the top of the file
export const config = {
  api: {
    bodyParser: false,
  },
};


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = await getAuthUserId(req);  

  if (!userId) {
    res.setHeader('WWW-Authenticate', generateWWWAuthenticateHeader());
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await sseHandler(req, res, userId);
}
