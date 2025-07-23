import { Metadata } from 'next';

import Chat from "@/components/app/Chat";

export const metadata: Metadata = {
  title: 'Playground',
};

export default async function PlaygroundPage() {
  
  return (
    <div className="flex flex-col h-full px-4 sm:px-6 lg:px-8 mx-auto py-4">
      <div className="w-full flex-1">
        <Chat/>
      </div>
    </div>
  );
};
