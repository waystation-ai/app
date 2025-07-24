'use client';

import Link from 'next/link';
import Image from 'next/image';

interface CursorClientProps {
  isSignedIn: boolean;
  nanoId?: string;
}

export default function CursorClient({ isSignedIn, nanoId }: CursorClientProps) {
  const cursorConfig = {
    url: `${typeof window !== 'undefined' ? window.location.origin : ''}/mcp${nanoId ? `/${nanoId}` : ''}`
  };

  const cursorDeepLink = `cursor://anysphere.cursor-deeplink/mcp/install?name=WayStation&config=${btoa(JSON.stringify(cursorConfig))}`;

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl text-gray-900 font-bold mb-4">
          Connect Cursor to your apps via WayStation
        </h1>
        <p className="text-lg text-gray-600">
          Add WayStation as an MCP server to access your tools directly within Cursor
        </p>
      </div>

      {/* Add to Cursor Button */}
      {isSignedIn ? (
        <Link
          href={cursorDeepLink}
          className="cursor-btn flex items-center justify-center gap-2 mx-auto"
        >
          <Image src="/images/apps/cursor.svg" width={26} height={26} alt="Cursor Logo" />
          Add to Cursor
        </Link>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-600">Sign in to connect WayStation to Cursor</p>
          <Link
            href="/sign-in"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign In
          </Link>
        </div>
      )}

      {/* Instructions */}
      {isSignedIn && (
        <div className="mt-8 text-left bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">How it works:</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Click the &quot;Add to Cursor&quot; button above</li>
            <li>Cursor will automatically configure WayStation as an MCP server</li>
            <li>Start using your WayStation integrations directly in Cursor</li>
          </ol>
        </div>
      )}
    </>
  );
}