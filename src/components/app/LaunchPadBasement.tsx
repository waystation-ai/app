'use client';

import Link from 'next/link';
import Image from "next/image";

import { useTrackEvent } from '@/lib/utils/track-event';

interface LaunchPadProps {
  gptId?: string;
}

export  function LaunchPadBasement({ gptId }: LaunchPadProps) {
  const trackEvent = useTrackEvent();

  return (
    <div className="flex items-center gap-4 mt-6 md:ml-8">
      <span className="text-sm font-medium text-gray-500">Alternatively</span>
      <Link href={`https://chatgpt.com/g/${gptId}-waystation`} className="app-link" onClick={() => trackEvent('launch', {'app': "ChatGPT"})}>
        <Image src="/images/apps/chatgpt.svg" width={20} height={20} alt="MCP Host" />
        <span>Launch WayStation GPT</span>
      </Link>
    </div>
)
}