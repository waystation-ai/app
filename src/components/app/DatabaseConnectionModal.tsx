'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
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
  const [connectionString, setConnectionString] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('connectionString', connectionString);
        
        // Call the server action via fetch
        const response = await fetch('/api/database-connection', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            provider: provider.id,
            name: `${provider.name} Connection`,
            connectionString,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to store connection string');
        }

        onOpenChange(false);
        setConnectionString('');
        
        // Refresh the page to update the connection status
        window.location.reload();
      } catch (error) {
        console.error('Failed to store connection string:', error);
      }
    });
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
            Enter your {provider.name} connection string to connect your database.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="connection-string" className="sr-only">
              Connection String
            </label>
            <input
              id="connection-string"
              name="connectionString"
              type="text"
              required
              value={connectionString}
              onChange={(e) => setConnectionString(e.target.value)}
              className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Enter your connection string"
              disabled={isPending}
            />
          </div>
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
              disabled={isPending || !connectionString.trim()}
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