import { Metadata } from 'next';

import Chat from "@/components/app/Chat";

export const metadata: Metadata = {
  title: 'Playground',
};

export default async function PlaygroundPage() {
  
  return (
    <div className="flex flex-col mt-4 sm:mt-8 px-4 sm:px-6 lg:px-8  mx-auto">
      <div className="w-full">
        <Chat/>
      </div>
    </div>
  );
};
