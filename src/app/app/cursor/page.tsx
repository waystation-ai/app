import { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { generateNanoidForUser } from '@/lib/utils/generate-nanoid-for-user';
import CursorClient from './cursor-client';

export const metadata: Metadata = {
  title: 'Connect to Cursor - WayStation',
};

export default async function CursorPage() {
  const session = await auth();
  
  let nanoId: string | undefined;
  if (session.userId) {
    try {
      nanoId = await generateNanoidForUser(session.userId);
    } catch (error) {
      console.error('Failed to generate nano ID:', error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl text-center">
        <CursorClient isSignedIn={!!session.userId} nanoId={nanoId} />
      </div>
    </div>
  );
}