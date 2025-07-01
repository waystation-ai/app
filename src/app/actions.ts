'use server';

import { removeDbConnection, storeConnectionString } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export async function storeConnectionStringAction(provider: string, connectionString: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('You must be signed in to store a connection string.');
  }

  await storeConnectionString(userId, provider, connectionString);
  revalidatePath('/');
}

export async function removeDatabaseConnection(provider: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('You must be signed in to remove a database connection.');
  }

  await removeDbConnection(userId, provider);
  revalidatePath('/');
}
