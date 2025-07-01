'use client';

import { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import clsx from 'clsx';

export function ConnectionStringForm({ provider, onConnect }: { provider: string, onConnect: () => void }) {
  const [connectionString, setConnectionString] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/auth/${provider}/connection_string`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ connectionString }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save connection string');
      }

      onConnect();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <textarea
        value={connectionString}
        onChange={(e) => setConnectionString(e.target.value)}
        placeholder="Enter your database connection string"
        className="p-2 border rounded"
        rows={4}
      />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="submit"
              disabled={isSubmitting || !connectionString}
              className={clsx(
                'getstarted-btn flex items-center justify-center',
                (isSubmitting || !connectionString) && 'cursor-not-allowed bg-gray-400'
              )}
            >
              {isSubmitting && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              )}
              {isSubmitting ? 'Connecting...' : 'Connect Now'}
            </button>
          </TooltipTrigger>
          {!connectionString && (
            <TooltipContent>
              <p>Please enter a connection string</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
