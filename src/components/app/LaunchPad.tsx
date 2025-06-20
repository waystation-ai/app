'use client';

import Link from 'next/link';

import { useTrackEvent } from '@/lib/utils/track-event';

export function LaunchPad() {
  const trackEvent = useTrackEvent();

  return (
    <div className='flex flex-col items-center justify-center w-full'>
      <div className="flex flex-row items-start gap-4 mt-6">
        <Link href='/chat' onClick={() => trackEvent('launch', {'app': "playground"})} className="launch-btn px-4 py-2 font-bold hover:scale-105 transition-transform duration-300 w-auto text-center rounded-lg">
          <span>Launch Chat</span>
        </Link>
      </div>

    </div>
  )
}
