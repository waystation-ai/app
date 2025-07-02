'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTrackEvent } from '@/lib/utils/track-event';
import GDrivePickerButton from './provider-settings/GDrivePickerButton';
import { deleteConnection } from '@/app/actions';

interface ProviderCardProps {
  name: string;
  description: string;
  isConnected: boolean;
  provider: string;
  connectionType: 'oauth' | 'connection_string';
}

export default function ProviderCard({ name, description, isConnected, provider, connectionType }: ProviderCardProps) {
  const trackEvent = useTrackEvent();
  const router = useRouter();
  
  function trackConnect() {
    trackEvent(isConnected ? 'disconnectProvider' : 'connectProvider', { provider });
  }  

  async function handleDisconnect() {
    trackConnect();
    if (connectionType === 'connection_string') {
      await deleteConnection(provider);
    } else {
      router.push(`/api/auth/${provider}/disconnect`);
    }
  }

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
        
        {/* Connect/Disconnect button for all providers */}
        <div className="flex items-center space-x-2">
          {isConnected ? (
            <button
              onClick={handleDisconnect}
              className='connect-btn px-4 py-2 text-sm font-medium rounded-lg hover:scale-105 transition-transform duration-300 flex-grow text-center bg-red-500 hover:bg-red-600 text-white'
            >
              Disconnect
            </button>
          ) : (
            <Link
              href={connectionType === 'connection_string' ? `/connect/${provider}/setup` : `/api/auth/${provider}/connect`}
              onClick={trackConnect}
              prefetch={false}
              className='connect-btn px-4 py-2 text-sm font-medium rounded-lg hover:scale-105 transition-transform duration-300 flex-grow text-center bg-blue-600 hover:bg-blue-700 text-white'
            >
              Connect
            </Link>
          )}
          
          {/* Provider-specific settings buttons */}
          {isConnected && provider === 'gdrive' && (
            <GDrivePickerButton 
              className="px-2 py-2 text-sm font-medium rounded-lg bg-gray-200 hover:bg-gray-300 hover:scale-105 transition-transform duration-300"
              autoOpen={true}
            />
          )}
        </div>
      </div>
      
    </>
  );
}
