'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export function RedirectHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const redirectUri = searchParams?.get('redirect_uri');
    
    if (redirectUri) {
      // Small delay to ensure the dashboard is visible first
      const timer = setTimeout(() => {
        router.push(redirectUri);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [router, searchParams]);
  
  return null; // This component doesn't render anything
}
