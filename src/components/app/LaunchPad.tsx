'use client';

import Link from 'next/link';
import Image from 'next/image';

import { useTrackEvent } from '@/lib/utils/track-event';

export function LaunchPad() {
  const trackEvent = useTrackEvent();

  return (
    <div className="flex flex-wrap items-center gap-4 mt-8">
      <Link href='/playground' onClick={() => trackEvent('launch', {'app': "playground"})} target='_blank' className="launch-btn px-4 py-2 font-bold hover:scale-105 transition-transform duration-300 w-auto text-center rounded-lg">
        <span>Launch Playground</span>
      </Link>
      <span className="text-base font-medium text-gray-600">or connect</span>
      <Link href="/app/claude" className="flex items-center gap-3 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md">
        <Image src="/images/apps/claude.svg" width={24} height={24} alt="Claude" />
        <span className="font-medium text-gray-900">Claude</span>
      </Link>
      <span className="text-base font-medium text-gray-600">or</span>
      <Link href="/app/cursor" className="flex items-center gap-3 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md">
        <Image src="/images/apps/cursor.svg" width={24} height={24} alt="Cursor" />
        <span className="font-medium text-gray-900">Cursor</span>
      </Link>
      <span className="text-base font-medium text-gray-600">or</span>
      <Link href="/app/chatgpt" className="flex items-center gap-3 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md">
        <Image src="/images/apps/chatgpt.svg" width={24} height={24} alt="ChatGPT" />
        <span className="font-medium text-gray-900">ChatGPT</span>
      </Link>
      <span className="text-base font-medium text-gray-600">or</span>
      <Link href="/app/mcp" className="flex items-center gap-3 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md">
        <Image src="/images/apps/mcp.svg" width={24} height={24} alt="MCP" />
        <span className="font-medium text-gray-900">Any MCP client</span>
      </Link>
    </div>
  )
}
