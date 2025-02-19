import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { oauthConnections } from '@/db/schema';
import { eq } from 'drizzle-orm';
import ProviderCard from '@/components/ProviderCard';
import Image from 'next/image';
import Link from 'next/link';


const providerDescriptions = {
  monday: "Access and manage your Monday.com boards, items, and updates seamlessly.",
  slack: "Send messages, access channels, and manage files in your Slack workspace.",
  gdrive: "Browse, search, and manage your Google Drive files and folders.",
  gmail: "Read emails, send messages, and manage labels in your Gmail account."
};

export default async function Page() {
  let connectedProviders: Record<string, boolean> = {};
  
  try {
    const session = await auth();
    
    if (session?.userId) {
      const connections = await db.select().from(oauthConnections)
        .where(eq(oauthConnections.userId, session.userId));

      connectedProviders = connections.reduce((acc, conn) => {
        acc[conn.provider] = true;
        return acc;
      }, {} as Record<string, boolean>);
    }
  } catch (error) {
    console.error('Error fetching connections:', error);
    // Continue with empty connections
  }

  return (
    <div className="flex flex-col mt-4 sm:mt-8 justify-center items-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <p className="text-3xl lg:text-4xl text-gray-900 font-bold">
            Connect your apps...
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full my-9">
        {Object.entries(providerDescriptions).map(([provider, description]) => (
          <ProviderCard
            key={provider}
            provider={provider}
            name={provider.charAt(0).toUpperCase() + provider.slice(1)}
            description={description}
            isConnected={!!connectedProviders[provider]}
          />
        ))}
      </div>
      <p className="text-3xl lg:text-4xl text-gray-900 font-bold">
            ...and launch!
      </p>
      <Link href="https://chatgpt.com/g/g-67b343ef52b48191ae76ca4738fa5a93-waystation" className="aurora-btn px-4 py-2 my-9 text-lg font-bold rounded-lg hover:scale-105 transition-transform duration-300 w-auto text-center">
        Launch WayStation GPT
      </Link>
    </div>
  );
}
