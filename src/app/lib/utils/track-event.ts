'use client';

import { usePostHog } from 'posthog-js/react';
import { sendGAEvent } from '@next/third-parties/google';


export interface EventProperties {
  [key: string]: string | number | boolean | undefined;
}

export function useTrackEvent() {
  const posthog = usePostHog();
  
  return function trackEvent(eventName: string, properties?: EventProperties) {
    // Send to PostHog
    posthog.capture(eventName, properties);
    
    // Send to Google Analytics via GTM
    sendGAEvent({event: eventName, ...properties});
  }
}
