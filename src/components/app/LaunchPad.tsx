'use client';

import Link from 'next/link';
import Image from "next/image";

import { useTrackEvent } from '@/lib/utils/track-event';
import { DownloadButton } from './DownloadButton';
import NanoIdDisplay from './NanoIdDisplay';



export function LaunchPad() {
  const trackEvent = useTrackEvent();

  return (
    <div className='flex flex-col items-center justify-center w-full'>
      Your personal MCP:
      <NanoIdDisplay></NanoIdDisplay>
      
      <div className="flex flex-row items-start gap-4 mt-6">
        <Link href='/playground' onClick={() => trackEvent('launch', {'app': "playground"})} target='_blank' className="launch-btn px-4 py-2 font-bold hover:scale-105 transition-transform duration-300 w-auto text-center rounded-lg">
          <span>Launch Playground</span>
        </Link>
        <span className="text-sm font-medium my-4 text-gray-500">or</span>
        <div>
          <DownloadButton className='launch-btn px-4 py-2 font-bold hover:scale-105 transition-transform duration-300 w-auto text-center rounded-lg'/>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs font-medium text-gray-500">Works with</span> 
            <Image src='/images/apps/claude.svg' width={15} height={15} alt="Claude"/>
            <span className="text-xs font-medium text-gray-500">Claude Desktop</span>
          </div>
        </div>
      </div>

    </div>
  )
}
