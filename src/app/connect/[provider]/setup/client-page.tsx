'use client';

// Component for the setup page
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { storeConnectionStringAction } from '@/app/actions';
import Image from 'next/image';

interface ClientPageProps {
  provider: {
    id: string;
    name: string;
    description: string;
  };
}

export default function ClientPage({ provider }: ClientPageProps) {
  const [connectionString, setConnectionString] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await storeConnectionStringAction(provider.id, `${provider.name} Connection`, connectionString);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center">
          <Image
            src={`/images/tools/${provider.id}.svg`}
            alt={provider.name}
            width={64}
            height={64}
            className="object-contain"
          />
          <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
            Connect to {provider.name}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="connection-string" className="sr-only">
              Connection String
            </label>
            <input
              id="connection-string"
              name="connection-string"
              type="text"
              required
              className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Enter your connection string"
              value={connectionString}
              onChange={(e) => setConnectionString(e.target.value)}
            />
          </div>

          {error && (
            <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="connect-btn px-4 py-2 text-sm font-medium rounded-lg hover:scale-105 transition-transform duration-300 flex-grow text-center bg-blue-600 hover:bg-blue-700 text-white w-full"
            >
              {loading ? 'Connecting...' : 'Connect'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
