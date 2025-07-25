'use server';

import { addConnection } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { validateDatabaseConnection } from '@/lib/db-clients/validator';

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

export async function storeDatabaseConnection(provider: string, name: string, formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('You must be signed in to store a connection string.');
  }

  const connectionString = formData.get('connectionString') as string;
  
  if (!connectionString) {
    throw new Error('Connection string is required.');
  }

  // Validate the database connection before saving
  const validationResult = await validateDatabaseConnection(connectionString);
  
  if (!validationResult.isValid) {
    throw new Error(validationResult.error || 'Invalid database connection');
  }

  await addConnection(userId, provider, name, { connectionString });

  // Revalidate paths without redirecting
  revalidatePath('/app');
  revalidatePath('/app/integrations');
}
