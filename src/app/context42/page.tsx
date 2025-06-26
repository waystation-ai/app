import { Metadata } from 'next';

import Link from 'next/link';
import Image from 'next/image';
import Chat from '@/components/app/Context42Chat';

export const metadata: Metadata = {
  title: 'Context42 - Generate code that works for your integration use case',
};

export default async function Context42Page() {
  
  return (
    <div className="flex flex-col relative">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 py-8 px-8 w-full max-w-[1920px] mx-auto">
          {/* Left Column - Branding */}
          <div className="flex flex-col justify-center text-left space-y-4 lg:space-y-6 lg:col-span-1">
            <h1 className="text-3xl lg:text-4xl font-bold">Context42</h1>
            <h2 className="text-lg lg:text-xl leading-snug">
              <span className="bg-yellow-100">Generate code that works</span><br/>for your integration use case.<br/><br/>For free.
            </h2>
             <Link href={`cursor://anysphere.cursor-deeplink/mcp/install?name=context42&config=eyJ1cmwiOiJodHRwczovL3dheXN0YXRpb24uYWkvY29udGV4dDQyL21jcCJ9`} 
                className="cursor-btn flex gap-2 w-auto">
                <Image src="/images/apps/cursor.svg" width={26} height={26} alt="Cursor Logo"></Image> Add to Cursor
              </Link>
          </div>

          {/* Right Column - Chat Demo */}
          <div className="flex items-start justify-start mt-4 lg:mt-0 lg:col-span-3">
            <div className="w-full">
              <Chat/>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
