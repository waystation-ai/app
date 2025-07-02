'use server';

import { addConnection, removeConnection } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function storeConnectionString(
  provider: string,
  name: string,
  formData: FormData,
) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('You must be signed in to store a connection string.');
  }

  const connectionString = formData.get('connectionString') as string;

  await addConnection(userId, provider, name, { connectionString });

  revalidatePath('/');
  redirect('/');
}

export async function deleteConnection(provider: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('You must be signed in to remove a database connection.');
  }

  await removeConnection(userId, provider);
  revalidatePath('/');
}
