'use client';

import Link from 'next/link';
import Image from "next/image";

import { useTrackEvent } from '@/lib/utils/track-event';

export  function LaunchPadBasement() {
  const trackEvent = useTrackEvent();

  return (
    <div className="flex items-center gap-4 mt-6 md:ml-8">
      <span className="text-sm font-medium text-gray-500">Alternatively</span>
      <Link href='/connect/mcp-server/guide' className="app-link" onClick={() => trackEvent('launch', {'app': "MCP"})}>
        <Image src="/images/apps/mcp.svg" width={20} height={20} alt="MCP Host" />
        <span>Connect to Any MCP host</span>
      </Link>
    </div>
)
}