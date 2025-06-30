'use client';

import Image from 'next/image';
import clsx from 'clsx';
import { useTrackEvent } from '@/lib/utils/track-event';
import GDrivePickerButton from './provider-settings/GDrivePickerButton';
import { useState } from 'react';
import { ConnectionStringForm } from './ConnectionStringForm';

interface ProviderCardProps {
  name: string;
  description: string;
  isConnected: boolean;
  provider: string;
  authType: string | null;
}

export default function ProviderCard({ name, description, isConnected, provider, authType }: ProviderCardProps) {
  const trackEvent = useTrackEvent();
  const [isModalOpen, setIsModalOpen] = useState(false);

  function trackConnect() {
    trackEvent(isConnected ? 'disconnectProvider' : 'connectProvider', { provider });
  }

  const handleConnectClick = async () => {
    trackConnect();
    if (isConnected) {
      // Disconnect
      if (authType === 'connection_string') {
        await fetch(`/api/auth/${provider}/connection_string`, { method: 'DELETE' });
        window.location.reload();
      } else {
        window.location.href = `/api/auth/${provider}/disconnect`;
      }
    } else {
      // Connect
      if (authType === 'connection_string') {
        setIsModalOpen(true);
      } else {
        window.location.href = `/api/auth/${provider}/connect`;
      }
    }
  };

  return (
    <>
      <div className="bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-lg rounded-xl p-6 flex flex-col space-y-4 hover:from-white/100 hover:to-white/70 transition-all shadow-xl hover:scale-105 duration-500 relative">
        <div className="flex items-center space-x-4">
          <div className="relative w-12 h-12 shrink-0">
            <Image src={`/images/tools/${provider}.svg`} alt={name} fill className="object-contain"/>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-1">{name}</h3>
          </div>
        </div>
        <p className="flex-grow leading-relaxed">{description}</p>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleConnectClick}
            className={clsx('connect-btn px-4 py-2 text-sm font-medium rounded-lg hover:scale-105 transition-transform duration-300 flex-grow text-center',
              {
                'bg-red-500 hover:bg-red-600 text-white' : isConnected,
                'bg-blue-600 hover:bg-blue-700 text-white' : !isConnected
              }
            )}>
            {isConnected ? 'Disconnect' : 'Connect'}
          </button>
          
          {isConnected && provider === 'gdrive' && (
            <GDrivePickerButton 
              className="px-2 py-2 text-sm font-medium rounded-lg bg-gray-200 hover:bg-gray-300 hover:scale-105 transition-transform duration-300"
              autoOpen={true}
            />
          )}
        </div>
      </div>
      
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Connect to {name}</h2>
            <ConnectionStringForm
              provider={provider}
              onConnect={() => {
                setIsModalOpen(false);
                window.location.reload();
              }}
            />
            <button onClick={() => setIsModalOpen(false)} className="mt-4 text-sm text-gray-600 hover:text-gray-800">Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}
