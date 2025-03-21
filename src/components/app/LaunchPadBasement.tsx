'use client';

import Link from 'next/link';
import Image from "next/image";

import { useTrackEvent } from '@/lib/utils/track-event';

export  function LaunchPadBasement() {
  const trackEvent = useTrackEvent();

  return (
    <div className="flex items-center gap-4 mt-4 md:mt-0 md:ml-8">
    <span className="text-sm font-medium text-gray-500">Alternatively</span>
    <Link href='/connect/claude/guide' className="app-link" onClick={() => trackEvent('launch', {'app': "Claude"})}>
      <Image src='/images/apps/claude.svg' width={20} height={20} alt="Claude"/>
      <span>Connect to Claude Desktop</span>
    </Link>
    <span className="text-sm font-medium text-gray-500">or</span>
    <Link href='/connect/mcp-server/guide' className="app-link" onClick={() => trackEvent('launch', {'app': "MCP"})}>
      <Image src="/images/apps/mcp.svg" width={20} height={20} alt="MCP Host" />
      <span>Connect to Any MCP host</span>
    </Link>
  </div>
)
}