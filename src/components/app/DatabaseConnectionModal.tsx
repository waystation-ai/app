'use client';

import { useState } from 'react';
import Image from 'next/image';
import { storeDatabaseConnection } from '@/app/actions';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface DatabaseConnectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider: {
    id: string;
    name: string;
  };
}

export default function DatabaseConnectionModal({
  open,
  onOpenChange,
  provider,
}: DatabaseConnectionModalProps) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true);
    setError(null);
    
    try {
      await storeDatabaseConnection(provider.id, `${provider.name} Connection`, formData);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to store connection string:', error);
      setError(error instanceof Error ? error.message : 'Failed to store connection string');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <Image
              src={`/images/tools/${provider.id}.svg`}
              alt={provider.name}
              width={64}
              height={64}
              className="object-contain"
            />
          </div>
          <DialogTitle className="text-center">
            Connect to {provider.name}
          </DialogTitle>
          <DialogDescription className="text-center">
            Enter your {provider.name} connection string. We&apos;ll validate the connection and fetch your database schema before saving.
          </DialogDescription>
        </DialogHeader>
        
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="connection-string" className="sr-only">
              Connection String
            </label>
            <input
              id="connection-string"
              name="connectionString"
              type="text"
              required
              className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Enter your connection string"
              disabled={isPending}
            />
          </div>
          
          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}
          
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Connecting...' : 'Connect'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}