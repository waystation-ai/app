import { nanoid } from 'nanoid';
import { db } from '@/lib/db'; // Assuming you have a db instance exported from here
import { nanoIds } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function generateNanoidForUser(userId: string, regenerate: boolean = false): Promise<string> {
  // Check if a nano ID already exists for the user
  const existingNanoId = await db.query.nanoIds.findFirst({
    where: eq(nanoIds.userId, userId),
  });

  if (existingNanoId && !regenerate) {
    return existingNanoId.nanoId;
  }

  // Generate a new unique nano ID
  let newNanoId: string;
  let existing: { nanoId: string; userId: string; id: number; createdAt: Date | null; updatedAt: Date | null; } | undefined;

  do {
    newNanoId = nanoid();
    existing = await db.query.nanoIds.findFirst({
      where: eq(nanoIds.nanoId, newNanoId),
    });
  } while (existing);


  if (existingNanoId) {
    // Update the existing nano ID
    await db.update(nanoIds).set({ nanoId: newNanoId, updatedAt: new Date() }).where(eq(nanoIds.userId, userId));
  } else {
    // Insert a new record
    await db.insert(nanoIds).values({ userId, nanoId: newNanoId, createdAt: new Date(), updatedAt: new Date() });
  }

  return newNanoId;
}
