'use client';

import { useState } from 'react';

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
      <button type="submit" disabled={isSubmitting} className="getstarted-btn">
        {isSubmitting ? 'Connecting...' : 'Connect Now'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
