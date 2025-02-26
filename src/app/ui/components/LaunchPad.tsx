'use client';

import Link from 'next/link';
import { usePostHog } from 'posthog-js/react';

export  function LaunchPad() {
  const posthog = usePostHog();

  function trackLaunch() {
    posthog.capture('launchGPT');
  }

  return (
    <Link href={`https://chatgpt.com/g/${process.env.GPT_ID}-waystation`} onClick={trackLaunch} target='_blank' className="launch-btn my-9 px-4 py-2 text-lg font-bold rounded-lg hover:scale-105 transition-transform duration-300 w-auto text-center">
      <span>Launch WayStation GPT</span>
    </Link>

  )
}