'use client';

import Link from 'next/link';
import { ProviderIcon } from './ProviderIcon';

interface MarketplaceProviderCardProps {
  provider: string;
  name: string;
  description: string;
}

export default function MarketplaceProviderCard({ provider, name, description }: MarketplaceProviderCardProps) {
  return (
    <Link href={`/connect/${provider}`} className="block h-full">
      <div className="bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-lg rounded-xl p-6 flex flex-col space-y-4 hover:from-white/100 hover:to-white/70 transition-all shadow-xl hover:scale-105 duration-500 h-full">
        <div className="flex items-center space-x-4">
          <div className="relative w-12 h-12 shrink-0">
            <ProviderIcon provider={provider} width={48} height={48} />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-1">{name}</h3>
          </div>
        </div>
        <p className="flex-grow leading-relaxed">{description}</p>
      </div>
    </Link>
  );
}
