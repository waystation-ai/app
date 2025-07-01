'use client';

import { ConnectionStringForm } from '@/components/app/ConnectionStringForm';
import { AuthType } from '@/marketplace/core/types';
import Link from 'next/link';

interface ProviderConnectorProps {
  provider: string;
  authType: string | null;
  isFull: boolean;
  waitlistUrl: string;
  connected: boolean;
}

export default function ProviderConnector({
  provider,
  authType,
  isFull,
  waitlistUrl,
  connected,
}: ProviderConnectorProps) {
  if (connected) {
    return (
      <div className="flex flex-col gap-4">
        <p>Connected!</p>
      </div>
    );
  }

  if (authType === AuthType.ConnectionString) {
    return (
      <ConnectionStringForm
        provider={provider}
        onConnect={() => window.location.reload()}
      />
    );
  }

  return (
    <Link
      href={isFull ? `/api/auth/${provider}/connect` : waitlistUrl}
      className="getstarted-btn"
    >
      Connect Now
    </Link>
  );
}
