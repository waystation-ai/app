'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';

function CopyIcon() {
  return (
    <svg 
      width="18" 
      height="18" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg 
      width="18" 
      height="18" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M23 4v6h-6"></path>
      <path d="M1 20v-6h6"></path>
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"></path>
      <path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14"></path>
    </svg>
  );
}

export default function NanoIdDisplay() {
  const [nanoId, setNanoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNanoId = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/user/nanoid');
      if (!response.ok) {
        throw new Error(`Error fetching nano ID: ${response.statusText}`);
      }
      const data = await response.json();
      setNanoId(data.nanoId);
    } catch (err: unknown) {
      console.error('Failed to fetch nano ID:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch nano ID';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const regenerateNanoId = async () => {
    setRefreshing(true);
    setError(null);
    try {
      const response = await fetch('/api/user/nanoid', {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error(`Error regenerating nano ID: ${response.statusText}`);
      }
      const data = await response.json();
      setNanoId(data.nanoId);
      setTimeout(() => setRefreshing(false), 1000);
    } catch (err: unknown) {
      console.error('Failed to regenerate nano ID:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to regenerate nano ID';
      setError(errorMessage);
      setRefreshing(false);
    }
  };

  const copyToClipboard = async () => {
    if (!sseUrl || sseUrl === 'Loading...') return;
    try {
      await navigator.clipboard.writeText(sseUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err: unknown) {
      console.error('Failed to copy:', err);
    }
  };

  useEffect(() => {
    fetchNanoId();
  }, []);

  const sseUrl = nanoId ? `${window.location.origin}/mcp/${nanoId}` : 'Loading...';

  return (
    <div>
      {loading && <p>Loading MCP Server URL...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {nanoId && (
        <>
          <div className="relative">
            <div className="font-mono text-sm bg-gray-50 p-4 pr-20 rounded-lg border border-gray-200 break-all">
              {sseUrl}
            </div>
            <button
              type="button"
              className={clsx("absolute top-2 right-10 p-2 rounded-md transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400", {
                "text-green-600": copied,
                "text-gray-500": !copied,
              })}
              onClick={copyToClipboard}
              aria-label="Copy to clipboard"
              disabled={loading}
            >
              <CopyIcon />
            </button>
            <button
              type="button"
              className={clsx("absolute top-2 right-2 p-2 rounded-md transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400", {
                "text-blue-600": refreshing,
                "text-gray-500": !refreshing,
              })}
              onClick={regenerateNanoId}
              aria-label="Regenerate MCP Server URL"
              disabled={loading || refreshing}
            >
              <RefreshIcon />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Regenerating will invalidate the previous URL.
          </p>
        </>
      )}
    </div>
  );
}
