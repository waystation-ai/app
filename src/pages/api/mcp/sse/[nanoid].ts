import { NextApiRequest, NextApiResponse } from 'next';

import { sseHandler } from '../sse';
import { getAuthUserId } from '@/lib/utils/auth-userid';

// Add this at the top of the file
export const config = {
  api: {
    bodyParser: false,
  },
};


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {nanoid} = req.query;

  const userId = await getAuthUserId(req, Array.isArray(nanoid) ? nanoid[0] : nanoid);

  if (!userId)
    return res.status(401).json({ error: 'Unauthorized' });

  await sseHandler(res, userId);  
}
