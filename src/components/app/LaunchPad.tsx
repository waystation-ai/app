'use client';

import Link from 'next/link';
import { useTrackEvent } from '@/lib/utils/track-event';

interface LaunchPadProps {
  gptId?: string;
}

export function LaunchPad({ gptId }: LaunchPadProps) {
  const trackEvent = useTrackEvent();

  return (
    <Link href={`https://chatgpt.com/g/${gptId}-waystation`} onClick={() => trackEvent('launch', {'app': "ChatGPT"})} target='_blank' className="launch-btn my-2 sm:my-8 px-4 py-2 text-lg font-bold rounded-lg hover:scale-105 transition-transform duration-300 w-auto text-center">
      <span>Launch WayStation GPT</span>
    </Link>
  )
}