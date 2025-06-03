import { NextApiRequest, NextApiResponse } from 'next';

import { db } from '@/lib/db';
import { nanoIds } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

import { sseHandler } from '../sse';

// Add this at the top of the file
export const config = {
  api: {
    bodyParser: false,
  },
};


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {nanoid} = req.query;

  const nanoIdEntry = await db.query.nanoIds.findFirst({
    where: eq(nanoIds.nanoId, nanoid as string),
  });

  const userId = nanoIdEntry?.userId;
  if (!userId) {
    console.log(`Invalid nano ID provided: ${nanoid}`);
    return res.status(401).json({ error: 'Unauthorized' }); // Invalid nano ID, immediately return unauthorized  
  }

  await sseHandler(res, userId);  
}
