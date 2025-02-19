import Image from 'next/image';
import Link from 'next/link';

interface ProviderCardProps {
  name: string;
  description: string;
  isConnected: boolean;
  provider: string;
}

export default function ProviderCard({ name, description, isConnected, provider }: ProviderCardProps) {
  return (
    <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-lg rounded-xl p-6 flex flex-col space-y-4 hover:from-white/25 hover:to-white/15 transition-all shadow-xl shadow-white/5">
      <div className="flex items-center space-x-4">
        <div className="relative w-12 h-12 shrink-0">
          <Image src={`/images/tools/${provider}.svg`} alt={name} fill className="object-contain"/>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-1">{name}</h3>
        </div>
      </div>
      <p className="flex-grow leading-relaxed">{description}</p>
      <Link
        href={`/api/auth/${provider}/${isConnected ? 'disconnect' : 'connect'}`}
        className={`connect-btn px-4 py-2 text-sm font-medium rounded-lg hover:scale-105 transition-transform duration-300 w-2/3 text-center ${
          isConnected ? 'bg-red-500 hover:bg-red-600 text-white' : ''
        }`}
      >
        {isConnected ? 'Disconnect' : 'Connect'}
      </Link>
    </div>
  );
}
