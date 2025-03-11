'use client';

import { useState } from 'react';
import clsx from 'clsx';

interface WaitlistButtonProps {
  provider: string;
  isOnWaitlist: boolean;
}

export default function WaitlistButton({ provider, isOnWaitlist: initialIsOnWaitlist }: WaitlistButtonProps) {
  const [isOnWaitlist, setIsOnWaitlist] = useState(initialIsOnWaitlist);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const joinWaitlist = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ provider }),
      });
      
      if (response.ok) {
        setIsOnWaitlist(true);
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Failed to join waitlist' }));
        setError(errorData.message || 'Failed to join waitlist');
      }
    } catch (error) {
      console.error('Error joining waitlist:', error);
      setError('An error occurred while joining the waitlist');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-1/2">
      <button 
        className={clsx(
          'aurora-btn w-full px-4 py-2 text-sm font-bold rounded transition-transform duration-300 text-center',
          {
            'hover:scale-105': !isOnWaitlist && !isLoading,
            'opacity-75 cursor-not-allowed': isLoading
          }
        )}
        onClick={joinWaitlist}
        disabled={isOnWaitlist || isLoading}>
        {isLoading ? 'Joining...' : isOnWaitlist ? 'On the Wait List' : 'Join Wait List'}
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
